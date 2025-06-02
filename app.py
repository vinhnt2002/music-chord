from flask import Flask, request, jsonify, send_file
import os
import uuid
import tempfile
import essentia
import essentia.standard as es
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from essentia.standard import MonoLoader, RhythmExtractor2013
import logging
from scipy import signal
from collections import Counter


# Suppress Essentia warnings in the response (optional)
logging.getLogger("essentia").setLevel(logging.ERROR)

app = Flask(__name__)

# Set upload folder
UPLOAD_FOLDER = tempfile.gettempdir()
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50MB max upload


def convert_chord_format(essentia_chord):
    """
    Convert Essentia's chord notation to the desired format (e.g., 'C:min', 'G#:maj7').
    """
    if essentia_chord == "N":
        return "N"  # No chord detected, keep as is
    # Split the chord into root and quality
    root = essentia_chord[0]  # First character is the root note
    quality = (
        essentia_chord[1:] if len(essentia_chord) > 1 else "maj"
    )  # Default to major if no quality

    # Handle flats and sharps
    if len(essentia_chord) > 1 and essentia_chord[1] in ("b", "#"):
        root = essentia_chord[:2]
        quality = essentia_chord[2:] if len(essentia_chord) > 2 else "maj"

    # Map Essentia quality to desired format
    if quality == "m":
        quality = "min"
    elif quality == "7":
        quality = "7"
    elif quality == "m7":
        quality = "min7"
    elif quality == "maj7":
        quality = "maj7"
    elif quality == "sus4":
        quality = "sus4"
    elif quality == "":
        quality = "maj"  # Default for root-only chords (e.g., "C" -> "C:maj")
    else:
        quality = quality.lower()  # Fallback for unrecognized qualities

    return f"{root}:{quality}"


# Helper function to convert NumPy types to native Python types
def convert_to_json_serializable(obj):
    """Convert NumPy types to JSON serializable Python types"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_to_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_json_serializable(item) for item in obj]
    else:
        return obj


def analyze_bar_length_comprehensive(audio):
    """
    Comprehensive analysis of bar length using multiple methods and combining results.
    Takes audio samples as input and returns the most likely bar length.
    """
    odf = es.OnsetDetection(method="hfc")
    window = es.Windowing(type="hann")
    spectrum = es.Spectrum()
    frame_size = 1024
    hop_size = 512
    sample_rate = 44100
    frame_gen = es.FrameGenerator(audio, frameSize=frame_size, hopSize=hop_size)

    odf_values = []
    frame_times = [0]

    for frame in frame_gen:
        # Compute the spectrum
        spec = spectrum(window(frame))
        mag = spec
        phase = np.zeros_like(mag, dtype=np.float32)  # Ensure float32
        odf_value = odf(mag, phase)
        odf_values.append([odf_value])  # Store as a 1-element list for 2D structure
        frame_times.append(frame_times[-1] + hop_size / sample_rate)

    if not odf_values:
        raise ValueError("No ODF values computed; audio may be too short or silent.")

    # Convert to 2D NumPy array with explicit dtype
    odf_matrix = np.array(odf_values, dtype=np.float32)  # Shape should be (n_frames, 1)
    time_vector = np.array(frame_times[:-1], dtype=np.float32)

    # Debugging: Check shapes and types
    print(f"odf_matrix shape: {odf_matrix.shape}, dtype: {odf_matrix.dtype}")
    print(f"time_vector shape: {time_vector.shape}, dtype: {time_vector.dtype}")

    # Detect onsets
    onsets = es.Onsets()(odf_matrix, time_vector)

    # Detect onsets
    # onsets = es.Onsets()(odf_values, frame_times)
    # Extract rhythm information using RhythmExtractor
    rhythm_extractor = RhythmExtractor2013()
    bpm, beats, beats_confidence, _, beats_loudness = rhythm_extractor(audio)

    # Calculate inter-beat intervals
    beat_intervals = np.diff(beats)

    # Check if we have enough beats for analysis
    if len(beats) < 8:
        return (
            4,
            float(bpm),
            float(beats_confidence),
        )  # Default to 4/4 if not enough beats

    # Calculate beat strengths
    frame_size = 4096
    hop_size = 2048
    sample_rate = 44100
    window = es.Windowing(type="hann")
    spectrum = es.Spectrum()
    onset_detection = es.OnsetDetection(method="complex")
    onset_curve = []

    for frame in es.FrameGenerator(
        audio, frameSize=frame_size, hopSize=hop_size, startFromZero=True
    ):
        spec = spectrum(window(frame))
        onset_val = onset_detection(spec, spec)
        onset_curve.append(onset_val)

    # Convert onset curve to numpy array
    onset_curve = np.array(onset_curve)

    # Extract beat strength at each beat position
    beat_strengths = []
    for beat_time in beats:
        # Find the nearest frame to the beat time
        frame_idx = int(beat_time * sample_rate / hop_size)
        if 0 <= frame_idx < len(onset_curve):
            beat_strengths.append(onset_curve[frame_idx])
        else:
            beat_strengths.append(0)

    beat_strengths = np.array(beat_strengths)

    # METHOD 1: Analyze beat strength patterns through autocorrelation
    method1_bar_length = 4  # Default
    if len(beat_strengths) >= 16:
        # Normalize beat strengths
        if np.std(beat_strengths) > 0:
            beat_strengths_norm = (beat_strengths - np.mean(beat_strengths)) / np.std(
                beat_strengths
            )

            # Compute autocorrelation
            autocorr = np.correlate(
                beat_strengths_norm, beat_strengths_norm, mode="full"
            )
            autocorr = autocorr[len(autocorr) // 2 :]  # Take positive lags only

            # Find peaks in autocorrelation
            peaks, _ = signal.find_peaks(
                autocorr, height=0.2 * np.max(autocorr), distance=2
            )

            # Filter out the zero lag peak
            peaks = peaks[peaks > 0]

            # Look for common time signatures (2, 3, 4, 6, 8, 12)
            common_meters = [2, 3, 4, 6, 8, 12]

            if len(peaks) > 0:
                # Find the most prominent peak that corresponds to a common meter
                for peak in peaks:
                    if peak in common_meters:
                        method1_bar_length = int(peak)
                        break

                # If no common meter found, use the first significant peak
                if method1_bar_length == 4 and peaks[0] >= 2 and peaks[0] <= 12:
                    method1_bar_length = int(peaks[0])

    # METHOD 2: Original approach from first file - autocorrelation of beat strengths
    beat_intervals = np.diff(beats)
    method2_bar_length = 4  # Default
    possible_bar_lengths = [2, 3, 4, 6, 8]
    autocorrelations = []

    # Normalize beat strengths for method 2
    if beat_strengths.max() != beat_strengths.min():
        beat_strengths_norm2 = (beat_strengths - beat_strengths.min()) / (
            beat_strengths.max() - beat_strengths.min()
        )
    else:
        beat_strengths_norm2 = beat_strengths

    for bar_len in possible_bar_lengths:
        # Compute autocorrelation for this potential bar length
        if len(beat_strengths_norm2) >= 2 * bar_len:
            corr = np.corrcoef(
                beat_strengths_norm2[0 : len(beat_strengths_norm2) - bar_len],
                beat_strengths_norm2[bar_len : len(beat_strengths_norm2)],
            )[0, 1]
            autocorrelations.append((bar_len, corr))

    if autocorrelations:
        autocorrelations.sort(key=lambda x: x[1], reverse=True)
        method2_bar_length = int(autocorrelations[0][0])

    # METHOD 3: Analyze time intervals between significant beats
    method3_bar_length = 4  # Default
    if len(beat_intervals) >= 12:
        # Compute the coefficient of variation to check for regularity
        cv = np.std(beat_intervals) / np.mean(beat_intervals)

        # More regular beats (lower CV) suggest simpler meters
        if cv < 0.1:  # Very regular beats
            # Look for strong beat patterns
            method3_candidates = []

            for i in range(2, min(6, len(beat_intervals) // 2)):
                # Check if every i-th beat is stronger
                if len(beat_strengths) >= 2 * i:
                    pattern = beat_strengths[::i]
                    if np.mean(pattern) > 1.2 * np.mean(beat_strengths):
                        method3_candidates.append(i)

            if method3_candidates:
                method3_bar_length = int(method3_candidates[0])

    # METHOD 4: FFT analysis of beat loudness patterns
    method4_bar_length = 4  # Default
    if len(beats_loudness) >= 16:
        fft_beats = np.abs(np.fft.fft(beats_loudness))
        fft_freqs = np.fft.fftfreq(len(beats_loudness))

        # Find the strongest frequency component
        positive_freqs = fft_freqs[1 : len(fft_freqs) // 2]
        positive_fft = fft_beats[1 : len(fft_beats) // 2]

        if len(positive_freqs) > 0:
            # Find the strongest frequency component
            max_idx = np.argmax(positive_fft)
            strongest_freq = positive_freqs[max_idx]

            # Convert to period (representing bars)
            period = abs(1.0 / strongest_freq)

            # Round to nearest integer if close to one
            if abs(period - round(period)) < 0.2:
                method4_bar_length = int(round(period))
    method5_bar_length = 4  # Default
    if len(beat_strengths) >= 16:
        # Compute the real cepstrum
        spectrum = np.abs(np.fft.fft(beat_strengths)) ** 2
        cepstrum = np.real(np.fft.ifft(np.log(spectrum + 1e-10)))

        # Look for prominent periodicities between 2 and 12 beats
        cepstrum_window = cepstrum[2:13]  # Focus on typical bar lengths
        if len(cepstrum_window) > 0:
            peak_idx = (
                np.argmax(np.abs(cepstrum_window)) + 2
            )  # Add 2 to account for offset
            if 2 <= peak_idx <= 12:
                method5_bar_length = int(peak_idx)

    # METHOD 6: Beat interval clustering
    method6_bar_length = 4  # Default
    if len(beat_intervals) >= 12:
        from sklearn.cluster import KMeans

        # Reshape intervals for clustering
        intervals_reshaped = beat_intervals.reshape(-1, 1)

        # Try clustering into 2-6 groups
        best_score = -np.inf
        best_length = 4

        for n_clusters in range(2, 7):
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            labels = kmeans.fit_predict(intervals_reshaped)

            # Calculate silhouette score to evaluate clustering quality
            if len(np.unique(labels)) > 1:
                from sklearn.metrics import silhouette_score  # type: ignore

                score = silhouette_score(intervals_reshaped, labels)
                if score > best_score:
                    best_score = score
                    # Estimate bar length from cluster centers
                    cluster_centers = kmeans.cluster_centers_.flatten()
                    if len(cluster_centers) > 0:
                        typical_beat = np.median(cluster_centers)
                        if typical_beat > 0:
                            beats_per_bar = round(
                                np.mean(beat_intervals) / typical_beat
                            )
                            if 2 <= beats_per_bar <= 12:
                                best_length = int(beats_per_bar)

        method6_bar_length = best_length

    # METHOD 7: Onset envelope periodicity analysis
    method7_bar_length = 4  # Default
    if (
        "onsets" in locals() and len(onsets) >= 16
    ):  # Assuming onsets from Essentia analysis
        # Create an onset envelope
        onset_env = np.zeros(int(max(onsets) * sample_rate) + 1)
        onset_samples = (onsets * sample_rate).astype(int)
        onset_env[onset_samples] = 1

        # Compute autocorrelation of onset envelope
        env_autocorr = np.correlate(onset_env, onset_env, mode="full")
        env_autocorr = env_autocorr[len(env_autocorr) // 2 :]

        # Find peaks corresponding to possible bar lengths
        peaks, _ = signal.find_peaks(
            env_autocorr,
            height=0.1 * np.max(env_autocorr),
            distance=int(sample_rate * 0.2),
        )  # Min 200ms separation

        if len(peaks) > 0:
            # Convert peak position to beats using average beat duration
            avg_beat_duration = np.mean(beat_intervals)
            if avg_beat_duration > 0:
                beats_per_peak = peaks * (1.0 / sample_rate) / avg_beat_duration
                for beat_count in beats_per_peak:
                    rounded_count = round(beat_count)
                    if 2 <= rounded_count <= 12:
                        method7_bar_length = int(rounded_count)
                        break

    # Combine the results from all methods using voting
    bar_length_candidates = [
        method1_bar_length,
        method2_bar_length,
        method3_bar_length,
        method4_bar_length,
        method5_bar_length,
        method6_bar_length,
        method7_bar_length,
    ]
    print(bar_length_candidates, "bar")
    # Use the most common value or 4 as default
    bar_length_counter = Counter(bar_length_candidates)
    most_common = bar_length_counter.most_common(1)[0][0]
    print(bar_length_counter, "bar_length_counter")
    # Ensure the bar length is within reasonable bounds
    final_bar_length = int(most_common) if 2 <= most_common <= 12 else 4

    return final_bar_length, float(bpm), float(beats_confidence)


def analyze_audio_file_comprehensive(audio_file):
    """
    Comprehensive analysis of an audio file, providing both bar length and chord information.
    """
    # Load the audio file
    loader = MonoLoader(filename=audio_file)
    audio = loader()

    # Determine bar length using the comprehensive method
    bar_length, bpm, beats_confidence = analyze_bar_length_comprehensive(audio)

    # Extract full rhythm information again to get beats for visualization
    rhythm_extractor = RhythmExtractor2013()
    _, beats, _, _, beats_loudness = rhythm_extractor(audio)

    # Calculate beat strengths for visualization
    frame_size = 4096
    hop_size = 2048
    sample_rate = 44100
    window = es.Windowing(type="hann")
    spectrum = es.Spectrum()
    onset_detection = es.OnsetDetection(method="complex")
    onset_curve = []

    for frame in es.FrameGenerator(
        audio, frameSize=frame_size, hopSize=hop_size, startFromZero=True
    ):
        spec = spectrum(window(frame))
        onset_val = onset_detection(spec, spec)
        onset_curve.append(onset_val)

    # Extract beat strength at each beat position for visualization
    beat_strengths = []
    for beat_time in beats:
        frame_idx = int(beat_time * sample_rate / hop_size)
        if 0 <= frame_idx < len(onset_curve):
            beat_strengths.append(onset_curve[frame_idx])
        else:
            beat_strengths.append(0)

    beat_strengths = np.array(beat_strengths)

    # Normalize beat strengths for visualization
    if beat_strengths.max() != beat_strengths.min():
        beat_strengths = (beat_strengths - beat_strengths.min()) / (
            beat_strengths.max() - beat_strengths.min()
        )

    # Optional: Analyze chords if needed (from the chord analysis code)
    chords_data = analyze_chords(audio, sample_rate)

    # Generate visualization
    plot_filename = f"{uuid.uuid4()}.png"
    plot_path = os.path.join(app.config["UPLOAD_FOLDER"], plot_filename)

    plt.figure(figsize=(10, 6))
    plt.subplot(2, 1, 1)
    plt.plot(beats[: len(beat_strengths)], beat_strengths, "bo-")
    plt.title(f"Beat Strengths (BPM: {bpm:.1f}, Bar Length: {bar_length})")
    plt.xlabel("Time (s)")
    plt.ylabel("Normalized Strength")

    # Plot the beats with colors to show potential bars
    plt.subplot(2, 1, 2)
    colors = ["r", "g", "b", "y", "c", "m"]

    for i, beat in enumerate(beats):
        bar_position = i % bar_length
        plt.axvline(
            x=beat,
            color=colors[bar_position % len(colors)],
            alpha=0.5,
            linestyle="-",
        )

    plt.title(f"Beat Positions (colored by position in {bar_length}-beat bar)")
    plt.xlabel("Time (s)")
    plt.xlim(beats[0] if len(beats) > 0 else 0, beats[-1] if len(beats) > 0 else 10)
    plt.yticks([])

    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()
    chords = chords_data["chordsInfo"]
    chords = [convert_chord_format(chord) for chord in chords]
    timestamps = [i * hop_size / sample_rate for i in range(len(chords))]
    chord_report = []
    beat_index = 0
    chord_index = 0

    try:
        while beat_index < len(beats) and chord_index < len(timestamps):
            beat_time = beats[beat_index]
            while (
                chord_index < len(timestamps) - 1
                and timestamps[chord_index + 1] <= beat_time
            ):
                chord_index += 1
            chord = chords[chord_index]

            beat_in_bar = (beat_index % bar_length) + 1  # Use calculated bar length
            # start_time = beat_time
            # end_time = (
            #     beats[beat_index + 1]
            #     if beat_index + 1 < len(beats)
            #     else (
            #         start_time + np.mean(beat_intervals)
            #         if len(beat_intervals) > 0
            #         else start_time + 0.5
            # )
            # )

            line = f"{beat_in_bar};{chord}"
            # line = f"{beat_in_bar};{chord};{start_time:.2f};{end_time:.2f}"
            chord_report.append(line)
            beat_index += 1
    except Exception as e:
        return {"error": f"Chord assignment loop failed: {str(e)}"}

    # Build results dictionary
    results = {
        "bpm": float(bpm),
        "beats_confidence": float(beats_confidence),
        "num_beats_detected": int(len(beats)),
        "likely_bar_length": int(bar_length),
        "visualization_path": plot_filename,
        "chordsDetail": "\n".join(chord_report),
    }

    # Add chord information if available
    if chords_data and "chordSummary" in chords_data:
        results["chord_summary"] = chords_data["chordSummary"]

    return results


def analyze_chords(audio, sample_rate=44100):
    """
    Analyze chords in audio data using Essentia.
    """
    try:
        # Parameters for chord detection
        frame_size = 4096
        hop_size = 2048

        # Algorithms for chord detection
        window = es.Windowing(type="hann")
        spectrum = es.Spectrum()
        spectral_peaks = es.SpectralPeaks()
        hpcp = es.HPCP(size=12)  # Fixed size for consistency
        chords_detection = es.ChordsDetection(sampleRate=sample_rate, hopSize=hop_size)
        # Process audio frame by frame for chords
        hpcp_frames = []
        for frame in es.FrameGenerator(
            audio, frameSize=frame_size, hopSize=hop_size, startFromZero=True
        ):
            spec = spectrum(window(frame))
            frequencies, magnitudes = spectral_peaks(spec)

            if len(frequencies) == 0 or len(magnitudes) == 0:
                hpcp_vector = np.zeros(12, dtype=np.float32)
            else:
                try:
                    hpcp_vector = hpcp(frequencies, magnitudes)
                    hpcp_vector = np.asarray(hpcp_vector, dtype=np.float32)
                    if hpcp_vector.shape != (12,):
                        hpcp_vector = np.zeros(12, dtype=np.float32)
                except Exception:
                    hpcp_vector = np.zeros(12, dtype=np.float32)

            if hpcp_vector.shape != (12,):
                hpcp_vector = np.zeros(12, dtype=np.float32)
            hpcp_frames.append(hpcp_vector)

        # Convert to NumPy array and detect chords
        if not hpcp_frames:
            return {"error": "No HPCP frames generated"}
        hpcp_array = np.array(hpcp_frames, dtype=np.float32)

        if hpcp_array.ndim != 2 or hpcp_array.shape[1] != 12:
            return {"error": f"Invalid HPCP array shape: {hpcp_array.shape}"}

        chords, _ = chords_detection(hpcp_array)

        # Convert chords to desired format
        chords = [convert_chord_format(chord) for chord in chords]

        # Generate chord summary (unique chords)
        chord_summary = sorted(list(set(chords)))  # Unique chords, sorted

        return {"chordSummary": chord_summary, "chordsInfo": chords}
    except Exception as e:
        return {"error": f"Chord analysis failed: {str(e)}"}


@app.route("/analyze_bar_length", methods=["POST"])
def analyze_audio_file_endpoint():
    """API endpoint to analyze an uploaded audio file"""

    # Check if file was uploaded
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    # Check if filename is empty
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Check if file is allowed
    allowed_extensions = {"mp3", "wav", "ogg", "flac"}
    if (
        "." not in file.filename
        or file.filename.rsplit(".", 1)[1].lower() not in allowed_extensions
    ):
        return (
            jsonify({"error": f'File must be one of: {", ".join(allowed_extensions)}'}),
            400,
        )

    # Save the file temporarily
    temp_file_path = os.path.join(
        app.config["UPLOAD_FOLDER"], f"{uuid.uuid4()}.{file.filename.rsplit('.', 1)[1]}"
    )
    file.save(temp_file_path)

    try:
        # Analyze the file with comprehensive analysis
        analysis_results = analyze_audio_file_comprehensive(temp_file_path)

        # Convert NumPy types to Python types for JSON serialization
        analysis_results = convert_to_json_serializable(analysis_results)

        # Return the analysis results
        return jsonify(
            {
                "success": True,
                "filename": file.filename,
                "analysis": analysis_results,
                "visualization_url": (
                    f"/visualization/{analysis_results['visualization_path']}"
                    if analysis_results["visualization_path"]
                    else None
                ),
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up - remove the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.route("/api/chord-report", methods=["POST"])
def chord_report():
    """
    API endpoint to upload an MP3 file and get a chord and beat report with BPM, barLength, and chord summary.
    Expects a file upload with key 'audio'.
    """
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    if audio_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not audio_file.filename.endswith((".mp3", ".wav", ".ogg", ".flac")):
        return jsonify({"error": "File must be an MP3, WAV, OGG, or FLAC"}), 400

    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, audio_file.filename)
    audio_file.save(temp_path)

    try:
        # Get comprehensive analysis
        analysis_results = analyze_audio_file_comprehensive(temp_path)

        # Convert NumPy types to Python types for JSON serialization
        analysis_results = convert_to_json_serializable(analysis_results)

        # Return results
        return (
            jsonify(
                {
                    "bpm": analysis_results["bpm"],
                    "barLength": analysis_results["likely_bar_length"],
                    "chordSummary": analysis_results.get("chord_summary", []),
                    "chordsDetail": analysis_results["chordsDetail"],
                    "visualizationUrl": (
                        f"/visualization/{analysis_results['visualization_path']}"
                        if "visualization_path" in analysis_results
                        else None
                    ),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)


@app.route("/visualization/<filename>")
def get_visualization(filename):
    """Serve visualization images"""
    return send_file(os.path.join(app.config["UPLOAD_FOLDER"], filename))


if __name__ == "__main__":
    # Create upload directory if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    # Start the Flask app
    app.run(debug=True, host="0.0.0.0", port=7788)
