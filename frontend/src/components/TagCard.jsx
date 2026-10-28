import React from "react";

const TagCard = ({ label, percentage, bgColor, dotColor }) => {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-400">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${bgColor}`}>
          <span className="tag-dot" style={{ backgroundColor: dotColor }} />
          {label}
        </span>
        <span className="text-sm font-medium text-slate-600">{percentage}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: dotColor }} />
      </div>
    </div>
  );
};

export default TagCard;
