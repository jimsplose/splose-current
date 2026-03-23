"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ADELAIDE_CENTER: [number, number] = [-34.9285, 138.6007];
const DEFAULT_ZOOM = 13;

const markers = [
  { name: "Ella Thompson", lat: -34.925, lng: 138.6, color: "#7c3aed" },
  { name: "Harry James", lat: -34.935, lng: 138.61, color: "#2563eb" },
  { name: "Jenny Jenkins", lat: -34.92, lng: 138.59, color: "#dc2626" },
  { name: "kai win", lat: -34.94, lng: 138.605, color: "#059669" },
  { name: "splose Ruvi", lat: -34.928, lng: 138.615, color: "#d97706" },
  { name: "New client", lat: -34.932, lng: 138.595, color: "#7c3aed" },
];

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

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

    markers.forEach((m) => {
      L.circleMarker([m.lat, m.lng], {
        radius: 8,
        fillColor: m.color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(m.name);
    });

    mapRef.current = map;

    // Leaflet needs a resize nudge after the container becomes visible
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ minHeight: "400px" }}
    />
  );
}
