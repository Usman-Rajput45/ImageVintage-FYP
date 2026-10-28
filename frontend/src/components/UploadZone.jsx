import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialIcon from "./visiontag/MaterialIcon";
import { analyzeImage } from "../services/analysisService";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const UploadZone = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeComplete, setAnalyzeComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setErrorMessage("Please select an image file (JPG or PNG only).");
      return;
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`That file is too large. Please choose an image under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setErrorMessage(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setAnalyzeComplete(false);
    setIsAnalyzing(false);
  }, []);

  const openFilePicker = () => fileInputRef.current?.click();

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const onFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setAnalyzeComplete(false);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file || isAnalyzing) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await analyzeImage(file, { fileName: file.name });
      navigate("/analyzing", {
        state: {
          previewUrl,
          fileName: file?.name,
          analysisResult: result,
          analysisId: result?.raw?._id || result?.raw?.id || null,
        },
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Analysis failed. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const fileInfo = file
    ? `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`
    : "";

  const analyzeLabel = isAnalyzing
    ? "Analyzing..."
    : analyzeComplete
      ? "Analysis Complete"
      : "Analyze Image";

  const analyzeBtnClass = analyzeComplete
    ? "bg-vt-secondary"
    : "bg-vt-primary";

  return (
    <div className="flex w-full max-w-2xl flex-col gap-vt-xl rounded-vt-lg border border-vt-outline-variant bg-white p-vt-xl">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={onFileChange}
      />

      {!previewUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(e) => e.key === "Enter" && openFilePicker()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={[
            "upload-zone-dashed group flex cursor-pointer flex-col items-center justify-center gap-vt-md rounded-vt-lg px-vt-lg py-vt-xl transition-colors duration-300",
            isDragging
              ? "bg-vt-primary-container/10"
              : "hover:bg-vt-surface-container-low",
          ].join(" ")}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vt-surface-container text-vt-primary transition-transform duration-300 group-hover:scale-110">
            <MaterialIcon name="cloud_upload" className="text-4xl" />
          </div>
          <div className="text-center">
            <p className="mb-vt-xs text-vt-headline-md font-semibold text-vt-on-surface">
              Drag &amp; drop your image here
            </p>
            <p className="text-vt-body-md text-vt-on-surface-variant">
              or <span className="font-bold text-vt-primary">click to browse</span>
            </p>
          </div>
          <div className="mt-vt-md flex items-center gap-vt-xs">
            <MaterialIcon name="info" className="text-sm text-vt-outline" />
            <p className="text-vt-label-sm text-vt-outline">
              Supports JPG and PNG files up to {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-vt-md">
          <div className="relative aspect-video w-full overflow-hidden rounded-vt-lg border border-vt-outline-variant">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full bg-vt-surface-container-lowest object-contain"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-vt-md right-vt-md rounded-full bg-vt-error p-vt-xs text-vt-on-error transition-colors hover:bg-red-700"
              aria-label="Remove image"
            >
              <MaterialIcon name="close" />
            </button>
          </div>
          <p className="mb-vt-md w-full text-center text-vt-label-md text-vt-on-surface-variant">
            {fileInfo}
          </p>
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="rounded-vt-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || isAnalyzing}
        className={[
          "w-full rounded-vt-lg py-vt-md text-vt-headline-md font-semibold text-vt-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
          analyzeBtnClass,
        ].join(" ")}
      >
        {analyzeLabel}
      </button>
    </div>
  );
};

export default UploadZone;
