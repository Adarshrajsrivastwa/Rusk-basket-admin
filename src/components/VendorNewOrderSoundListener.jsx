import { useEffect, useRef } from "react";
import api from "../api/api";
import {
  isVendorNewOrderSoundPlaying,
  playVendorNewOrderSound,
  stopVendorNewOrderSound,
  VENDOR_NEW_ORDER_NOTIFICATION_TYPE,
} from "../utils/vendorNewOrderSound";

const POLL_INTERVAL_MS = 15000;

export default function VendorNewOrderSoundListener() {
  const seenIdsRef = useRef(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "vendor") return;

    const fetchAndCheck = async () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await api.get("/api/vendor/notifications", {
          params: { page: 1, limit: 50 },
        });
        if (!res?.data?.success) return;

        const list = res.data.data || [];
        const currentIds = new Set(list.map((n) => n._id));

        if (!initializedRef.current) {
          seenIdsRef.current = currentIds;
          initializedRef.current = true;
          return;
        }

        const hasNewOrderNotification = list.some(
          (n) =>
            !seenIdsRef.current.has(n._id) &&
            n.type === VENDOR_NEW_ORDER_NOTIFICATION_TYPE,
        );

        if (hasNewOrderNotification) {
          playVendorNewOrderSound();
        }

        seenIdsRef.current = currentIds;
      } catch {
        // ignore polling errors
      }
    };

    fetchAndCheck();
    const interval = setInterval(fetchAndCheck, POLL_INTERVAL_MS);

    const onVisibility = () => {
      if (!document.hidden) fetchAndCheck();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const stopOnInteraction = () => {
      if (isVendorNewOrderSoundPlaying()) stopVendorNewOrderSound();
    };
    document.addEventListener("click", stopOnInteraction);
    document.addEventListener("keydown", stopOnInteraction);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", stopOnInteraction);
      document.removeEventListener("keydown", stopOnInteraction);
      stopVendorNewOrderSound();
    };
  }, []);

  return null;
}
