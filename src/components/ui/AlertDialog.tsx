/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import * as RadixAlert from '@radix-ui/react-alert-dialog';
import { cn } from './cn';
import { Button } from './Button';
import { dialogContentChrome, dialogOverlay } from './styles';

export const AlertDialog = RadixAlert.Root;
export const AlertDialogTrigger = RadixAlert.Trigger;

export interface AlertDialogContentProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  danger?: boolean;
  children?: ReactNode;
}

export function AlertDialogContent({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  danger = false,
  children,
}: AlertDialogContentProps) {
  return (
    <RadixAlert.Portal>
      <RadixAlert.Overlay className={dialogOverlay} />
      <RadixAlert.Content className={cn(dialogContentChrome, 'max-w-sm')}>
        <div className="px-5 py-4">
          <RadixAlert.Title className="text-base font-semibold text-fg">
            {title}
          </RadixAlert.Title>
          {description && (
            <RadixAlert.Description className="mt-1 text-sm text-fg-muted">
              {description}
            </RadixAlert.Description>
          )}
          {children && <div className="mt-3">{children}</div>}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <RadixAlert.Cancel asChild>
            <Button variant="ghost" size="sm">
              {cancelLabel}
            </Button>
          </RadixAlert.Cancel>
          <RadixAlert.Action asChild>
            <Button
              variant={danger ? 'danger' : 'primary'}
              size="sm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </RadixAlert.Action>
        </div>
      </RadixAlert.Content>
    </RadixAlert.Portal>
  );
}
