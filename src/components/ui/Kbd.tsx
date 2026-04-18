import type { HTMLAttributes } from 'react';
import { cn } from './cn';

export function Kbd({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-0.5 rounded-sm border border-border bg-surface-muted',
        'px-1.5 py-0.5 text-[10px] font-mono text-fg-muted',
        className
      )}
      {...rest}
    >
      {children}
    </kbd>
  );
}
