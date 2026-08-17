const BrandLogo = ({ className = "" }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8.75 3.75h9.35L24.25 9.9v15.35a3 3 0 0 1-3 3H8.75a3 3 0 0 1-3-3v-18.5a3 3 0 0 1 3-3Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M18 3.9v6.2h6.2" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M10.2 16.15v-1.1a1.5 1.5 0 0 1 1.5-1.5h1.1M20.3 13.55h1.1a1.5 1.5 0 0 1 1.5 1.5v1.1M22.9 20.85v1.1a1.5 1.5 0 0 1-1.5 1.5h-1.1M12.8 23.45h-1.1a1.5 1.5 0 0 1-1.5-1.5v-1.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="16.75" cy="18.5" r="2.25" fill="currentColor" />
  </svg>
);

export default BrandLogo;
