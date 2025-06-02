"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Music2, Loader2 } from "lucide-react";

interface UploadResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export default function AudioUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] =
    useState<UploadResponse | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/upload-song", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Upload result:", result);
      setUploadResult(result);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResult({
        success: false,
        error: "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl
          p-8 text-center cursor-pointer transition-all
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="flex justify-center">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            ) : (
              <div className="rounded-full bg-gray-100 p-3">
                <Upload className="h-8 w-8 text-gray-500" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
              {isDragActive
                ? "Drop your audio here"
                : "Upload your audio file"}
            </h3>

            <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <Music2 className="h-4 w-4" />
              <span>MP3 files only</span>
            </div>

            <p className="text-xs text-gray-500">
              Drag and drop or click to select
            </p>
          </div>
        </div>
      </div>

      {/* Upload Result Display */}
      {uploadResult && (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${
            uploadResult.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {uploadResult.success ? (
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Upload successful!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>×</span>
              <span>
                {uploadResult.error || uploadResult.message}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
