import api from "../utils/axios";

const normalizeTags = (tags = [], fallbackLabel = "Tag") => {
  if (!Array.isArray(tags)) return [];

  return tags.map((tag, index) => {
    if (typeof tag === "string") {
      return {
        label: tag,
        percentage: 80 - index * 3,
        bgColor: "bg-slate-100 text-slate-700",
        dotColor: "#475569",
      };
    }

    // Backend always sends tag confidence on a 0-100 scale (same scale as confidenceAvg),
    // so this is a straight round/clamp — no *100 conversion needed.
    const confidence = tag.confidence ?? tag.score ?? tag.percentage ?? 0;
    const percentage = Math.max(1, Math.min(100, Math.round(Number(confidence))));

    return {
      label: tag.label || tag.name || tag.value || fallbackLabel,
      percentage,
      bgColor: percentage >= 90 ? "bg-emerald-100 text-emerald-700" : percentage >= 75 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700",
      dotColor: percentage >= 90 ? "#059669" : percentage >= 75 ? "#b45309" : "#475569",
    };
  });
};

export const normalizeAnalysisResponse = (payload, fallback = {}) => {
  const data = payload?.data ?? payload?.result ?? payload ?? {};
  const tags = data.tags ?? data.labels ?? data.detectedTags ?? [];
  const caption = data.caption ?? data.description ?? fallback.caption ?? "Analysis completed successfully.";
  const imageSrc = data.imageUrl ?? data.imageSrc ?? fallback.imageSrc ?? "";
  const fileName = data.fileName ?? fallback.fileName ?? "image.jpg";
  const fileSize = data.fileSize ?? fallback.fileSize ?? "";
  const confidenceAvg = data.confidenceAvg ?? data.confidence ?? fallback.confidenceAvg ?? 0;
  const createdAt = data.createdAt ?? fallback.createdAt ?? null;

  return {
    imageSrc,
    fileName,
    fileSize,
    caption,
    tags: normalizeTags(tags),
    confidenceAvg,
    createdAt,
    raw: data,
  };
};

export const analyzeImage = async (file, metadata = {}) => {
  if (!file) {
    throw new Error("No image selected");
  }

  // FR-07: never fake a result. Any failure is surfaced to the caller so the UI can show a real error.
  const formData = new FormData();
  formData.append("image", file);

  if (metadata.fileName) {
    formData.append("fileName", metadata.fileName);
  }

  const response = await api.post("/api/images/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return normalizeAnalysisResponse(response.data, {
    fileName: metadata.fileName || file.name,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
  });
};

export const getAnalysisHistory = async (tag = "") => {
  const url = tag ? `/api/history?tag=${encodeURIComponent(tag)}` : "/api/history";
  const response = await api.get(url);
  const payload = response.data?.data ?? response.data;
  const items = Array.isArray(payload) ? payload : payload?.analyses ?? [];

  return items.map((item, index) => ({
    id: String(item._id || item.id || `${index + 1}`),
    imageUrl: item.imageUrl || item.imageSrc || "",
    imageAlt: item.fileName || "Analysis result",
    filename: item.fileName || item.filename || "analysis.jpg",
    confidence: item.confidenceAvg ?? item.confidence ?? 0,
    tags: Array.isArray(item.tags) ? item.tags.map((tagItem) => tagItem.label || tagItem.name || tagItem) : [],
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
    time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "",
    resolution: item.resolution || "",
    fileSize: item.fileSize || "",
    caption: item.caption || "",
    insights: normalizeTags(item.tags || []).map((tagItem) => ({
      label: tagItem.label,
      score: tagItem.percentage,
    })),
  }));
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/api/analyses/${id}`);
  const payload = response.data?.data ?? response.data;
  return normalizeAnalysisResponse(payload);
};

export const deleteAnalysis = async (id) => {
  return api.delete(`/api/history/${id}`);
};

// FR-09: clear the user's entire history
export const clearAnalysisHistory = async () => {
  return api.delete("/api/history");
};

export const updateAnalysisTags = async (id, tags = []) => {
  return api.put(`/api/analyses/${id}/tags`, { tags });
};

export const exportAnalysis = async (id, format = "json") => {
  return api.get(`/api/analyses/${id}/export`, {
    params: { format },
  });
};
