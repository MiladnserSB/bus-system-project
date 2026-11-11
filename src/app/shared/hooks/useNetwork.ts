import { useState } from 'react';

/**
 * Network Connectivity Hook
 * Source: SRS Final v1.0 (Section 2.4, 3.4)
 */

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);

  // In standard browser / simulator we default to connected, toggleable
  return {
    isConnected,
    isOffline: !isConnected,
    setIsConnected,
  };
}
