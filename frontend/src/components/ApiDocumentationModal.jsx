import { useEffect, useState } from "react";
import { Server, Copy, Check, ExternalLink, X } from "lucide-react";

const ApiDocumentationModal = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("curl");

  const apiKey = "vt_live_5829_2819_0012_a8b2...";

  const curlCode = `curl -X POST https://api.visiontag.ai/v1/analyze \\
  -H \"Authorization: Bearer YOUR_API_KEY\" \\
  -H \"Content-Type: application/json\" \\
  -d '{\n    "image_url": "https://cdn.example.com/item_01.jpg",\n    "features": ["tags", "objects", "colors"],\n    "min_confidence": 0.85\n  }'`;

  const pythonCode = `import requests

url = "https://api.visiontag.ai/v1/analyze"

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

payload = {
    "image_url": "https://cdn.example.com/item_01.jpg",
    "features": ["tags", "objects", "colors"],
    "min_confidence": 0.85
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())`;

  const nodeCode = `const axios = require("axios");

const response = await axios.post(
  "https://api.visiontag.ai/v1/analyze",
  {
    image_url: "https://cdn.example.com/item_01.jpg",
    features: ["tags", "objects", "colors"],
    min_confidence: 0.85
  },
  {
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    }
  }
);

console.log(response.data);`;

  const getCode = () => {
    switch (activeTab) {
      case "python":
        return pythonCode;
      case "node":
        return nodeCode;
      default:
        return curlCode;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-vt-surface-container-lowest border border-vt-outline-variant shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        <header className="flex items-center justify-between border-b border-vt-outline-variant bg-vt-surface-container-high px-6 py-4">
          <div className="flex items-center gap-3 text-vt-primary">
            <Server className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-semibold text-vt-on-surface">API Documentation</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-vt-on-surface-variant hover:bg-vt-surface-container-high transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-vt-primary-container text-vt-primary text-xs font-bold uppercase tracking-wide">
                Guide
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-vt-on-surface">Quick Start</h3>
                <p className="text-vt-on-surface-variant mt-2 max-w-2xl">
                  Start integrating VisionTag precision image analysis into your application in less than 5 minutes.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-vt-on-surface-variant">Authentication</h4>
            <p className="text-vt-on-surface-variant">
              All requests must include your API Key in the <code className="rounded px-1 py-0.5 bg-vt-surface-container-lowest text-vt-primary">Authorization</code> header as a Bearer token.
            </p>
            <div className="flex flex-col gap-3 rounded-2xl border border-vt-outline-variant bg-vt-surface-container-high p-4 md:flex-row md:items-center md:justify-between">
              <code className="truncate text-vt-on-surface-variant font-mono">{apiKey}</code>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 text-vt-primary font-medium hover:underline"
              >
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Key</>}
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-vt-on-surface-variant">Analysis Endpoint</h4>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-vt-surface-container-high px-3 py-1 text-xs font-semibold uppercase text-vt-primary">POST</span>
              <code className="text-vt-primary">https://api.visiontag.ai/v1/analyze</code>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap border-b border-vt-outline-variant">
              {[
                { id: "curl", label: "cURL" },
                { id: "python", label: "Python" },
                { id: "node", label: "Node.js" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 font-medium transition ${
                    activeTab === tab.id
                      ? "text-vt-primary border-b-2 border-vt-primary"
                      : "text-vt-on-surface-variant hover:text-vt-on-surface"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative rounded-b-2xl bg-vt-surface text-vt-on-surface-variant p-6 overflow-x-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-7 text-vt-on-surface-variant">{getCode()}</pre>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(getCode())}
                className="absolute right-4 top-4 rounded-lg bg-vt-surface-container-high px-3 py-2 text-vt-primary transition hover:bg-vt-surface-container-highest"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-vt-on-surface-variant">Example Response</h4>
            <div className="rounded-2xl border border-vt-outline-variant bg-vt-surface-container-high p-6 overflow-x-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-7 text-vt-on-surface-variant">{
`{
  "status": "success",
  "data": {
    "tags": [
      {
        "label": "high-tech",
        "confidence": 0.992
      },
      {
        "label": "minimalism",
        "confidence": 0.985
      }
    ],
    "metadata": {
      "processing_time": "124ms"
    }
  }
}`
}</pre>
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-vt-outline-variant bg-vt-surface-container-high px-6 py-4 md:flex-row md:items-center md:justify-between">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-vt-primary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Full API Reference
          </a>
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-vt-on-surface-variant hover:text-vt-on-surface"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-vt-primary px-5 py-2 text-vt-on-primary font-medium hover:bg-vt-primary-container transition"
            >
              Go to Dashboard
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ApiDocumentationModal;
