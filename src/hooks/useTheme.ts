import { useCallback, useEffect, useState } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function readStored(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall through
  }
  return 'system';
}

function readSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyClass(effective: EffectiveTheme) {
  const root = document.documentElement;
  if (effective === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeChoice>(readStored);
  const [systemDark, setSystemDark] = useState<boolean>(readSystemDark);

  const effective: EffectiveTheme =
    theme === 'dark'
      ? 'dark'
      : theme === 'light'
        ? 'light'
        : systemDark
          ? 'dark'
          : 'light';

  useEffect(() => {
    applyClass(effective);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, effective]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const setTheme = useCallback((t: ThemeChoice) => setThemeState(t), []);

  return { theme, effective, setTheme };
}
