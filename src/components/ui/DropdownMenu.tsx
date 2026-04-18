/* eslint-disable react-refresh/only-export-components */
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { cn } from './cn';

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;

export interface DropdownMenuContentProps
  extends ComponentPropsWithoutRef<typeof RadixDropdown.Content> {
  children: ReactNode;
}

export function DropdownMenuContent({
  children,
  className,
  align = 'end',
  sideOffset = 6,
  ...rest
}: DropdownMenuContentProps) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-40 rounded-md border border-border bg-surface-raised shadow-md p-1',
          'data-[state=open]:animate-fade-scale-in',
          'focus:outline-none',
          className
        )}
        {...rest}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  );
}

export interface DropdownMenuItemProps
  extends ComponentPropsWithoutRef<typeof RadixDropdown.Item> {
  danger?: boolean;
}

export function DropdownMenuItem({
  children,
  className,
  danger = false,
  ...rest
}: DropdownMenuItemProps) {
  return (
    <RadixDropdown.Item
      className={cn(
        'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer',
        'outline-none select-none',
        danger
          ? 'text-danger data-[highlighted]:bg-danger-subtle'
          : 'text-fg data-[highlighted]:bg-surface-muted',
        'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
        className
      )}
      {...rest}
    >
      {children}
    </RadixDropdown.Item>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <RadixDropdown.Label className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
      {children}
    </RadixDropdown.Label>
  );
}

export function DropdownMenuSeparator() {
  return <RadixDropdown.Separator className="my-1 h-px bg-border" />;
}
