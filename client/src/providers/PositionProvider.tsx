import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import type { UserPosition, LatLng, Order } from "../types";
import { OrderStatus } from "../types";
import { useAxios } from "./AxiosProvider";
import { useToast } from "./ToastProvider";
import { useUser } from "./UserProvider";
import useSupabase from "../hooks/useSupabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

const MOVE_DELTA = 0.0005;
const THROTTLE_MS = 300;

const ARROW_DELTAS: Partial<Record<string, LatLng>> = {
  ArrowUp: { lat: +MOVE_DELTA, lng: 0 },
  ArrowDown: { lat: -MOVE_DELTA, lng: 0 },
  ArrowLeft: { lat: 0, lng: -MOVE_DELTA },
  ArrowRight: { lat: 0, lng: +MOVE_DELTA },
};

interface PositionContextType {
  positions: UserPosition[];
  myPosition: LatLng;
  activeOrder: Order | null;
  loading: boolean;
  createOrder: (destination: LatLng) => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<Order[]>;
}

const PositionContext = createContext<PositionContextType | null>(null);

export const PositionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { auth } = useUser();
  const axios = useAxios();
  const { showToast } = useToast();
  const supabase = useSupabase();

  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [myPosition, setMyPosition] = useState<LatLng>({ lat: 0, lng: 0 });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [gpsStatus, setGpsStatus] = useState<"pending" | "granted" | "blocked">("pending");

  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPosition = useRef<LatLng | null>(null);

  const fetchPositions = async () => {
    try {
      const { data } = await axios.get<UserPosition[]>("/api/positions");
      return data;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = useCallback(async () => {
    try {
      const { data } = await axios.get<Order[]>("/api/orders");
      const myOrder = data.find(o => 
        (o.client_id === auth?.user.id || o.delivery_id === auth?.user.id) && 
        o.status !== OrderStatus.ENTREGADO
      );
      if (myOrder) setActiveOrder(myOrder);
      return data;
    } catch (err) {
      return [];
    }
  }, [axios, auth?.user.id]);

  const createOrder = async (destination: LatLng) => {
    try {
      const { data } = await axios.post<Order>("/api/orders", { destination });
      setActiveOrder(data);
      showToast("Pedido creado con éxito", "success");
    } catch (err) {
      showToast("Error al crear pedido", "error");
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const { data } = await axios.post<Order>(`/api/orders/${orderId}/accept`);
      setActiveOrder(data);
      showToast("Has aceptado el pedido", "success");
    } catch (err) {
      showToast("Error al aceptar pedido", "error");
    }
  };

  const updateServerPosition = useCallback(
    async (pos: LatLng) => {
      try {
        if (activeOrder && activeOrder.delivery_id === auth?.user.id) {
          const { data } = await axios.patch<Order>(`/api/orders/${activeOrder.id}/position`, {
            lat: pos.lat,
            lng: pos.lng,
          });
          if (data.status === OrderStatus.ENTREGADO) {
            setActiveOrder(null);
            showToast("¡Pedido entregado!", "success");
          } else {
            setActiveOrder(data);
          }
        } else {
          await axios.patch("/api/positions", {
            latitude: pos.lat,
            longitude: pos.lng,
          });
        }
      } catch (err) {
        // Fail silently for position updates
      }
    },
    [axios, auth?.user.id, activeOrder, showToast],
  );

  const throttledUpdatePosition = useCallback(
    (pos: LatLng) => {
      pendingPosition.current = pos;
      if (throttleTimer.current) return;

      throttleTimer.current = setTimeout(() => {
        if (pendingPosition.current) {
          updateServerPosition(pendingPosition.current);
          pendingPosition.current = null;
        }
        throttleTimer.current = null;
      }, THROTTLE_MS);
    },
    [updateServerPosition],
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const delta = ARROW_DELTAS[e.key];
    if (!delta || auth?.user.role !== 'driver') return;

    e.preventDefault();
    setMyPosition((prev) => {
      const next = { lat: prev.lat + delta.lat, lng: prev.lng + delta.lng };
      throttledUpdatePosition(next);
      return next;
    });
  }, [auth?.user.role, throttledUpdatePosition]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onListenRealtime = useCallback(
    (channel: RealtimeChannel) => {
      // Listen to changes in the orders table
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as any;
          if (!newOrder || !newOrder.id) return;

          // Note: In a real scenario, you might need to map PostGIS points if they come as strings
          // For this lab, we assume the structure is compatible or handled by the cast
          const order = newOrder as Order;

          if (order.client_id === auth?.user.id || order.delivery_id === auth?.user.id) {
            if (order.status === OrderStatus.ENTREGADO) {
              setActiveOrder(null);
              showToast("El pedido ha sido entregado", "success");
            } else {
              setActiveOrder(order);
            }
          }
        }
      );

      // Listen to changes in user_positions
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_positions" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as any).user_id;
            setPositions((prev) => prev.filter((p) => p.user_id !== oldId));
            return;
          }

          const pos = payload.new as any;
          if (!pos || !pos.user_id) return;

          // We try to keep the user info if we already have it
          setPositions((prev) => {
            const existing = prev.find((p) => p.user_id === pos.user_id);
            
            // Handle PostGIS 'position' if present (e.g. "0101000020E6100000...")
            // or if they are already mapped as latitude/longitude
            let lat = pos.latitude;
            let lng = pos.longitude;

            const newPos: UserPosition = {
              id: pos.id,
              user_id: pos.user_id,
              latitude: lat || 0,
              longitude: lng || 0,
              updated_at: pos.updated_at,
              user: existing?.user || { userName: "Usuario", email: "" },
            };

            if (!existing) return [...prev, newPos];
            return prev.map((p) => (p.user_id === pos.user_id ? { ...newPos, user: p.user } : p));
          });
        }
      );
    },
    [auth?.user.id, showToast],
  );

  const onInit = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsStatus("blocked");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMyPosition(latLng);
        setGpsStatus("granted");
        axios.post("/api/positions", { latitude: latLng.lat, longitude: latLng.lng }).catch(() => {});
      },
      () => setGpsStatus("blocked")
    );

    const posData = await fetchPositions();
    setPositions(posData);
    await refreshOrders();
  }, [axios, refreshOrders]);

  useEffect(() => {
    if (!auth) return;
    onInit();
    const channel = supabase.channel("realtime-delivery");
    onListenRealtime(channel);
    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [auth, onInit, onListenRealtime, supabase]);

  const value = { 
    positions, 
    myPosition, 
    activeOrder, 
    loading, 
    createOrder, 
    acceptOrder, 
    refreshOrders 
  };

  // If not auth, we still provide the context to avoid crashes, 
  // though AppRoutes should prevent access.
  if (!auth) {
    return (
      <PositionContext.Provider value={value}>
        {children}
      </PositionContext.Provider>
    );
  }

  if (gpsStatus === "pending") {
    return (
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="w-10 h-10 rounded-xl animate-pulse mb-4" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Cargando GPS...</p>
      </div>
    );
  }

  return (
    <PositionContext.Provider value={value}>
      {children}
    </PositionContext.Provider>
  );
};

export const usePosition = () => {
  const ctx = useContext(PositionContext);
  if (!ctx) throw new Error("usePosition must be used within PositionProvider");
  return ctx;
};

export default PositionProvider;
