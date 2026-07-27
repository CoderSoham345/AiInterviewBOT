import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  size = 'md',
  colorClass = 'text-cyan-400',
  sublabel,
}) => {
  const getStrokeColor = (scoreVal: number) => {
    if (scoreVal >= 80) return '#10b981'; // emerald
    if (scoreVal >= 65) return '#06b6d4'; // cyan
    if (scoreVal >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const dimensions = {
    sm: { radius: 28, stroke: 5, svgSize: 68, fontSize: 'text-sm font-bold' },
    md: { radius: 42, stroke: 7, svgSize: 100, fontSize: 'text-2xl font-black' },
    lg: { radius: 60, stroke: 9, svgSize: 140, fontSize: 'text-4xl font-black' },
  }[size];

  const strokeDasharray = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.svgSize, height: dimensions.svgSize }}>
        <svg className="transform -rotate-90" width={dimensions.svgSize} height={dimensions.svgSize}>
          {/* Background circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={dimensions.radius}
            stroke="#1e293b"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={dimensions.radius}
            stroke={getStrokeColor(score)}
            strokeWidth={dimensions.stroke}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${dimensions.fontSize} tracking-tight text-white`}>{score}</span>
          <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-300">{label}</span>
      {sublabel && <span className="text-[11px] text-slate-500 mt-0.5">{sublabel}</span>}
    </div>
  );
};
