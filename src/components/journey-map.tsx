
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Image from 'next/image';
import type { ProductOrigin } from '@/lib/types';

interface JourneyMapProps {
    origins: ProductOrigin[];
}

export default function JourneyMap({ origins }: JourneyMapProps) {
    useEffect(() => {
        (async () => {
          const L = (await import('leaflet')).default;
          // Fix for default marker icon
          delete (L.Icon.Default.prototype as any)._getIconUrl;
    
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
          });
        })();
      }, []);

  return (
    <MapContainer
      center={[10, 0]}
      zoom={2}
      scrollWheelZoom={false}
      style={{ height: '600px', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {origins.map(origin => (
        <Marker key={origin.country} position={[origin.lat, origin.lng]}>
          <Popup>
            <div className="w-64">
               <Image
                src={origin.farmImageUrl}
                alt={`Farm in ${origin.country}`}
                width={256}
                height={120}
                className="rounded-t-lg object-cover"
                data-ai-hint="coffee farm"
              />
              <div className="p-2">
                <h3 className="font-bold text-base mb-1">{origin.country}</h3>
                <p className="text-xs text-gray-600">{origin.story}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
