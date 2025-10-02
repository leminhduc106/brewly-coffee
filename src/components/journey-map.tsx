
'use client';

import { useEffect, useRef } from 'react';
import type { ProductOrigin } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

interface JourneyMapProps {
  origins: ProductOrigin[];
}

export default function JourneyMap({ origins }: JourneyMapProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;
    (async () => {
      if (!mapDivRef.current) return;
      if (mapInstanceRef.current) return;
      const L = (await import('leaflet')).default;

      // Patch marker icons once
      try {
        const anyIcon: any = L.Icon.Default.prototype;
        delete anyIcon._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('leaflet/dist/images/marker-icon.png'),
          shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
      } catch {}

      const map = L.map(mapDivRef.current, {
        center: [10, 0],
        zoom: 2,
        scrollWheelZoom: false,
        worldCopyJump: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(map);

      origins.forEach((origin) => {
        const marker = L.marker([origin.lat, origin.lng]).addTo(map);
        const safeStory = origin.story.replace(/</g, '&lt;');
        marker.bindPopup(
          `<div style="max-width:220px">` +
            `<strong>${origin.country}</strong><br/>` +
            `<small>${safeStory}</small>` +
          `</div>`
        );
      });
    })();
    return () => {
      disposed = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [origins]);

  return (
    <div
      ref={mapDivRef}
      style={{ height: '600px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}
      className="journey-map"
    />
  );
}
