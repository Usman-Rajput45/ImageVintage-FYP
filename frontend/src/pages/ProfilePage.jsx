import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ReusableInput } from "../components/Form";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { setUser } from "../store/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.auth?.user);

  const [form, setForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [detailsMessage, setDetailsMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const profile = await getUserProfile();
        setForm({
          fullName: profile?.fullName ?? sessionUser?.fullName ?? "",
          email: profile?.email ?? sessionUser?.email ?? "",
        });
      } catch (error) {
        // Backend not reachable yet — fall back to what we already know from the session
        setForm({
          fullName: sessionUser?.fullName ?? "",
          email: sessionUser?.email ?? "",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setDetailsMessage(null);
    setSavingDetails(true);

    try {
      const updated = await updateUserProfile({ fullName: form.fullName, email: form.email });
      dispatch(setUser({ ...sessionUser, fullName: updated?.fullName ?? form.fullName, email: updated?.email ?? form.email }));
      setDetailsMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setDetailsMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Could not update profile. Please try again.",
      });
    } finally {
      setSavingDetails(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      await updateUserProfile({ password: passwordForm.newPassword });
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setPasswordMessage({ type: "success", text: "Password changed successfully." });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "Could not change password. Please try again.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="custom-scrollbar flex min-h-screen flex-col bg-vt-surface font-sans text-vt-body-md text-vt-on-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-grow px-vt-gutter pt-24 pb-vt-xl sm:px-vt-lg sm:pt-28 md:pt-32">
        <header className="mb-vt-xl">
          <h1 className="mb-vt-sm text-vt-headline-lg-mobile font-bold text-vt-on-background sm:text-vt-headline-lg">
            Profile Settings
          </h1>
          <p className="max-w-2xl text-vt-body-md text-vt-on-surface-variant">
            Update your name, email address, and password.
          </p>
        </header>

        {loadingProfile ? (
          <div className="rounded-vt-lg border border-dashed border-vt-outline-variant bg-vt-surface-container-lowest py-vt-xl text-center">
            <p className="text-vt-body-md text-vt-on-surface-variant">Loading your profile…</p>
          </div>
        ) : (
          <div className="space-y-vt-lg">
            <section className="rounded-vt-lg border border-vt-outline-variant bg-vt-surface-container-lowest p-vt-lg sm:p-vt-xl">
              <h2 className="text-vt-title-md font-semibold text-vt-on-surface">Account details</h2>
              <p className="mt-1 text-vt-body-sm text-vt-on-surface-variant">
                This is the name and email associated with your VisionTag account.
              </p>

              <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-4">
                <ReusableInput
                  label="Full name"
                  name="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
                <ReusableInput
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />

                {detailsMessage && (
                  <p
                    role="status"
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      detailsMessage.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {detailsMessage.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingDetails}
                  className="h-11 rounded-vt-lg bg-vt-primary px-6 text-sm font-semibold text-vt-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingDetails ? "Saving…" : "Save changes"}
                </button>

               
              </form>
            </section>

            <section className="rounded-vt-lg border border-vt-outline-variant bg-vt-surface-container-lowest p-vt-lg sm:p-vt-xl">
              <h2 className="text-vt-title-md font-semibold text-vt-on-surface">Change password</h2>
              <p className="mt-1 text-vt-body-sm text-vt-on-surface-variant">
                Leave this section blank if you don't want to change your password.
              </p>

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <ReusableInput
                  type="password"
                  label="New password"
                  name="newPassword"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                />
                <ReusableInput
                  type="password"
                  label="Confirm new password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                />

                {passwordMessage && (
                  <p
                    role="status"
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      passwordMessage.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {passwordMessage.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="h-11 rounded-vt-lg border border-vt-outline-variant bg-vt-surface-container-lowest px-6 text-sm font-semibold text-vt-on-surface transition hover:bg-vt-surface-container-highest disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPassword ? "Updating…" : "Update password"}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
