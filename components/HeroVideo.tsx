"use client";

import { useEffect, useRef } from "react";
import { parseVideoUrl } from "@/lib/video-utils";

interface Props {
  url: string;
  posterUrl?: string | null;
  title?: string;
  className?: string;
}

export default function HeroVideo({ url, posterUrl, title = "Hero video", className = "" }: Props) {
  const video = parseVideoUrl(url);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = true;
    videoElement.play().catch(() => {
      videoElement.setAttribute("muted", "");
      videoElement.load();
      videoElement.play();
    });
  }, []);

  if (!url) {
    return null;
  }

  if (video.isEmbed) {
    return (
      <iframe
        src={video.embedUrl}
        className={className}
        style={{
          border: "none",
          pointerEvents: "none",
          transform: "scale(1.15)",
          transformOrigin: "center",
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={video.streamUrl}
      autoPlay
      muted
      loop
      playsInline
      poster={posterUrl ?? undefined}
      className={className}
    />
  );
}
