import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  deleteAnalysis,
  getAnalysisById,
  updateAnalysisTags,
} from "../services/analysisService";

const ImageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tagDraft, setTagDraft] = useState("");
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [tagError, setTagError] = useState(null);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setDetailError(null);
        const result = await getAnalysisById(id?.toString?.().trim?.());
        if (result && (result.imageSrc || result.imageUrl)) {
          setItem(result);
          setTags(result.tags || []);
        } else {
          setItem(null);
          setTags([]);
        }
      } catch (error) {
        setDetailError(error.response?.data?.message || error.message || "Could not load analysis details. Please try again.");
        setItem(null);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadItem();
    } else {
      setLoading(false);
      setDetailError("Analysis details could not be loaded because no analysis ID was provided.");
    }
  }, [id]);

  if (loading && !item) {
    return (
      <div className="custom-scrollbar min-h-screen bg-[#eef1ff] text-[#101828] font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600">Loading analysis details…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="custom-scrollbar min-h-screen bg-[#eef1ff] text-[#101828] font-sans">
        <Navbar />
        <main className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[#dbe0ff] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <h1 className="text-2xl font-semibold text-[#101828]">Analysis details not found</h1>
            <p className="mt-4 text-sm text-[#475569]">
              {detailError || "We could not load details for this history item. Please go back to the history list."}
            </p>
            <Link
              to="/history"
              className="mt-6 inline-flex rounded-full bg-[#4338ca] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3730a3]"
            >
              Back to History
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const persistTags = async (nextTags) => {
    setTags(nextTags);
    setTagError(null);
    try {
      setSaving(true);
      await updateAnalysisTags(
        id,
        nextTags.map((tag) => ({ label: tag.label, confidence: tag.percentage }))
      );
    } catch (error) {
      setTagError(error.response?.data?.message || error.message || "Could not save tags. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    const label = tagDraft.trim();
    if (!label) return;
    const nextTags = [...tags, { label, percentage: 70, bgColor: "bg-slate-100 text-slate-700", dotColor: "#475569" }];
    setTagDraft("");
    await persistTags(nextTags);
  };

  const handleRemoveTag = async (index) => {
    const nextTags = tags.filter((_, i) => i !== index);
    await persistTags(nextTags);
  };

  const startEditingTag = (index, currentLabel) => {
    setEditingIndex(index);
    setEditingLabel(currentLabel);
  };

  const cancelEditingTag = () => {
    setEditingIndex(null);
    setEditingLabel("");
  };

  const submitEditingTag = async (e) => {
    e.preventDefault();
    const label = editingLabel.trim();
    if (!label) return;
    const nextTags = tags.map((tag, i) => (i === editingIndex ? { ...tag, label } : tag));
    cancelEditingTag();
    await persistTags(nextTags);
  };

  const handleDelete = async () => {
    try {
      await deleteAnalysis(id);
      navigate("/history", { replace: true });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleDownloadJson = () => {
    const exportPayload = {
      fileName: item.fileName,
      caption: item.caption,
      createdAt: item.createdAt,
      tags: tags.map((tag) => ({ label: tag.label, confidence: tag.percentage })),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(item.fileName || "analysis").replace(/\.[^/.]+$/, "")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const metadataRows = [
    { label: "Date Analyzed", value: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "" },
    { label: "Time", value: item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "" },
    { label: "File Name", value: item.fileName || "" },
    { label: "Resolution", value: item.resolution || "" },
    { label: "File Size", value: item.fileSize || "" },
  ];

  const insights = tags.map((tag) => ({
    label: tag.label || tag.name || tag,
    score: tag.percentage || 0,
  }));

  return (
    <div className="custom-scrollbar min-h-screen bg-[#eef1ff] text-[#101828] font-sans">
      <Navbar />

      <main className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#475569]">
          <Link
            to="/history"
            className="inline-flex items-center gap-2 font-medium text-[#3730a3] transition hover:text-[#1d4ed8]"
          >
            <span className="text-xl leading-none">←</span>
            Back to History
          </Link>
          <span className="text-[#98a2b3]">/</span>
          <span className="font-semibold text-[#101828]">Analysis Details</span>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.7fr_0.95fr]">
          <section className="space-y-6 rounded-[28px] border border-[#dbe0ff] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <img
                src={item.imageSrc || item.imageUrl}
                alt={item.fileName || "Analysis result"}
            />

            <div className="rounded-[24px] border border-[#e8edff] bg-[#f8faff] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-3xl border border-[#dbe0ff] bg-[#eef2ff] text-[#4338ca]">
                  <span className="text-xl">★</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#4f46e5]">
                    AI generated caption
                  </p>
                  <p className="mt-4 text-base leading-7 text-[#334155] sm:text-lg">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[#dbe0ff] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#4338ca]">
                File Metadata
              </h2>
              <div className="mt-6 space-y-3">
                {metadataRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 rounded-3xl border border-[#eef2ff] bg-[#f8faff] px-4 py-4"
                  >
                    <span className="text-sm uppercase tracking-[0.18em] text-[#64748b]">
                      {row.label}
                    </span>
                    <span className="text-sm font-semibold text-[#0f172a]">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dbe0ff] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#101828]">
                    Detected Objects & Scene Tags
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#64748b]">
                    Confidence per label
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="rounded-full border border-[#dbe0ff] px-3 py-2 text-sm font-medium text-[#3730a3] hover:bg-[#eef2ff]"
                  >
                    Export JSON
                  </button>
                  <button onClick={handleDelete} className="rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddTag} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm"
                />
                <button type="submit" disabled={saving} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {saving ? "Saving…" : "Add"}
                </button>
              </form>

              {tagError && (
                <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {tagError}
                </p>
              )}

              <div className="mt-5 space-y-4">
                {insights.length === 0 && (
                  <p className="rounded-3xl border border-dashed border-[#e2e8f0] bg-[#f8faff] p-4 text-center text-sm text-[#64748b]">
                    No tags yet. Add one above.
                  </p>
                )}
                {insights.map((insight, index) => (
                  <div key={`${insight.label}-${index}`} className="space-y-2 rounded-3xl border border-[#eef2ff] bg-[#f8faff] p-4">
                    {editingIndex === index ? (
                      <form onSubmit={submitEditingTag} className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          className="flex-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm"
                        />
                        <button type="submit" className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                          Save
                        </button>
                        <button type="button" onClick={cancelEditingTag} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-4 text-sm font-medium text-[#0f172a]">
                        <span>{insight.label}</span>
                        <div className="flex items-center gap-3">
                          <span>{insight.score.toFixed(1)}%</span>
                          <button
                            type="button"
                            onClick={() => startEditingTag(index, insight.label)}
                            className="text-xs font-semibold text-[#4338ca] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                      <div
                        className={`h-full rounded-full ${
                          insight.score >= 90
                            ? "bg-emerald-500"
                            : insight.score >= 75
                            ? "bg-amber-500"
                            : "bg-slate-500"
                        }`}
                        style={{ width: `${insight.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImageDetails;
