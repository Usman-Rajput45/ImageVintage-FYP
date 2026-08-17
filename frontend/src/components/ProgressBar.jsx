import React from "react";

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full">
      <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full bg-primary progress-fill"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
