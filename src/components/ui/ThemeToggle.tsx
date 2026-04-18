import { useTheme, type ThemeChoice } from '../../hooks/useTheme';
import { IconButton } from './IconButton';

const CYCLE: Record<ThemeChoice, ThemeChoice> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const ICON: Record<ThemeChoice, string> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};

const LABEL: Record<ThemeChoice, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = CYCLE[theme];
  return (
    <IconButton
      icon={ICON[theme]}
      label={`${LABEL[theme]} — click to switch to ${LABEL[next].toLowerCase()}`}
      onClick={() => setTheme(next)}
    />
  );
}
