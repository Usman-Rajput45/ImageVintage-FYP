import React from "react";

const ImageCaptionSection = ({ caption = "A cat sitting on a wooden table near a window" }) => {
  return (
    <section className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-slate-900">
        <span className="material-symbols-outlined text-lg text-slate-900">notes</span>
        <h2 className="text-xl font-semibold">Image Caption</h2>
      </div>
      <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <span className="material-symbols-outlined text-3xl text-slate-400">format_quote</span>
        <p className="text-base leading-7 text-slate-700 italic">{caption}</p>
      </div>
    </section>
  );
};

export default ImageCaptionSection;
