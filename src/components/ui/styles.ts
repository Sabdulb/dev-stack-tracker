export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

export const focusRingField =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent';

export const fieldBase =
  'w-full rounded-md border border-border bg-surface text-fg text-sm placeholder:text-fg-subtle transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

export const controlTransition = 'transition-colors duration-150';

export const controlDisabled =
  'disabled:opacity-50 disabled:pointer-events-none';

export const ghostVariant =
  'text-fg-muted hover:text-fg hover:bg-surface-muted';

export const secondaryVariant =
  'bg-surface text-fg border border-border hover:bg-surface-muted hover:border-border-strong';

export const dialogOverlay =
  'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-scale-in';

export const dialogContentChrome =
  'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface-raised shadow-lg data-[state=open]:animate-fade-scale-in focus:outline-none';
