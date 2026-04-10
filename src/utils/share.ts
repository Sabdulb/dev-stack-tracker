import type { AppState } from '../types';
import { validateState } from './importExport';

export function encodeStateToHash(state: AppState): string {
  // encodeURIComponent before btoa prevents throws on non-ASCII characters
  return `#share=${btoa(encodeURIComponent(JSON.stringify(state)))}`;
}

export function decodeStateFromHash(hash: string): AppState | null {
  try {
    const encoded = hash.replace('#share=', '');
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
    if (!validateState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
