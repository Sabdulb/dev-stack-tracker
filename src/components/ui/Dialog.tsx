/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from './cn';
import { IconButton } from './IconButton';
import { dialogContentChrome, dialogOverlay } from './styles';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export type DialogSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export interface DialogContentProps {
  children: ReactNode;
  size?: DialogSize;
  className?: string;
}

export function DialogContent({
  children,
  size = 'md',
  className,
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={dialogOverlay} />
      <RadixDialog.Content
        className={cn(dialogContentChrome, sizeClasses[size], className)}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export interface DialogHeaderProps {
  title: string;
  description?: string;
}

export function DialogHeader({ title, description }: DialogHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div className="min-w-0">
        <RadixDialog.Title className="text-base font-semibold text-fg">
          {title}
        </RadixDialog.Title>
        {description && (
          <RadixDialog.Description className="mt-1 text-sm text-fg-muted">
            {description}
          </RadixDialog.Description>
        )}
      </div>
      <RadixDialog.Close asChild>
        <IconButton icon="close" label="Close" size="sm" />
      </RadixDialog.Close>
    </div>
  );
}

export function DialogBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border px-5 py-3',
        className
      )}
    >
      {children}
    </div>
  );
}
