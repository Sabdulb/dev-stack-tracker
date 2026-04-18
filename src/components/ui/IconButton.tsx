import type { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';
import { Icon } from './Icon';
import {
  controlDisabled,
  controlTransition,
  focusRing,
  ghostVariant,
  secondaryVariant,
} from './styles';

export type IconButtonVariant = 'ghost' | 'secondary';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: string;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  iconSize?: number;
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: ghostVariant,
  secondary: secondaryVariant,
};

const sizeClasses: Record<IconButtonSize, { box: string; icon: number }> = {
  sm: { box: 'h-7 w-7 rounded-sm', icon: 14 },
  md: { box: 'h-9 w-9 rounded-md', icon: 16 },
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  iconSize,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const s = sizeClasses[size];
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center',
        controlTransition,
        focusRing,
        controlDisabled,
        variantClasses[variant],
        s.box,
        className
      )}
      {...rest}
    >
      <Icon name={icon} size={iconSize ?? s.icon} />
    </button>
  );
}
