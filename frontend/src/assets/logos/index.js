import { APP_NAME } from "../../config/app";

const label = APP_NAME.slice(0, 1).toUpperCase();
const placeholderLogo =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#111827"/><text x="24" y="30" text-anchor="middle" fill="white" font-size="16" font-family="system-ui,sans-serif" font-weight="600">${label}</text></svg>`
  );

export const logo = placeholderLogo;
export const main_logo = placeholderLogo;
export const google = null;
