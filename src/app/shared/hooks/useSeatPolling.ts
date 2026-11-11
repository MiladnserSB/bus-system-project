import { useEffect, useRef } from 'react';

/**
 * 10-Second Seat Status Polling Hook
 * Source: SRS Final v1.0 (Section 4.5.3, REQ-SEAT-05)
 */

export function useSeatPolling(pollFn: () => void | Promise<void>, enabled: boolean = true) {
  const savedCallback = useRef(pollFn);

  useEffect(() => {
    savedCallback.current = pollFn;
  }, [pollFn]);

  useEffect(() => {
    if (!enabled) return;

    // Initial call
    savedCallback.current();

    // 10-second interval as defined in SRS
    const id = setInterval(() => {
      savedCallback.current();
    }, 10000);

    return () => clearInterval(id);
  }, [enabled]);
}
