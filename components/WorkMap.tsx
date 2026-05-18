"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { divIcon, latLngBounds, type LatLngTuple } from "leaflet";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import type { PublicLanguage } from "@/lib/public-i18n";
import { getStaticCopy } from "@/lib/public-i18n";
import type { Work } from "@/types";

type MappedWork = Work & {
  sectionTitle: string;
};

interface WorkMapProps {
  works: MappedWork[];
  onSelectWork?: (workId: string) => void;
  language: PublicLanguage;
}

function MapViewport({
  works,
  selectedWorkId,
}: {
  works: MappedWork[];
  selectedWorkId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!works.length) return;

    if (selectedWorkId) {
      const selected = works.find((work) => work.id === selectedWorkId);
      if (selected?.locationLat != null && selected?.locationLng != null) {
        map.flyTo([selected.locationLat, selected.locationLng], Math.max(map.getZoom(), 7), {
          duration: 1.1,
        });
        return;
      }
    }

    const points: LatLngTuple[] = works
      .filter((work) => work.locationLat != null && work.locationLng != null)
      .map((work) => [work.locationLat as number, work.locationLng as number]);

    const bounds = latLngBounds(points);

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [72, 72] });
    }
  }, [map, selectedWorkId, works]);

  return null;
}

function buildMarkerIcon(city: string, isSelected: boolean) {
  return divIcon({
    className: "work-map-div-icon",
    html: `
      <div class="work-map-marker">
        <span class="work-map-marker__pin ${isSelected ? "is-selected" : ""}">
          <span class="work-map-marker__core"></span>
        </span>
        <span class="work-map-marker__label">${city}</span>
      </div>
    `,
    iconSize: [160, 38],
    iconAnchor: [16, 19],
  });
}

export default function WorkMap({ works, onSelectWork, language }: WorkMapProps) {
  const copy = useMemo(() => getStaticCopy(language), [language]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(works[0]?.id ?? null);

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
      setSelectedWorkId(null);
      return;
    }

    if (!selectedWorkId || !mappableWorks.some((work) => work.id === selectedWorkId)) {
      setSelectedWorkId(mappableWorks[0].id);
    }
  }, [mappableWorks, selectedWorkId]);

  return (
    <section id="map" className="section border-t border-[color:var(--color-border)] bg-[color:var(--background)]">
      <Container>
        <SectionHeading
          label={copy.map.eyebrow}
          title={copy.map.title}
          subtitle={copy.map.body}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.9fr)]">
          <div className="card-surface relative overflow-hidden bg-[#081512] shadow-[0_32px_80px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-0 z-[400] bg-[radial-gradient(circle_at_top_left,rgba(227,18,18,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />

            {mappableWorks.length ? (
              <MapContainer
                center={[26.8206, 30.8025]}
                zoom={6}
                scrollWheelZoom={false}
                className="h-[520px] w-full"
                zoomControl
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap &copy; CARTO"
                />
                <MapViewport works={mappableWorks} selectedWorkId={selectedWorkId} />
                {mappableWorks.map((work) => {
                  const isSelected = work.id === selectedWorkId;

                  return (
                    <Marker
                      key={work.id}
                      position={[work.locationLat as number, work.locationLng as number]}
                      icon={buildMarkerIcon(work.locationCity as string, isSelected)}
                      eventHandlers={{
                        click: () => {
                          setSelectedWorkId(work.id);
                          onSelectWork?.(work.id);
                        },
                      }}
                    >
                      <Popup>
                        <div className="work-map-popup">
                          <p className="work-map-popup__eyebrow">{work.sectionTitle}</p>
                          <h3 className="work-map-popup__title">{work.title}</h3>
                          <p className="work-map-popup__meta">
                            {work.client ?? copy.map.clientProject} - {work.locationCity}
                            {work.locationCountry ? `, ${work.locationCountry}` : ""}
                          </p>
                          {work.description ? <p className="work-map-popup__body">{work.description}</p> : null}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="flex h-[520px] items-center justify-center bg-[#07110f]/92">
                <div className="max-w-sm px-6 text-center">
                  <p className="text-sm text-[color:var(--color-white)]">{copy.labels.noMapProjects}</p>
                </div>
              </div>
            )}
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
                  className={`card-surface group p-4 text-start transition duration-200 ${
                    isActive
                      ? "border-[color:var(--color-primary)] bg-[rgba(227,18,18,0.12)] text-[color:var(--color-white)] shadow-[0_24px_48px_rgba(227,18,18,0.16)]"
                      : "text-[color:var(--color-white)] hover:border-[color:var(--color-primary)]/60 hover:bg-[color:rgba(255,255,255,0.07)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`section-label ${isActive ? "text-[color:var(--color-primary)]" : "text-[color:var(--color-gray)]"}`}>
                        {work.sectionTitle}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold">{work.title}</h3>
                      <p className="mt-2 text-sm text-[color:var(--color-gray-light)]">
                        {work.client ?? copy.map.clientProject}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] ${copy.isArabic ? "font-semibold" : "font-mono uppercase tracking-[0.15em]"} ${isActive ? "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]" : "bg-[color:rgba(255,255,255,0.06)] text-[color:var(--color-gray-light)]"}`}>
                      {work.locationCity}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
