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
      showToast("Error al cargar posiciones", "error");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const { data } = await axios.get<Order[]>("/api/orders");
      // Find active order for me
      const myOrder = data.find(o => 
        (o.client_id === auth?.user.id || o.delivery_id === auth?.user.id) && 
        o.status !== OrderStatus.ENTREGADO
      );
      if (myOrder) setActiveOrder(myOrder);
      return data;
    } catch (err) {
      return [];
    }
  };

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
          // If I'm the driver of an active order, update order position
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
          // Otherwise update generic position
          await axios.patch("/api/positions", {
            latitude: pos.lat,
            longitude: pos.lng,
          });
        }
      } catch (err) {
        // Silently fail for position updates to avoid spamming toasts
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

  const onListenRealtime = useCallback((channel: RealtimeChannel) => {
    channel.on("broadcast", { event: "position-updated" }, (payload) => {
      const pos = payload.payload as UserPosition;
      setPositions((prev) => {
        const exists = prev.some((p) => p.user_id === pos.user_id);
        if (!exists) return [...prev, pos];
        return prev.map((p) => (p.user_id === pos.user_id ? pos : p));
      });
    });

    channel.on("broadcast", { event: "order-updated" }, (payload) => {
      const order = payload.payload as Order;
      if (order.client_id === auth?.user.id || order.delivery_id === auth?.user.id) {
        if (order.status === OrderStatus.ENTREGADO) {
          setActiveOrder(null);
          showToast("El pedido ha sido entregado", "success");
        } else {
          setActiveOrder(order);
        }
      }
    });
  }, [auth?.user.id, showToast]);

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
        axios.post("/api/positions", { latitude: latLng.lat, longitude: latLng.lng });
      },
      () => setGpsStatus("blocked")
    );

    const posData = await fetchPositions();
    setPositions(posData);
    await refreshOrders();
  }, [axios]);

  useEffect(() => {
    if (!auth) return;
    
    onInit();
    const channel = supabase.channel("realtime-delivery");
    onListenRealtime(channel);
    channel.subscribe();

    return () => { channel.unsubscribe(); };
  }, [auth, onInit, onListenRealtime, supabase]);

  if (!auth) return <>{children}</>;

  if (gpsStatus === "pending") {
    return <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">Cargando GPS...</div>;
  }

  return (
    <PositionContext.Provider value={{ 
      positions, 
      myPosition, 
      activeOrder, 
      loading, 
      createOrder, 
      acceptOrder, 
      refreshOrders 
    }}>
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
