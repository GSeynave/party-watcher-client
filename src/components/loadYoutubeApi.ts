/// <reference types="youtube" />

const YOUTUBE_IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

let ytApiPromise: Promise<typeof YT> | null = null;

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function loadYouTubeAPI(): Promise<typeof YT> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();

      if (window.YT?.Player) {
        resolve(window.YT);
        return;
      }

      reject(new Error("YouTube iframe API loaded without YT.Player."));
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${YOUTUBE_IFRAME_API_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("error", () => {
        ytApiPromise = null;
        reject(new Error("Failed to load the YouTube iframe API."));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = YOUTUBE_IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      ytApiPromise = null;
      reject(new Error("Failed to load the YouTube iframe API."));
    };

    document.head.appendChild(script);
  });

  return ytApiPromise;
}
