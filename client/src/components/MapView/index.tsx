import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLng } from '../../types';

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  onMapClick?: (pos: LatLng) => void;
}

const MapEvents = ({ onMapClick }: { onMapClick?: (pos: LatLng) => void }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ center, zoom = 15, children, onMapClick }) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={onMapClick} />
      {children}
    </MapContainer>
  );
};

export default MapView;
