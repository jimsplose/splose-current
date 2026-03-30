"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ADELAIDE_CENTER: [number, number] = [-34.9285, 138.6007];
const DEFAULT_ZOOM = 13;

export interface MapMarker {
  name: string;
  lat: number;
  lng: number;
  color: string;
  dob?: string;
  address?: string;
  service?: string;
  dateAdded?: string;
  tags?: string[];
}

const defaultMarkers: MapMarker[] = [
  { name: "Ella Thompson", lat: -34.925, lng: 138.6, color: "#7c3aed" },
  { name: "Harry James", lat: -34.935, lng: 138.61, color: "#2563eb" },
  { name: "Jenny Jenkins", lat: -34.92, lng: 138.59, color: "#dc2626" },
  { name: "kai win", lat: -34.94, lng: 138.605, color: "#059669" },
  { name: "splose Ruvi", lat: -34.928, lng: 138.615, color: "#d97706" },
  { name: "New client", lat: -34.932, lng: 138.595, color: "#7c3aed" },
];

function buildPopupHtml(m: MapMarker): string {
  const rows: string[] = [];
  if (m.dob && m.dob !== "---") {
    rows.push(`<div style="color:#6b7280;font-size:12px">DOB: ${m.dob}</div>`);
  }
  if (m.address && m.address !== "---") {
    rows.push(`<div style="color:#6b7280;font-size:12px">Address: ${m.address}</div>`);
  }
  if (m.service) {
    rows.push(`<div style="color:#6b7280;font-size:12px">Service: ${m.service}</div>`);
  }
  if (m.dateAdded) {
    rows.push(`<div style="color:#6b7280;font-size:12px">Added: ${m.dateAdded}</div>`);
  }
  if (m.tags && m.tags.length > 0 && !(m.tags.length === 1 && m.tags[0] === "---")) {
    const tagHtml = m.tags
      .filter((t) => t !== "---")
      .map(
        (t) =>
          `<span style="display:inline-block;background:#f3f4f6;border-radius:4px;padding:1px 6px;font-size:11px;margin-right:4px">${t}</span>`,
      )
      .join("");
    rows.push(`<div style="margin-top:4px">${tagHtml}</div>`);
  }

  return `
    <div style="min-width:180px;font-family:system-ui,sans-serif">
      <div style="font-weight:600;font-size:14px;color:#7c3aed;margin-bottom:4px">${m.name}</div>
      ${rows.join("")}
    </div>
  `;
}

interface MapViewProps {
  markers?: MapMarker[];
}

export default function MapView({ markers }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersToUse = markers ?? defaultMarkers;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: ADELAIDE_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    markersToUse.forEach((m) => {
      L.circleMarker([m.lat, m.lng], {
        radius: 8,
        fillColor: m.color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(buildPopupHtml(m), { maxWidth: 260 });
    });

    mapRef.current = map;

    // Leaflet needs a resize nudge after the container becomes visible
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [markersToUse]);

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%", minHeight: 400 }}
    />
  );
}
