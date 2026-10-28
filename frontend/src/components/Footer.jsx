import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE } from "../config/app";
import TermsOfServiceModal from "./TermsOfServiceModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import ApiDocumentationModal from "./ApiDocumentationModal";
import SupportModal from "./SupportModal";

const footerLinks = [
  { label: "Terms of Service", to: "#", action: "terms" },
  { label: "Privacy Policy", to: "#", action: "privacy" },
  { label: "API Docs", to: "#", action: "api" },
  { label: "Support", to: "#", action: "support" },
];

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <footer className="mt-auto border-t border-vt-outline-variant bg-vt-surface-container-low">
        <div className="mx-auto flex w-full max-w-vt-container flex-col gap-vt-md px-vt-lg py-vt-xl md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-vt-xs md:items-start">
            <span className="text-vt-headline-md font-bold text-vt-on-surface">
              {APP_NAME}
            </span>
            <p className="text-vt-body-sm text-vt-on-surface-variant">
              © {new Date().getFullYear()} {APP_NAME} AI. {APP_TAGLINE}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-vt-lg">
            {footerLinks.map(({ label, to, action }) => (
              action ? (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveModal(action)}
                  className="text-vt-label-sm text-vt-on-surface-variant underline transition-all hover:text-vt-primary"
                >
                  {label}
                </button>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className="text-vt-label-sm text-vt-on-surface-variant underline transition-all hover:text-vt-primary"
                >
                  {label}
                </Link>
              )
            ))}
          </div>
        </div>
      </footer>

      {activeModal === "terms" && <TermsOfServiceModal onClose={() => setActiveModal(null)} />}
      {activeModal === "privacy" && <PrivacyPolicyModal onClose={() => setActiveModal(null)} />}
      {activeModal === "api" && <ApiDocumentationModal onClose={() => setActiveModal(null)} />}
      {activeModal === "support" && <SupportModal onClose={() => setActiveModal(null)} />}
    </>
  );
};

export default Footer;
