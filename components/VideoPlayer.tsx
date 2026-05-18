"use client";

import { parseVideoUrl } from "@/lib/video-utils";

interface Props {
  url: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  objectFit?: "cover" | "contain";
}

export default function VideoPlayer({
  url,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  className = "",
  objectFit = "cover",
}: Props) {
  const video = parseVideoUrl(url);

  if (!url) return null;

  if (video.isEmbed) {
    return (
      <iframe
        src={video.embedUrl}
        className={className}
        style={{ border: "none" }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Embedded video"
      />
    );
  }

  return (
    <video
      src={video.streamUrl}
      autoPlay={autoPlay}
      controls={controls}
      loop={loop}
      muted={muted}
      playsInline
      className={className}
      style={{ objectFit }}
    />
  );
}
