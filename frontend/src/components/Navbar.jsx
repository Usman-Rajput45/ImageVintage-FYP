import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { APP_NAME } from "../config/app";
import { logout } from "../store/slices/authSlice";
import BrandLogo from "./visiontag/BrandLogo";

const navLinkClass = (active) =>
  [
    "pb-1 text-vt-label-md font-semibold transition-colors duration-200 active:scale-95 no-underline",
    active
      ? "text-vt-primary"
      : "text-vt-on-surface-variant hover:text-vt-primary",
  ].join(" ");

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const isHistory = pathname === "/history";
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const user = useSelector((state) => state.auth?.user);
  const isGuest = Boolean(user?.isGuest);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-vt-outline-variant bg-vt-surface-container-lowest">
      <div className="mx-auto flex h-16 w-full max-w-vt-container items-center justify-between px-vt-lg">
        <div className="flex items-center gap-vt-xl">
          <Link
            to="/"
            className="flex items-center gap-2 text-vt-headline-md font-bold text-vt-on-surface no-underline"
            onClick={() => setIsMenuOpen(false)}
          >
            <BrandLogo className="h-8 w-8 shrink-0 text-vt-primary" />
            {APP_NAME}
          </Link>
          <div className="hidden gap-vt-lg md:flex">
            <Link to="/" className={navLinkClass(isHome)}>
              Home
            </Link>
            <Link to="/history" className={navLinkClass(isHistory)}>
              History
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-vt-outline-variant bg-vt-surface-container-highest text-vt-on-surface shadow-sm transition-all hover:bg-vt-surface hover:text-vt-primary focus:outline-none focus:ring-2 focus:ring-vt-primary/40 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="relative block h-5 w-5">
              <span className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 bg-current transition ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 bg-current transition ${isMenuOpen ? "-rotate-45" : "opacity-100"}`} />
              <span className={`absolute left-1/2 top-1/2 block h-0.5 w-5 -translate-x-1/2 bg-current transition ${isMenuOpen ? "opacity-0" : "translate-y-1.5"}`} />
            </span>
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="rounded-vt-lg bg-vt-primary px-vt-lg py-vt-sm text-vt-label-md font-semibold text-vt-on-primary transition-all hover:opacity-90 active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          ) : (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-vt-primary text-sm font-semibold text-vt-on-primary transition-transform active:scale-95"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
                aria-label="Account menu"
              >
                {isGuest ? "G" : initials}
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-vt-lg border border-vt-outline-variant bg-vt-surface-container-lowest shadow-lg">
                    <div className="border-b border-vt-outline-variant px-4 py-3">
                      <p className="truncate text-vt-label-md font-semibold text-vt-on-surface">
                        {isGuest ? "Guest session" : user?.fullName || "Account"}
                      </p>
                      {!isGuest && (
                        <p className="truncate text-vt-body-sm text-vt-on-surface-variant">{user?.email}</p>
                      )}
                      {isGuest && (
                        <p className="text-vt-body-sm text-vt-on-surface-variant">Results won't be saved</p>
                      )}
                    </div>
                    {!isGuest && (
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-3 text-vt-body-md text-vt-on-surface hover:bg-vt-surface-container-highest"
                      >
                        Profile settings
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-vt-body-md text-red-600 hover:bg-vt-surface-container-highest"
                    >
                      {isGuest ? "Exit guest mode" : "Log out"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden border-t border-vt-outline-variant bg-vt-surface-container-lowest shadow-sm`}
           onClick={() => setIsMenuOpen(false)}>
        <div className="mx-auto flex max-w-vt-container flex-col gap-2 px-vt-lg py-3">
          <Link
            to="/"
            className={`${navLinkClass(isHome)} rounded-vt-lg px-3 py-2 text-vt-body-md text-left hover:bg-vt-surface-container-highest`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/history"
            className={`${navLinkClass(isHistory)} rounded-vt-lg px-3 py-2 text-vt-body-md text-left hover:bg-vt-surface-container-highest`}
            onClick={() => setIsMenuOpen(false)}
          >
            History
          </Link>

          {isAuthenticated && !isGuest && (
            <Link
              to="/profile"
              className="rounded-vt-lg px-3 py-2 text-left text-vt-body-md text-vt-on-surface-variant hover:bg-vt-surface-container-highest hover:text-vt-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile settings
            </Link>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-vt-lg px-3 py-2 text-left text-vt-body-md text-red-600 hover:bg-vt-surface-container-highest"
            >
              {isGuest ? "Exit guest mode" : "Log out"}
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-vt-lg px-3 py-2 text-left text-vt-body-md font-semibold text-vt-primary hover:bg-vt-surface-container-highest"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
