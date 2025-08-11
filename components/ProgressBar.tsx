import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  showCount?: boolean;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showPercentage = true,
  showCount = true,
  label = "Progress",
  className = "",
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-text opacity-70 mb-3">
        <span className="font-medium">{label}</span>
        {showCount && (
          <span className="font-semibold text-primary">
            {current} / {total}
          </span>
        )}
      </div>
      <div className="w-full bg-border rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="text-center text-sm font-semibold text-primary mt-2">
          {percentage}% Complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
