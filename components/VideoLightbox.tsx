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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between px-1">
          {title ? (
            <p className="truncate pr-3 text-sm text-white">
              {title}
            </p>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#333] text-lg text-white hover:border-[#E31212]"
            aria-label="Close video"
          >
            ✕
          </button>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl bg-[#111]">
          {video.isEmbed ? (
            <iframe
              src={video.embedUrl}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title ?? "Video"}
            />
          ) : (
            <video
              src={video.streamUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full"
            />
          )}
        </div>

        <p className="mt-2 hidden text-center text-xs text-[#555] md:block">
          Press ESC or click outside to close
        </p>

        <p className="mt-2 text-center text-xs text-[#555] md:hidden">
          Tap outside to close
        </p>
      </div>
    </div>
  );
}
