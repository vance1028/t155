import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...args: any[]) {
  return twMerge(clsx(...args));
}

interface Props {
  label: string;
  value: number;
  target: number;
  unit?: string;
  warnAbove?: boolean;
  colorClass?: string;
}

export function ProgressBar({
  label,
  value,
  target,
  unit = '',
  warnAbove = true,
  colorClass,
}: Props) {
  const pct = target > 0 ? Math.min(120, (value / target) * 100) : 0;
  const isOver = warnAbove ? value > target : value < target;
  const isClose = !isOver && pct >= 85;

  const barColor =
    colorClass ??
    (isOver
      ? 'bg-accent'
      : isClose
      ? 'bg-warning'
      : 'bg-success');

  return (
    <div
      className={cn(
        'p-3 rounded-xl border transition-all',
        isOver
          ? 'border-accent/30 bg-accent/5 animate-pulse-soft'
          : 'border-gray-100 bg-white'
      )}
    >
      <div className="flex items-end justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <div className="text-right">
          <span
            className={cn(
              'font-bold',
              isOver ? 'text-accent' : 'text-gray-800'
            )}
          >
            {Math.round(value)}
          </span>
          <span className="text-xs text-gray-400">
            {' '}
            / {Math.round(target)}
            {unit}
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}
