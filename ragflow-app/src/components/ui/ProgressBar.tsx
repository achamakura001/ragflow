/**
 *  horizontal usage bar using mockup's CSS classes.ProgressBar 
 */
import React from 'react';

interface ProgressBarProps { value: number; max?: number; warn?: boolean; }

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, warn }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="progress-outer">
      <div
        className={`progress-inner${warn || pct >= 80 ? ' warn' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
