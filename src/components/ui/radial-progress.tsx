import React from "react";

interface RadialProgressProps {
  percentage: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel: string;
}

export function RadialProgress({
  percentage,
  color = "#10B981",
  size = 68,
  strokeWidth = 6,
  label,
  sublabel,
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[11px] font-medium text-slate-400 mb-2">{label}</span>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E2333"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <span className="absolute text-[13px] font-bold text-white tracking-tight">{percentage}%</span>
      </div>
      <span className="text-[10px] font-medium text-slate-400 mt-2">{sublabel}</span>
    </div>
  );
}
