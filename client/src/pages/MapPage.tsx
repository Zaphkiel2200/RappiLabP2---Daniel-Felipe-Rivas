import React, { useState, useEffect, useCallback } from 'react';
import { PositionProvider, usePosition } from '../providers/PositionProvider';
import { useUser } from '../providers/UserProvider';
import { MapView } from '../components/MapView';
import { PositionMarkers } from '../components/PositionMarkers';
import type { LatLng } from '../types';

const getDistance = (p1: LatLng, p2: LatLng) => {
  const R = 6371e3; // metres
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

const MapContent = () => {
  const { auth, logout } = useUser();
  const { positions, myPosition, loading: positionLoading } = usePosition();
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [proximityAlert, setProximityAlert] = useState(false);

  const userName = auth?.user.userName ?? auth?.user.email ?? 'Usuario';
  const isDriver = auth?.user.role === 'driver';

  const handleMapClick = (pos: LatLng) => {
    if (!isDriver) {
      setDestination(pos);
    }
  };

  // Check proximity between driver and destination
  useEffect(() => {
    if (destination) {
      // Find the closest "other" user (assuming they are drivers if I'm client, or vice versa)
      positions.forEach((pos) => {
        const dist = getDistance({ lat: pos.latitude, lng: pos.longitude }, destination);
        if (dist < 100) {
          setProximityAlert(true);
        } else {
          setProximityAlert(false);
        }
      });
    }
  }, [positions, destination]);

  if (positionLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col gap-3"
        style={{ background: 'var(--color-bg)' }}
      >
        <div
          className="w-10 h-10 rounded-xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))',
          }}
        />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div 
        className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between px-6 py-3 rounded-2xl backdrop-blur-md"
        style={{ 
          background: 'rgba(255, 255, 255, 0.8)', 
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 32px var(--color-shadow-lg)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{userName}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>
              {isDriver ? 'Repartidor' : 'Cliente'}
            </p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-100"
          style={{ color: 'var(--color-danger)', border: '1px solid var(--color-border)' }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Map */}
      <div className="absolute inset-0">
        <MapView 
          center={[myPosition.lat || 4.6097, myPosition.lng || -74.0817]} 
          onMapClick={handleMapClick}
        >
          <PositionMarkers
            positions={positions}
            myPosition={myPosition}
            myUserId={auth?.user.id ?? ''}
            myUserName={userName}
            destination={destination}
          />
        </MapView>
      </div>

      {/* Info Card */}
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xs px-6 py-4 rounded-2xl backdrop-blur-md"
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 32px var(--color-shadow-lg)'
        }}
      >
        {!destination && !isDriver && (
          <p className="text-sm text-center font-medium" style={{ color: 'var(--color-text)' }}>
            Haz clic en el mapa para establecer el destino
          </p>
        )}
        
        {(destination || isDriver) && (
          <>
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>
              {proximityAlert ? '¡ATENCIÓN!' : 'ESTADO DEL PEDIDO'}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: proximityAlert ? 'var(--color-primary)' : 'var(--color-text)' }}>
                {proximityAlert ? '¡El repartidor está llegando!' : positions.length > 0 ? 'Repartidor en camino' : 'Buscando repartidor...'}
              </p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const MapPage = () => {
  return (
    <PositionProvider drawingMode={false}>
      <MapContent />
    </PositionProvider>
  );
};

export default MapPage;
