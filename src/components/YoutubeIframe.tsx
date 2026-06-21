/// <reference types="youtube" />

import { useEffect, useMemo, useRef, useState } from "react";
import { loadYouTubeAPI } from "./loadYoutubeApi.js";

type Props = {
  url: string;
};

function YoutubeIframe({ url }: Props) {
  const iframeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [error, setError] = useState<{
    videoId: string;
    message: string;
  } | null>(null);
  const videoId = useMemo(() => extractVideoId(url), [url]);

  useEffect(() => {
    if (!url || !videoId) return;

    let cancelled = false;

    loadYouTubeAPI()
      .then((youtubeApi) => {
        if (cancelled || !iframeRef.current) return;

        playerRef.current = new youtubeApi.Player(iframeRef.current, {
          height: "100%",
          width: "100%",
          videoId,
          events: {
            onReady: () => {
              iframeRef.current?.classList.add("border-black-500");
            },
            onStateChange: () => {
              console.log("Player state changed");
            },
          },
        });
      })
      .catch((apiError: unknown) => {
        if (!cancelled) {
          console.error(apiError);
          setError({
            videoId,
            message: "Unable to load the YouTube player.",
          });
        }
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [url, videoId]);

  if (!url) {
    return <div>No video URL provided.</div>;
  }

  if (!videoId) {
    return <div>Invalid YouTube URL.</div>;
  }

  if (error?.videoId === videoId) {
    return <div>{error.message}</div>;
  }

  return (
    <div
      ref={iframeRef}
      className="aspect-video h-full w-auto max-h-full max-w-full rounded-border border-4"
    />
  );
}

function extractVideoId(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/")[2] ?? "";
    }

    return parsedUrl.searchParams.get("v") ?? "";
  } catch {
    const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/);
    return match?.[1] ?? "";
  }
}

export { YoutubeIframe };
