import { youtube, youtube_v3 } from "@googleapis/youtube";
import { NextResponse } from "next/server";

const youtubeClient = youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// type SearchResult = {
//   type: "song" | "album" | "artist";
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   channelTitle?: string;
//   publishedAt: string;
// };

type SearchResponse = {
  success: boolean;
  results: any[];
  totalResults: number;
  resultsPerPage: number;
  nextPageToken?: string | null;
  prevPageToken?: string | null;
};

type ErrorResponse = {
  error: string;
  message?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const maxResults = Math.min(
      Number(searchParams.get("maxResults")) || 20,
      50
    );
    const pageToken = searchParams.get("pageToken") || undefined;
    const type = searchParams.get("type") || "all";

    if (!q) {
      return NextResponse.json<ErrorResponse>(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Filter search types based on type parameter
    let searchTypes = ["video", "playlist", "channel"];
    if (type !== "all") {
      switch (type) {
        case "song":
          searchTypes = ["video"];
          break;
        case "album":
          searchTypes = ["playlist"];
          break;
        case "artist":
          searchTypes = ["channel"];
          break;
      }
    }

    const response = await youtubeClient.search.list({
      q: q,
      maxResults: maxResults,
      part: ["snippet"],
      type: searchTypes,
      pageToken: pageToken,
      // videoCategoryId: "10",
    });

    if (!response.data.items) {
      return NextResponse.json<ErrorResponse>(
        { error: "No results found" },
        { status: 404 }
      );
    }

    const results = response.data.items
      .map((item): any | null => {
        const snippet = item.snippet;
        if (!snippet || !item.id || !snippet.thumbnails?.default?.url)
          return null;

        switch (item.id.kind) {
          case "youtube#video":
            return item.id.videoId
              ? {
                  type: "song",
                  id: item.id.videoId,
                  title: snippet.title || "",
                  description: snippet.description || "",
                  thumbnail: snippet.thumbnails.default.url,
                  channelTitle: snippet.channelTitle || "",
                  publishedAt: snippet.publishedAt || "",
                  ...item,
                }
              : null;

          case "youtube#playlist":
            return item.id.playlistId
              ? {
                  type: "album",
                  id: item.id.playlistId,
                  title: snippet.title || "",
                  description: snippet.description || "",
                  thumbnail: snippet.thumbnails.default.url,
                  channelTitle: snippet.channelTitle || "",
                  publishedAt: snippet.publishedAt || "",
                  ...item,
                }
              : null;

          case "youtube#channel":
            return item.id.channelId
              ? {
                  type: "artist",
                  id: item.id.channelId,
                  title: snippet.title || "",
                  description: snippet.description || "",
                  thumbnail: snippet.thumbnails.default.url,
                  publishedAt: snippet.publishedAt || "",
                  ...item,
                }
              : null;

          default:
            return null;
        }
      })
      .filter((item): item is any => item !== null);

    return NextResponse.json<SearchResponse>({
      success: true,
      results: results,
      totalResults: response.data.pageInfo?.totalResults || 0,
      resultsPerPage: response.data.pageInfo?.resultsPerPage || 0,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken,
    });
  } catch (error) {
    console.error("YouTube API error:", error);

    if (error instanceof Error) {
      const apiError = error as { response?: { status: number } };
      if (apiError.response?.status === 403) {
        return NextResponse.json<ErrorResponse>(
          { error: "API quota exceeded or invalid API key" },
          { status: 403 }
        );
      }

      return NextResponse.json<ErrorResponse>(
        {
          error: "Internal server error",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
