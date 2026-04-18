import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { UserPosition, LatLng } from '../../types';

const createMyIcon = () =>
  L.divIcon({
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
    html: `
      <div style="position:relative;width:28px;height:28px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(255,68,31,0.3);
          animation:marker-ping 1.5s ease-out infinite;
        "></div>
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:rgba(255,68,31,0.15);
          animation:marker-ping 1.5s ease-out infinite;
          animation-delay:0.4s;
        "></div>
        <div style="
          position:absolute;inset:4px;border-radius:50%;
          background:linear-gradient(135deg,#FF8C75,#FF441F);
          border:2.5px solid rgba(255,255,255,0.9);
          box-shadow:0 0 14px rgba(255,68,31,0.9), 0 0 4px rgba(255,68,31,0.5);
        "></div>
      </div>
    `,
  });

const createOtherIcon = (userName: string, isDriver: boolean) =>
  L.divIcon({
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -13],
    html: `
      <div style="position:relative;width:18px;height:18px">
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:${isDriver ? 'linear-gradient(135deg,#67e8f9,#06b6d4)' : 'linear-gradient(135deg,#fbbf24,#f59e0b)'};
          border:2.5px solid rgba(255,255,255,0.85);
          box-shadow:0 0 10px ${isDriver ? 'rgba(6,182,212,0.8)' : 'rgba(245,158,11,0.8)'};
        "></div>
        <span style="
          position:absolute;top:-20px;left:50%;transform:translateX(-50%);
          font-size:11px;font-weight:700;white-space:nowrap;
          color:#111827;text-shadow:0 1px 4px rgba(255,255,255,0.9);
          pointer-events:none;letter-spacing:0.01em;
        ">${userName}</span>
      </div>
    `,
  });

const createDestinationIcon = () =>
  L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    html: `
      <div style="position:relative;width:32px;height:32px;display:flex;justify-content:center;align-items:center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#111827" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
  });

interface PositionMarkersProps {
  positions: UserPosition[];
  myPosition: LatLng;
  myUserId: string;
  myUserName: string;
  destination?: LatLng | null;
}

export const PositionMarkers: React.FC<PositionMarkersProps> = ({ positions, myPosition, myUserId, myUserName, destination }) => {
  return (
    <>
      {myPosition.lat !== 0 && (
        <Marker position={[myPosition.lat, myPosition.lng]} icon={createMyIcon()}>
          <Popup>{myUserName} (tú)</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={createDestinationIcon()}>
          <Popup>Punto de Entrega</Popup>
        </Marker>
      )}

      {positions
        .filter((p) => p.user_id !== myUserId)
        .map((pos) => (
          <Marker
            key={pos.user_id}
            position={[pos.latitude, pos.longitude]}
            icon={createOtherIcon(pos.user.userName, true)} // Assuming others are drivers for now
          >
            <Popup>{pos.user.userName}</Popup>
          </Marker>
        ))}
    </>
  );
};

export default PositionMarkers;
