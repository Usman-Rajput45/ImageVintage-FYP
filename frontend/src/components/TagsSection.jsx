import React from "react";
import TagCard from "./TagCard";

const TagsSection = ({ tags = [] }) => {
  const defaultTags = [
    { label: "Cat", percentage: 94, bgColor: "bg-emerald-100 text-emerald-700", dotColor: "#059669" },
    { label: "Indoor", percentage: 87, bgColor: "bg-emerald-100 text-emerald-700", dotColor: "#059669" },
    { label: "Table", percentage: 72, bgColor: "bg-amber-100 text-amber-700", dotColor: "#b45309" },
    { label: "Window", percentage: 45, bgColor: "bg-slate-100 text-slate-700", dotColor: "#475569" },
  ];

  const tagsList = tags.length > 0 ? tags : defaultTags;

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-slate-900">
        <span className="material-symbols-outlined text-lg">label</span>
        <h2 className="text-xl font-semibold">Detected Tags</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tagsList.map((tag, index) => (
          <TagCard key={index} {...tag} />
        ))}
      </div>
    </section>
  );
};

export default TagsSection;
