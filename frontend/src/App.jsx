import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/LandingPage";
import Problemset from "./pages/Problemset";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { checkAuth } from "./slices/authSlice";
import ContestPage from "./pages/ContestPage";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

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
            path="/manage-problems"
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
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
