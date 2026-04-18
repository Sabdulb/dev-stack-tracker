import type { SelectHTMLAttributes } from 'react';
import { cn } from './cn';
import { Icon } from './Icon';
import { fieldBase, focusRingField } from './styles';

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          fieldBase,
          'h-9 pl-3 pr-8 appearance-none cursor-pointer',
          focusRingField,
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted"
      />
    </div>
  );
}
