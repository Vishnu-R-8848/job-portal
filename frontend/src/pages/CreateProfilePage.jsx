import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/AuthSlice";

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ================= FETCH PROFILE =================

  const fetchProfile = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("accessToken");

      const response = await axios.get(
        "http://localhost:3000/api/profile/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profile = response.data.profile;

      // PROFILE EXISTS
      setProfileExists(true);

      // PREFILL FORM
      reset({
        bio: profile.bio || "",

        skills: profile.skills
          ? profile.skills.join(", ")
          : "",

        github: profile.github || "",

        linkedin: profile.linkedin || "",

        portfolio: profile.portfolio || "",

        experience: profile.experience || "",

        education: profile.education || "",
      });
    } catch (error) {
      console.log(error);

      // PROFILE NOT FOUND = CREATE MODE
      setProfileExists(false);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  // ================= USE EFFECT =================

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ================= SUBMIT =================

 const onSubmit = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const formattedData = {
      ...data,

      skills: data.skills
        .split(",")
        .map((skill) => skill.trim()),
    };

    const response = await axios.post(
      "http://localhost:3000/api/profile/create",
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(updateUser(response.data.user));

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    toast.success("Profile Created Successfully");

    navigate("/dashboard");
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
        "Failed to create profile"
    );
  }
};

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        Loading...
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <div className="w-full max-w-3xl bg-card border border-border rounded-3xl p-8 shadow-sm">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground">
            {profileExists
              ? "Update Profile"
              : "Create Profile"}
          </h1>

          <p className="text-muted-foreground mt-2">
            Complete your developer profile
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* BIO */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Bio
            </label>

            <textarea
              rows={4}
              placeholder="Tell about yourself..."
              {...register("bio", {
                required: "Bio is required",
              })}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />

            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* SKILLS */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Skills
            </label>

            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              {...register("skills", {
                required: "Skills are required",
              })}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />

            <p className="text-xs text-muted-foreground mt-1">
              Separate skills with commas
            </p>

            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">
                {errors.skills.message}
              </p>
            )}
          </div>

          {/* GITHUB */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Github
            </label>

            <input
              type="text"
              placeholder="https://github.com/username"
              {...register("github")}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* LINKEDIN */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Linkedin
            </label>

            <input
              type="text"
              placeholder="https://linkedin.com/in/username"
              {...register("linkedin")}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* PORTFOLIO */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Portfolio
            </label>

            <input
              type="text"
              placeholder="https://yourportfolio.com"
              {...register("portfolio")}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* EXPERIENCE */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Experience
            </label>

            <input
              type="text"
              placeholder="Frontend Developer at XYZ"
              {...register("experience")}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* EDUCATION */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Education
            </label>

            <input
              type="text"
              placeholder="BCA - GFGC Pavagada"
              {...register("education")}
              className="w-full border border-border rounded-xl px-4 py-3 bg-background outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition"
          >
            {isSubmitting
              ? "Saving..."
              : profileExists
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfilePage;
