import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect,useState } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/LandingPage";
import Problemset from "./pages/Problemset";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import ContestPage from "./pages/ContestPage";
import MySubmissions from "./pages/MySubmissions";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import LoadingPage from "./pages/LoadingPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { checkAuth } from "./slices/authSlice";


function App() {
  const { isAuthenticated, user ,loading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
    const delayTimer = setTimeout(() => {
      setHasMinTimePassed(true);
    }, 500); 
    return () => clearTimeout(delayTimer);
  }, [dispatch]);

  if (loading || !hasMinTimePassed) {
    return (
      <div className="flex flex-col min-h-screen bg-base-200">
        <Navbar /> 
        <main className="grow flex items-center justify-center">
          <LoadingPage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Navbar />

      <main className="grow">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Homepage /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/problems"
            element={
              isAuthenticated ? <Problemset /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && user?.role === "admin" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/problem/:id"
            element={
              isAuthenticated ? (
                <ProblemPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/contests"
            element={
              isAuthenticated ? (
                <ContestPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/submissions"
            element={
              isAuthenticated ? (
                <MySubmissions />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/change-password"
            element={
              isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />



          {/* this should be at last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;


