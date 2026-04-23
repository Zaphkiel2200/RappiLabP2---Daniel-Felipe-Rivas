import { useState, useEffect } from 'react';
import { PositionProvider, usePosition } from '../providers/PositionProvider';
import { useUser } from '../providers/UserProvider';
import { MapView } from '../components/MapView';
import { PositionMarkers } from '../components/PositionMarkers';
import { OrderStatus } from '../types';
import type { LatLng, Order } from '../types';

const MapContent = () => {
  const { auth, logout } = useUser();
  const { 
    positions, 
    myPosition, 
    activeOrder, 
    loading: positionLoading,
    createOrder,
    acceptOrder,
    refreshOrders
  } = usePosition();

  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<LatLng | null>(null);

  const userName = auth?.user.userName ?? auth?.user.email ?? 'Usuario';
  const isDriver = auth?.user.role === 'driver';

  useEffect(() => {
    if (isDriver && !activeOrder) {
      refreshOrders().then(orders => {
        setAvailableOrders(orders.filter(o => o.status === OrderStatus.CREADO));
      });
    }
  }, [isDriver, activeOrder, refreshOrders]);

  const handleMapClick = (pos: LatLng) => {
    if (!isDriver && !activeOrder) {
      setSelectedDestination(pos);
    }
  };

  const handleConfirmOrder = async () => {
    if (selectedDestination) {
      await createOrder(selectedDestination);
      setSelectedDestination(null);
    }
  };

  if (positionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3" style={{ background: 'var(--color-bg)' }}>
        <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div 
        className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between px-6 py-3 rounded-2xl backdrop-blur-md"
        style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid var(--color-border)', boxShadow: '0 8px 32px var(--color-shadow-lg)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{userName}</p>
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)' }}>{isDriver ? 'Repartidor' : 'Cliente'}</p>
          </div>
        </div>
        <button onClick={logout} className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-100" style={{ color: 'var(--color-danger)', border: '1px solid var(--color-border)' }}>Cerrar Sesión</button>
      </div>

      {/* Map */}
      <div className="absolute inset-0">
        <MapView center={[myPosition.lat || 4.6097, myPosition.lng || -74.0817]} onMapClick={handleMapClick}>
          <PositionMarkers
            positions={positions}
            myPosition={myPosition}
            myUserId={auth?.user.id ?? ''}
            myUserName={userName}
            destination={activeOrder?.destination || selectedDestination}
          />
        </MapView>
      </div>

      {/* Driver Controls: Available Orders */}
      {isDriver && !activeOrder && availableOrders.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm flex flex-col gap-3 px-4">
          <p className="text-xs font-bold text-center drop-shadow-md text-white">PEDIDOS DISPONIBLES</p>
          {availableOrders.map(order => (
            <div key={order.id} className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between animate-slide-up">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nuevo Pedido</p>
                <p className="text-sm font-semibold text-gray-800">Distancia aprox: 1.2km</p>
              </div>
              <button 
                onClick={() => acceptOrder(order.id)}
                className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                style={{ background: 'var(--color-primary)' }}
              >
                Aceptar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Client Controls: Confirm Order */}
      {!isDriver && selectedDestination && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xs flex flex-col gap-3 px-4 animate-slide-up">
          <button 
            onClick={handleConfirmOrder}
            className="w-full py-4 rounded-2xl text-white font-bold shadow-2xl transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))' }}
          >
            Confirmar Punto de Entrega
          </button>
          <button onClick={() => setSelectedDestination(null)} className="w-full py-3 rounded-2xl bg-white/80 backdrop-blur-md text-gray-600 text-sm font-semibold border border-gray-200">Cancelar</button>
        </div>
      )}

      {/* Active Order Status */}
      {activeOrder && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xs px-6 py-4 rounded-2xl backdrop-blur-md border border-gray-200 shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="text-xs font-bold mb-1 text-gray-400 uppercase tracking-widest">
            {activeOrder.status === OrderStatus.EN_ENTREGA ? 'EN CAMINO' : 'ORDEN CREADA'}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-800">
              {activeOrder.status === OrderStatus.EN_ENTREGA ? 'Repartidor en movimiento...' : 'Esperando repartidor...'}
            </p>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
            </div>
          </div>
          {isDriver && (
            <p className="mt-3 text-[10px] text-gray-400 text-center font-medium italic">Usa las flechas del teclado para moverte</p>
          )}
        </div>
      )}
    </div>
  );
};

export const MapPage = () => {
  return (
    <PositionProvider>
      <MapContent />
    </PositionProvider>
  );
};

export default MapPage;
