import type { HTMLAttributes } from 'react';
import { cn } from './cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({
  className,
  interactive = false,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface shadow-sm',
        'transition-all duration-150',
        interactive &&
          'hover:border-border-strong hover:shadow-md hover:-translate-y-px cursor-pointer',
        className
      )}
      {...rest}
    />
  );
}
