import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import "../../assets/css/style.css";
import { Link, useNavigate } from "react-router";
import { EmailInput, PasswordInput } from "../formInput/formInput";
import authSvc from "../../services/Auth.service";
import { toast } from "sonner";
import { useAuth } from "../../context/auth.context";

export interface ICredentials {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {setLoggedInUserProfile} = useAuth();

  const onSubmit: SubmitHandler<ICredentials> = async (data) => {
    try {
      const response = await authSvc.postRequest("/auth/login", data);

      console.log("Login response:", response);

      if (response) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      const getUser = async () => {
        const res = await authSvc.getRequest("/auth/me");
        return res;
       
      };
      const getUserData = await getUser();

      toast.success(`Welcome to ${getUserData.data.role}`, {
        position: "top-right",
        style: {
          background: "#28a745",
          color: "white",
        },
      });
      console.log("UserDetail:  ",getUserData.data);
      
      setLoggedInUserProfile(getUserData.data,)

      // Add slight delay for debugging (optional)
      setTimeout(() => {
        navigate("/"+getUserData.data.role);
      }, 300);

    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in-up">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
              Email or Phone
            </label>

            <EmailInput control={control} name={"email"} />

            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
              Password
            </label>

            <PasswordInput control={control} name={"password"} />

            {errors.password && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-emerald-500 w-4 h-4"
              />
              Remember me
            </label>

            <a
              href={`${import.meta.env.VITE_NEXTJS_FRONTEND_URL}/forget-password`}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
            text-slate-900 font-bold rounded-2xl transition-all transform
            hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? "Signing In..." : "Sign In to SuvYatra"}
          </button>

          {/* Register link */}
          <div>
            <p className="text-center text-slate-400 mt-6 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-400 font-semibold hover:underline transition-all"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
