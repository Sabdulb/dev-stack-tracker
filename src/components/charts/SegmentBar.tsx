import { categoryColorVar } from '../ui';

interface Segment {
  category: string;
  value: number;
}

interface SegmentBarProps {
  segments: Segment[];
  className?: string;
  height?: number;
}

export function SegmentBar({
  segments,
  className,
  height = 4,
}: SegmentBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) {
    return (
      <div
        className={className}
        style={{ height, background: 'var(--color-surface-muted)', borderRadius: 2 }}
      />
    );
  }

  const rects = segments.reduce<
    { category: string; x: number; w: number }[]
  >((acc, s) => {
    const w = (s.value / total) * 100;
    const x = acc.length === 0 ? 0 : acc[acc.length - 1].x + acc[acc.length - 1].w;
    acc.push({ category: s.category, x, w });
    return acc;
  }, []);

  return (
    <svg
      className={className}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      viewBox={`0 0 100 ${height}`}
      role="img"
      aria-label="Category breakdown"
    >
      {rects.map((r) => (
        <rect
          key={r.category}
          x={r.x}
          y={0}
          width={r.w}
          height={height}
          fill={`var(${categoryColorVar(r.category)})`}
        />
      ))}
    </svg>
  );
}
