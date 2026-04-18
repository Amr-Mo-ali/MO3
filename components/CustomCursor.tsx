"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't show custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let requestId = 0;
    let hideTimeout = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      // Show cursor when mouse moves
      if (hidden) setHidden(false);
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      
      // Clear and reset hide timeout
      clearTimeout(hideTimeout);
      hideTimeout = window.setTimeout(() => {
        setHidden(true);
      }, 3000);
    };

    const onDown = () => setActive(true);
    const onUp = () => setActive(false);

    // Handle keyboard navigation - hide custom cursor when Tab is pressed
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setHidden(true);
      }
    };

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
    window.addEventListener("keydown", onKeyDown);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(requestId);
      clearTimeout(hideTimeout);
    };
  }, [hidden]);

  if (!enabled || hidden) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        className={`custom-cursor-ring pointer-events-none fixed left-0 top-0 z-[9999] ${active ? "cursor-active" : ""}`}
        aria-hidden="true"
      />
      <div 
        ref={dotRef} 
        className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[9999]"
        aria-hidden="true"
      />
    </>
  );
}
