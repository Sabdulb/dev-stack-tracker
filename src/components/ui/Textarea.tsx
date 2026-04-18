import type { TextareaHTMLAttributes } from 'react';
import { cn } from './cn';
import { fieldBase, focusRingField } from './styles';

export function Textarea({
  className,
  rows = 3,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={cn(fieldBase, 'px-3 py-2 resize-y', focusRingField, className)}
      {...rest}
    />
  );
}
