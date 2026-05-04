"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Work } from "@/types";

type MappedWork = Work & {
  sectionTitle: string;
};

interface WorkMapProps {
  works: MappedWork[];
  onSelectWork?: (workId: string) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

let googleMapsScriptPromise: Promise<any> | null = null;

function loadGoogleMapsApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser."));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Add it to your environment to enable the work map.")
    );
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps."));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

function buildMarkerContent(city: string, isSelected: boolean) {
  const marker = document.createElement("button");
  marker.type = "button";
  marker.className = "work-map-marker";
  marker.setAttribute("aria-label", `View project in ${city}`);
  marker.innerHTML = `
    <span class="work-map-marker__pin ${isSelected ? "is-selected" : ""}">
      <span class="work-map-marker__core"></span>
    </span>
    <span class="work-map-marker__label">${city}</span>
  `;
  return marker;
}

export default function WorkMap({ works, onSelectWork }: WorkMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(works[0]?.id ?? null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const mappableWorks = useMemo(
    () =>
      works.filter(
        (work) =>
          work.showOnMap &&
          typeof work.locationLat === "number" &&
          typeof work.locationLng === "number" &&
          work.locationCity
      ),
    [works]
  );

  useEffect(() => {
    if (!mappableWorks.length) {
      setStatus("error");
      setError("No mapped projects are available yet.");
      return;
    }

    let cancelled = false;

    async function initMap() {
      try {
        setStatus("loading");
        setError(null);
        const google = await loadGoogleMapsApi();
        if (cancelled || !mapRef.current) return;

        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        const map = new Map(mapRef.current, {
          center: {
            lat: mappableWorks[0].locationLat,
            lng: mappableWorks[0].locationLng,
          },
          zoom: mappableWorks.length === 1 ? 8 : 3,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID",
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });

        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new google.maps.InfoWindow();
        mapInstanceRef.current = map;
        infoWindowRef.current = infoWindow;

        markersRef.current.forEach((marker) => {
          marker.map = null;
        });

        markersRef.current = mappableWorks.map((work) => {
          bounds.extend({ lat: work.locationLat, lng: work.locationLng });

          const markerContent = buildMarkerContent(work.locationCity!, work.id === selectedWorkId);
          markerContent.addEventListener("click", () => {
            setSelectedWorkId(work.id);
            onSelectWork?.(work.id);

            infoWindow.setContent(`
              <div class="work-map-popup">
                <p class="work-map-popup__eyebrow">${work.sectionTitle}</p>
                <h3 class="work-map-popup__title">${work.title}</h3>
                <p class="work-map-popup__meta">${work.client ?? "Client project"} · ${work.locationCity}${work.locationCountry ? `, ${work.locationCountry}` : ""}</p>
                ${work.description ? `<p class="work-map-popup__body">${work.description}</p>` : ""}
              </div>
            `);
            infoWindow.open({
              anchor: marker,
              map,
            });
          });

          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: work.locationLat, lng: work.locationLng },
            title: `${work.title} in ${work.locationCity}`,
            content: markerContent,
          });

          marker.addListener("click", () => markerContent.click());
          return marker;
        });

        if (mappableWorks.length > 1) {
          map.fitBounds(bounds, 72);
        }

        setStatus("ready");
      } catch (mapsError: any) {
        if (cancelled) return;
        setStatus("error");
        setError(mapsError?.message || "Unable to load the work map.");
      }
    }

    initMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current = [];
    };
  }, [mappableWorks, onSelectWork, selectedWorkId]);

  useEffect(() => {
    if (!selectedWorkId) return;
    const selected = mappableWorks.find((work) => work.id === selectedWorkId);
    if (!selected || !mapInstanceRef.current) return;

    mapInstanceRef.current.panTo({
      lat: selected.locationLat,
      lng: selected.locationLng,
    });
  }, [mappableWorks, selectedWorkId]);

  return (
    <section id="work-map" className="border-t border-[color:var(--color-border)] bg-[color:var(--background)] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[color:var(--color-primary)]">
            Global Reach
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.04em] text-[color:var(--color-white)] sm:text-6xl">
            Where The Work Lands
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--color-gray-light)] sm:text-base">
            Every marker represents a real client location connected to a published project in the portfolio.
            Select a city to jump to that work instantly.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.9fr)]">
          <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--color-border)] bg-[#081512] shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(227,18,18,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />
            <div ref={mapRef} className="h-[520px] w-full" />
            {status !== "ready" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#07110f]/92">
                <div className="max-w-sm px-6 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[color:var(--color-primary)] border-t-transparent" />
                  <p className="mt-4 text-sm text-[color:var(--color-white)]">
                    {status === "loading" ? "Loading the map..." : error}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid content-start gap-3">
            {mappableWorks.map((work) => {
              const isActive = work.id === selectedWorkId;
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => {
                    setSelectedWorkId(work.id);
                    onSelectWork?.(work.id);
                  }}
                  className={`group rounded-[24px] border p-4 text-left transition duration-200 ${
                    isActive
                      ? "border-[color:var(--color-primary)] bg-[rgba(227,18,18,0.12)] text-[color:var(--color-white)] shadow-[0_24px_48px_rgba(227,18,18,0.16)]"
                      : "border-[color:var(--color-border)] bg-[color:rgba(255,255,255,0.04)] text-[color:var(--color-white)] hover:border-[color:var(--color-primary)]/60 hover:bg-[color:rgba(255,255,255,0.07)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`font-mono text-[11px] uppercase tracking-[0.24em] ${isActive ? "text-[color:var(--color-primary)]" : "text-[color:var(--color-gray)]"}`}>
                        {work.sectionTitle}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold">{work.title}</h3>
                      <p className={`mt-2 text-sm ${isActive ? "text-[color:var(--color-gray-light)]" : "text-[color:var(--color-gray-light)]"}`}>
                        {work.client ?? "Client project"}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] ${isActive ? "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]" : "bg-[color:rgba(255,255,255,0.06)] text-[color:var(--color-gray-light)]"}`}>
                      {work.locationCity}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
