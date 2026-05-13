import React, { useEffect, useRef } from "react";
import { Routes, Route } from "react-router";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Auth Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

// Main Pages
import HomePage from "../pages/HomePage";
import BrowseJobs from "../pages/BrowseJobs";
import JobsPage from "../pages/JobsPage";
import DashboardPage from "../pages/DashboardPage";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import ProfilePage from "../pages/ProfilePage";
import ProfileEditPage from "../pages/ProfileEditPage";

// Dynamic Pages
import JobDescriptionPage from "../pages/JobDescriptionPage.jsx";
import EmployerProfilePage from "../pages/EmployerProfilePage.jsx";

import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../features/AuthSlice";
import CreateProfilePage from "../pages/CreateProfilePage.jsx";
import NetworkPage from "../pages/NetworkPage.jsx";
import JobPostFormPage from "../pages/JobPostFormPage.jsx";
import api from "../config/api";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");

      if (token && !hasCheckedSession.current) {
        hasCheckedSession.current = true;

        try {
          const res = await api.get("/auth/me");
          dispatch(addUser(res.data));
        } catch (error) {
          console.error("Session expired or invalid token:", error);
          dispatch(removeUser());
        }
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <Routes>
      {/* --- PUBLIC AUTH ROUTES --- */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="create-profile" element={<CreateProfilePage />} />
        </Route>
      </Route>

      {/* --- PROTECTED MAIN ROUTES --- */}
      <Route path="/" element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          {/* Core Navigation */}
          <Route index element={<HomePage />} />
          <Route path="browse-jobs" element={<BrowseJobs />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="hr/jobs/new" element={<JobPostFormPage />} />
          <Route path="hr/jobs/:jobId/edit" element={<JobPostFormPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Dynamic Routes */}
          <Route path="jobs/:jobId" element={<JobDescriptionPage />} />
          <Route
            path="employer/:employerId"
            element={<EmployerProfilePage />}
          />

          {/* Profile Management */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="network" element={<NetworkPage />} />

          {/* Static Pages */}
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Catch-All 404 */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
