import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../features/AuthSlice";
import api from "../config/api";

const LoginPage = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
      );

      localStorage.setItem("accessToken", res.data.token);

      const me = await api.get("/auth/me");
      dispatch(addUser(me.data));

      toast.success(res.data.message);

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleForgotPassword = () => {
    const currentEmail = getValues("email");
    navigate("/auth/forgot-password", {
      state: { prefilledEmail: currentEmail || "" },
    });
  };

  return (
    <div className="flex items-center justify-center w-full py-12 sm:py-20 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            {/* Changed from 'username' to 'email' to match your Database model */}
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-foreground">
                Password
              </label>
              <span
                onClick={handleForgotPassword}
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            <div className="relative">
              <input
                type={togglePassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow pr-14"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setTogglePassword(!togglePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary cursor-pointer"
              >
                {togglePassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-6 flex justify-center gap-1">
          <span>Don't have an account?</span>
          <button
            onClick={() => navigate("/auth/register")}
            className="text-primary font-medium hover:underline cursor-pointer focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
