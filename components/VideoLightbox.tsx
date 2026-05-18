"use client";

import { useEffect } from "react";
import { parseVideoUrl } from "@/lib/video-utils";

interface Props {
  url: string;
  title?: string;
  onClose: () => void;
}

export default function VideoLightbox({ url, title, onClose }: Props) {
  const video = parseVideoUrl(url);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!url) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          {title ? (
            <p className="truncate pr-4 text-sm font-medium text-white">
              {title}
            </p>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#333] text-[#888] transition-colors hover:border-[#E31212] hover:text-white"
            aria-label="Close video"
          >
            X
          </button>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#222] bg-[#111]">
          {video.isEmbed ? (
            <iframe
              src={
                video.type === "youtube"
                  ? video.embedUrl.replace("controls=0", "controls=1")
                  : video.embedUrl
              }
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={title ?? "Video"}
            />
          ) : (
            <video
              src={video.streamUrl}
              controls
              autoPlay
              className="h-full w-full"
            />
          )}
        </div>

        <p className="mt-3 text-center text-xs text-[#555]">
          Press ESC or click outside to close
        </p>
      </div>
    </div>
  );
}
