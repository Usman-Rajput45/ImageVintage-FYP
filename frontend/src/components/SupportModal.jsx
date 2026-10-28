import { useEffect, useState } from "react";
import { X, HelpCircle, Send, CheckCircle } from "lucide-react";

const SupportModal = ({ onClose }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState("pricing");

  const faqs = [
    {
      id: "pricing",
      question: "How does pricing work?",
      answer:
        "VisionTag pricing is usage-based. You pay per image processed with volume discounts available for higher monthly usage. Contact our team for enterprise plans and dedicated support.",
    },
    {
      id: "formats",
      question: "Supported image formats",
      answer:
        "VisionTag supports JPG and PNG formats (up to 10 MB). For optimal results, upload clear, high-resolution images with well-defined subjects.",
    },
    {
      id: "rateLimits",
      question: "API rate limits",
      answer:
        "API rate limits vary by subscription level. Standard accounts receive up to 100 requests per minute, while premium and enterprise plans get higher throughput and SLA support.",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[32px] bg-white shadow-2xl border border-slate-200 flex flex-col md:flex-row">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Contact Us</h2>
              <p className="text-slate-600">We typically respond within 24 hours.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || isSent}
              className={`w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
                isSent ? "bg-emerald-600 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
              } ${isSending ? "cursor-wait" : ""}`}
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin inline-flex">
                    <Send className="w-4 h-4" />
                  </span>
                  Sending...
                </span>
              ) : isSent ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Message Sent
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Message
                  <Send className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="w-full md:w-[360px] bg-slate-50 border-t border-slate-200 md:border-t-0 md:border-l p-8 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Quick Resources</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-4">Popular FAQs</h4>
              <ul className="space-y-3">
                {faqs.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveFaq(item.id)}
                      className={`group flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-left transition outline-none focus:outline-none ${
                        activeFaq === item.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                      }`}
                    >
                      <HelpCircle className="w-5 h-5" />
                      <span>{item.question}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm">
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  {faqs.find((faq) => faq.id === activeFaq)?.question}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {faqs.find((faq) => faq.id === activeFaq)?.answer}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
