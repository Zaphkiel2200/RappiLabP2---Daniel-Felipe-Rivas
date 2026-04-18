import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import type { UserPosition, LatLng, PolygonEnteredPayload } from "../types";
import { useAxios } from "./AxiosProvider";
import { useToast } from "./ToastProvider";
import { useUser } from "./UserProvider";
import useSupabase from "../hooks/useSupabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

const MOVE_DELTA = 0.0005;
const THROTTLE_MS = 500;

const ARROW_DELTAS: Partial<Record<string, LatLng>> = {
  ArrowUp: { lat: +MOVE_DELTA, lng: 0 },
  ArrowDown: { lat: -MOVE_DELTA, lng: 0 },
  ArrowLeft: { lat: 0, lng: -MOVE_DELTA },
  ArrowRight: { lat: 0, lng: +MOVE_DELTA },
};

interface PositionContextType {
  positions: UserPosition[];
  myPosition: LatLng;
  loading: boolean;
}

const PositionContext = createContext<PositionContextType | null>(null);

export const PositionProvider: React.FC<{
  drawingMode: boolean;
  children: React.ReactNode;
}> = ({ drawingMode, children }) => {
  const { auth } = useUser();

  const axios = useAxios();
  const { showToast } = useToast();
  const supabase = useSupabase();

  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [myPosition, setMyPosition] = useState<LatLng>({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);
  const [gpsStatus, setGpsStatus] = useState<"pending" | "granted" | "blocked">(
    "pending",
  );

  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPosition = useRef<LatLng | null>(null);

  const fetchPositions = async () => {
    try {
      const { data } = await axios.get<UserPosition[]>("/api/positions");
      return data;
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Error al cargar posiciones",
        "error",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPositionToServer = useCallback(
    async (pos: LatLng) => {
      await axios
        .patch("/api/positions", {
          latitude: pos.lat,
          longitude: pos.lng,
        })
        .catch((err) => {
          showToast(
            err instanceof Error ? err.message : "Error al actualizar posición",
            "error",
          );
        });
    },
    [axios, showToast],
  );

  const throttledSendPosition = useCallback(
    (pos: LatLng) => {
      pendingPosition.current = pos;
      if (throttleTimer.current) return;

      throttleTimer.current = setTimeout(() => {
        if (pendingPosition.current) {
          sendPositionToServer(pendingPosition.current);
          pendingPosition.current = null;
        }
        throttleTimer.current = null;
      }, THROTTLE_MS);
    },
    [sendPositionToServer],
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const delta = ARROW_DELTAS[e.key];
    if (!delta) return;

    e.preventDefault();
    setMyPosition((prev) => {
      const next = { lat: prev.lat + delta.lat, lng: prev.lng + delta.lng };
      throttledSendPosition(next);
      return next;
    });
  }, [throttledSendPosition]);

  // Arrow key movement
  useEffect(() => {
    if (drawingMode) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawingMode, handleKeyDown]);

  const onListenPositionUpdated = useCallback((channel: RealtimeChannel) => {
    channel.on("broadcast", { event: "position-updated" }, (payload) => {
      const position = payload.payload as UserPosition;
      setPositions((prev) => {
        const exists = prev.some((p) => p.user_id === position.user_id);
        if (!exists) return [...prev, position];
        return prev.map((p) => (p.user_id === position.user_id ? position : p));
      });
    });
  }, []);

  const onListenPositionRemoved = useCallback((channel: RealtimeChannel) => {
    channel.on("broadcast", { event: "position-removed" }, (payload) => {
      const { userId } = payload.payload as { userId: string };
      setPositions((prev) => prev.filter((p) => p.user_id !== userId));
    });
  }, []);

  const onListenPolygonEntered = useCallback((channel: RealtimeChannel) => {
    channel.on("broadcast", { event: "polygon-entered" }, (payload) => {
      const { userName, polygonName, ownerId } =
        payload.payload as PolygonEnteredPayload;
      if (auth?.user.id === ownerId) {
        showToast(`${userName} entro a tu poligono "${polygonName}"`, "info");
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
        axios.post("/api/positions", {
          latitude: latLng.lat,
          longitude: latLng.lng,
        });
      },
      () => {
        setGpsStatus("blocked");
      },
    );

    try {
      const positions = await fetchPositions();
      setPositions(positions);
    } catch {
      // Error handled in fetchPositions
    }
  }, [axios, fetchPositions]);

  // Supabase subscription
  useEffect(() => {
    if (!auth) return;
    
    onInit();
    const positionsChannel = supabase.channel("positions");
    onListenPositionUpdated(positionsChannel);
    onListenPositionRemoved(positionsChannel);
    onListenPolygonEntered(positionsChannel);
    positionsChannel.subscribe();

    return () => {
      positionsChannel.unsubscribe();
    };
  }, [auth, onInit, onListenPositionUpdated, onListenPositionRemoved, onListenPolygonEntered, supabase]);

  if (!auth) {
    return <>{children}</>; // Or redirect to login
  }

  if (gpsStatus === "pending") {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-white"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary, #00c04b)"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <path d="M12 8a4 4 0 0 0 0 8" strokeDasharray="4 2" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>
            Permiso de ubicación
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Permite el acceso a tu ubicación para continuar
          </p>
        </div>
      </div>
    );
  }

  if (gpsStatus === "blocked") {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-white"
        style={{ background: "var(--color-bg)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary, #00c04b)"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <path d="M12 8a4 4 0 0 0 0 8" strokeDasharray="4 2" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>
            GPS requerido
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Habilita la ubicación en tu navegador para continuar
          </p>
        </div>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-muted)", opacity: 0.6 }}
        >
          La página se actualizará automáticamente al conceder el permiso
        </p>
      </div>
    );
  }

  return (
    <PositionContext.Provider
      value={{
        positions,
        myPosition,
        loading,
      }}
    >
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
