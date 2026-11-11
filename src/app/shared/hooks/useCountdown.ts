import { useState, useEffect } from 'react';

/**
 * 5-Minute Seat Hold Countdown Hook
 * Source: SRS Final v1.0 (REQ-BOOK-02, REQ-SET-04)
 */

export function useCountdown(initialSeconds: number = 300, onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) {
      if (secondsLeft === 0 && onExpire) {
        onExpire();
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const reset = (newSeconds: number = initialSeconds) => {
    setSecondsLeft(newSeconds);
    setIsActive(true);
  };

  const pause = () => setIsActive(false);

  return {
    secondsLeft,
    formattedTime,
    isExpired: secondsLeft <= 0,
    reset,
    pause,
  };
}
