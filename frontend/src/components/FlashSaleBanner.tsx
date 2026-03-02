"use client";

import { useEffect, useState } from "react";
import { discountsApi } from "@/lib/api";

interface FlashSale {
  code: string;
  discount_percent: number;
  expires_at: string;
}

function getTimeRemaining(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function FlashSaleBanner() {
  const [sale, setSale] = useState<FlashSale | null>(null);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeRemaining>>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("flash-sale-dismissed")) {
      setDismissed(true);
      return;
    }

    discountsApi
      .getActiveSales()
      .then((res) => {
        const sales = res.data || [];
        if (sales.length > 0) {
          setSale(sales[0]);
          setTimeLeft(getTimeRemaining(sales[0].expires_at));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sale) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(sale.expires_at);
      if (!remaining) {
        setSale(null);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sale]);

  if (!sale || !timeLeft || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("flash-sale-dismissed", "true");
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent text-white py-3 relative">
      <div className="container-custom flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span className="text-sm font-medium">Flash Sale!</span>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold font-mono">
            {sale.code}
          </span>
          <span className="text-sm font-bold">{sale.discount_percent}% OFF</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-mono bg-white/10 px-3 py-1 rounded-lg">
          {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
          <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
          <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
          <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
