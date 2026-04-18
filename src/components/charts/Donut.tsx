import type { ReactNode } from 'react';
import { categoryColorVar } from '../ui';

interface Segment {
  category: string;
  value: number;
}

interface DonutProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
  children?: ReactNode;
}

export function Donut({
  segments,
  size = 160,
  thickness = 16,
  children,
}: DonutProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;

  const arcs = segments.reduce<
    { category: string; len: number; dashOffset: number }[]
  >((acc, s) => {
    const len = (s.value / total) * circumference;
    const prior = acc.length === 0 ? 0 : acc[acc.length - 1].dashOffset * -1 + acc[acc.length - 1].len;
    acc.push({ category: s.category, len, dashOffset: -prior });
    return acc;
  }, []);

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} role="img" aria-label="Category distribution">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-surface-muted)"
          strokeWidth={thickness}
        />
        {total > 0 &&
          arcs.map((a) => (
            <circle
              key={a.category}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={`var(${categoryColorVar(a.category)})`}
              strokeWidth={thickness}
              strokeDasharray={`${a.len} ${circumference - a.len}`}
              strokeDashoffset={a.dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          ))}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}
