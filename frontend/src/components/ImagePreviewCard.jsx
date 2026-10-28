import React from "react";

const ImagePreviewCard = ({ imageSrc, fileName = "image.jpg", fileSize = "2.4 MB" }) => {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <img alt={fileName} src={imageSrc} className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-600 text-xs">image</span>
          <span className="text-xs">{fileName}</span>
        </div>
        <span className="text-xs">{fileSize}</span>
      </div>
    </div>
  );
};

export default ImagePreviewCard;
