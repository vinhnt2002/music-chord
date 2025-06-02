import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!audioFile.type.includes("audio/mpeg")) {
      return NextResponse.json(
        { error: "Only MP3 files are allowed" },
        { status: 400 }
      );
    }

    // Create new FormData to send to analysis server
    const analysisFormData = new FormData();
    analysisFormData.append("audio", audioFile);

    const response = await fetch(
      "http://127.0.0.1:7788/api/chord-report",
      {
        method: "POST",
        body: analysisFormData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Analysis server responded with status: ${response.status}`
      );
    }

    const analysisResult = await response.json();

    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Error processing audio:", error);

    return NextResponse.json(
      {
        error: "Failed to process audio file",
        message:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
