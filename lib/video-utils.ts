export type VideoType = "drive" | "youtube" | "vimeo" | "direct";

export interface VideoData {
  type: VideoType;
  embedUrl: string;
  streamUrl: string;
  isEmbed: boolean;
}

function buildYouTubeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playlist=${id}`;
}

function buildVimeoEmbedUrl(id: string) {
  return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&autopause=0`;
}

export function parseVideoUrl(url: string): VideoData {
  const trimmedUrl = url?.trim() ?? "";

  if (!trimmedUrl) {
    return { type: "direct", embedUrl: "", streamUrl: "", isEmbed: false };
  }

  const driveMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch) {
    const id = driveMatch[1];
    return {
      type: "drive",
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      streamUrl: `https://drive.google.com/uc?export=download&id=${id}`,
      isEmbed: true,
    };
  }

  const youtubeMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?/]+)/i);
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return {
      type: "youtube",
      embedUrl: buildYouTubeEmbedUrl(id),
      streamUrl: trimmedUrl,
      isEmbed: true,
    };
  }

  const vimeoMatch = trimmedUrl.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      type: "vimeo",
      embedUrl: buildVimeoEmbedUrl(id),
      streamUrl: trimmedUrl,
      isEmbed: true,
    };
  }

  return {
    type: "direct",
    embedUrl: trimmedUrl,
    streamUrl: trimmedUrl,
    isEmbed: false,
  };
}
