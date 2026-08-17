import { useEffect } from "react";
import { X } from "lucide-react";

const TermsOfServiceModal = ({ onClose }) => {
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
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-vt-surface-container-lowest shadow-2xl border border-vt-outline-variant flex flex-col animate-in fade-in zoom-in duration-300">
        <header className="flex items-center justify-between border-b border-vt-outline-variant px-6 py-4">
          <h2 className="text-2xl font-semibold text-vt-on-surface">Terms of Service</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-vt-on-surface-variant hover:bg-vt-surface-container-high transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-vt-primary">1. Acceptance of Terms</h3>
            <p className="text-vt-on-surface-variant leading-7">
              By accessing or using VisionTag AI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-vt-primary">2. User Conduct</h3>
            <p className="text-vt-on-surface-variant leading-7">
              You agree to use VisionTag AI only for lawful purposes. You are prohibited from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-vt-on-surface-variant">
              <li>Uploading images that infringe upon intellectual property rights.</li>
              <li>Attempting to reverse engineer the AI analysis algorithms.</li>
              <li>Using the service for unauthorized scraping or data mining.</li>
              <li>Engaging in activities that disrupt or damage the service.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-vt-primary">3. Intellectual Property (IP)</h3>
            <p className="text-vt-on-surface-variant leading-7">
              VisionTag AI and its original content, features, and functionality remain the exclusive property of VisionTag AI and its licensors.
            </p>
            <div className="border-l-4 border-vt-primary bg-vt-surface-container-low px-4 py-3 rounded-md italic text-vt-on-surface-variant">
              User-uploaded images remain the property of the user; however, you grant VisionTag AI a non-exclusive license to process and analyze the content for providing services.
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-semibold text-vt-primary">4. Limitation of Liability</h3>
            <p className="text-vt-on-surface-variant leading-7">
              VisionTag AI shall not be liable for indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
            <p className="text-vt-on-surface-variant leading-7">
              AI-generated tags and image analysis results are provided "as is" without guarantees regarding accuracy or reliability.
            </p>
          </section>

          <section className="space-y-3 pb-4">
            <h3 className="text-xl font-semibold text-vt-primary">5. Termination</h3>
            <p className="text-vt-on-surface-variant leading-7">
              We may terminate or suspend your account and access to the service immediately, without prior notice, for violations of these Terms.
            </p>
          </section>
        </div>

        <footer className="border-t border-vt-outline-variant bg-vt-surface-container-low px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-vt-primary text-vt-on-primary hover:bg-vt-primary-container active:scale-95 transition"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
