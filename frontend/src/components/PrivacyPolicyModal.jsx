import { useEffect } from "react";
import { X } from "lucide-react";

const PrivacyPolicyModal = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-vt-surface-container-lowest border border-vt-outline-variant shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
        <header className="flex items-center justify-between border-b border-vt-outline-variant bg-vt-surface-container-high px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-vt-on-surface">Privacy Policy</h2>
            <p className="text-sm text-vt-on-surface-variant">Last Updated: June 15, 2024</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-vt-on-surface-variant hover:bg-vt-surface-container-high transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-vt-on-surface">1. Introduction</h3>
            <p className="text-vt-on-surface-variant leading-7">
              VisionTag AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website, mobile app, and other online products and services.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-vt-on-surface">2. Data Collection</h3>
            <p className="text-vt-on-surface-variant leading-7">
              We collect information you provide directly to us, such as when you create an account, upload images for analysis, or communicate with us.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-vt-on-surface-variant">
              <li>Account information: name, email, and password.</li>
              <li>Uploaded content: images and associated metadata for AI analysis.</li>
              <li>Usage data: how you interact with our tools and dashboard.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-vt-on-surface">3. Use of Information</h3>
            <p className="text-vt-on-surface-variant leading-7">
              We use the information we collect to provide, maintain, and improve our services, including training our machine learning models (unless you opt out), processing your transactions, and sending you technical notices.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-vt-on-surface">4. Cookies and Tracking</h3>
            <p className="text-vt-on-surface-variant leading-7">
              We use cookies to maintain your session and remember your preferences. These cookies are essential for the core functionality of the VisionTag platform. You can manage cookie preferences in your browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-vt-on-surface">5. Data Sharing</h3>
            <p className="text-vt-on-surface-variant leading-7">
              We do not sell your personal data. We may share information with service providers who perform services for us, or in response to a request for information if we believe disclosure is in accordance with applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-vt-on-surface">6. Security</h3>
            <p className="text-vt-on-surface-variant leading-7">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>
        </div>

        <footer className="border-t border-vt-outline-variant bg-vt-surface-container-low px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-vt-primary text-vt-on-primary font-medium hover:bg-vt-primary-container active:scale-95 transition"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
