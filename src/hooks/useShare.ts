import { useEffect, useState } from 'react';
import type { AppState } from '../types';
import { decodeStateFromHash, encodeStateToHash } from '../utils/share';

export function useShare() {
  const [sharedState, setSharedState] = useState<AppState | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      const decoded = decodeStateFromHash(hash);
      if (decoded) {
        setSharedState(decoded);
      }
    }
  }, []);

  function copyShareLink(state: AppState) {
    const hash = encodeStateToHash(state);
    const url = window.location.origin + window.location.pathname + hash;
    navigator.clipboard.writeText(url).catch(() => {
      // Fallback: show the URL in an alert if clipboard access is denied
      alert(`Share this URL:\n${url}`);
    });
  }

  function clearSharedState() {
    setSharedState(null);
    // Remove hash from URL without reloading
    history.replaceState(null, '', window.location.pathname);
  }

  return { sharedState, copyShareLink, clearSharedState };
}
