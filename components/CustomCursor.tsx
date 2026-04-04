"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let requestId = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const onDown = () => setActive(true);
    const onUp = () => setActive(false);

    const animate = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(requestId);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        className={`custom-cursor-ring pointer-events-none fixed left-0 top-0 z-[9999] ${active ? "cursor-active" : ""}`}
      />
      <div ref={dotRef} className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[9999]" />
    </>
  );
}
