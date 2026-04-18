import type { InputHTMLAttributes } from 'react';
import { cn } from './cn';
import { fieldBase, focusRingField } from './styles';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(fieldBase, 'h-9 px-3', focusRingField, className)}
      {...rest}
    />
  );
}
