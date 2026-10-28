import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import RequireAuth from "./components/RequireAuth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/Error";
import HomePage from "./pages/HomePage";
import AnalyzingPage from "./pages/AnalyzingPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import ImageDetails from "./pages/ImageDetails";
import ProfilePage from "./pages/ProfilePage";

const AppRouter = () => {
  return (
    <Routes>
      {/* VisionTag core flow */}
      <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
      <Route path="/analyzing" element={<RequireAuth><AnalyzingPage /></RequireAuth>} />
      <Route path="/results" element={<RequireAuth><ResultsPage /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><HistoryPage /></RequireAuth>} />
      <Route path="/history/:id" element={<RequireAuth><ImageDetails /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/error" element={<ErrorPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
