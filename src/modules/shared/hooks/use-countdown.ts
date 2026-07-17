"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownResult {
  /** Remaining seconds, floored at 0. */
  secondsLeft: number;
  /** Formatted as MM:SS */
  formatted: string;
  isExpired: boolean;
  /** Restart the countdown from a new duration (seconds). */
  restart: (seconds: number) => void;
}

/**
 * Drives every expiry timer in the system: OTP (10 min), invitation tokens (72h
 * display only), virtual account windows (30 min), etc.
 * Pass the duration in seconds; the hook ticks down independently of re-renders.
 */
export function useCountdown(initialSeconds: number): UseCountdownResult {
  const [target, setTarget] = useState<number>(
    () => Date.now() + Math.max(initialSeconds, 0) * 1000
  );
  const [secondsLeft, setSecondsLeft] = useState(Math.max(initialSeconds, 0));

  const restart = useCallback((seconds: number) => {
    setTarget(Date.now() + Math.max(seconds, 0) * 1000);
    setSecondsLeft(Math.max(seconds, 0));
  }, []);

  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const tick = () => {
      const remainingMs = targetRef.current - Date.now();
      setSecondsLeft(Math.max(Math.ceil(remainingMs / 1000), 0));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return { secondsLeft, formatted, isExpired: secondsLeft <= 0, restart };
}
