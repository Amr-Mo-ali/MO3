"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface WorkPayload {
  title: string;
  client: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
}

interface VideoLightboxProps {
  work: WorkPayload | null;
  onClose: () => void;
}

function resolveEmbedUrl(videoUrl: string) {
  const url = videoUrl.trim();

  const youtubeMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i
  );

  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`; 
  }

  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/i);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`; 
  }

  return url;
}

export default function VideoLightbox({ work, onClose }: VideoLightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!work) {
    return null;
  }

  const embedUrl = resolveEmbedUrl(work.videoUrl);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-6"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950 text-lg text-white transition hover:bg-white/10"
            aria-label="Close video"
          >
            ×
          </button>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] shadow-2xl">
            <div className="relative aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={work.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <div className="space-y-4 p-6 text-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{work.client}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{work.title}</h3>
                </div>
              </div>
              {work.description ? <p className="text-sm leading-7 text-slate-400">{work.description}</p> : null}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
