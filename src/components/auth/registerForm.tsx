import "../../assets/css/style.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  EmailInput,
  ImageInput,
  PasswordInput,
  PhoneInput,
  TextInput,
} from "../formInput/formInput";
import { RegisterDTO, type IRegisterFormData } from "../contract";
import axiosInstance from "../../config/axios.config";
import React from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "male",
      role: "passenger",
      address: "",
      image: null,
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(RegisterDTO),
  });

  const onSubmit: SubmitHandler<IRegisterFormData> = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append(key, value as File);
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await axiosInstance.post("/auth/register", formData);

      toast.success("Registration successful !!", {
        position: "top-right",
      });
      const userEmail = encodeURIComponent(data.email);
      navigate(`/activate?email=${userEmail}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed !!", {
        position: "top-right",
      });
      // console.log("Registration Failed:", error.response?.data || error);
    }
  };

  const onError = (err: any) => {
    console.log("Validation Errors:", err);
  };

  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-slate-400 mt-2">
            Join SuvYatra for a better travel experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div>
            <label className="text-slate-300">Name</label>
            <TextInput
              control={control}
              name="name"
              errMsg={errors?.name?.message as string}
            />
          </div>

          <div>
            <label className="text-slate-300">Email</label>
            <EmailInput
              control={control}
              name="email"
              errMsg={errors?.email?.message as string}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PhoneInput
              control={control}
              name="phone"
              errMsg={errors?.phone?.message as string}
            />

            <ImageInput
              control={control}
              name="image"
              errMsg={errors?.image?.message as string}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="input w-full focus:outline-none focus:ring-0"
                >
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="input w-full focus:outline-none focus:ring-0"
                >
                  <option value="passenger">Passenger</option>
                  <option value="driver">Driver</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            />
          </div>

          <div>
            <TextInput
              control={control}
              name="address"
              errMsg={errors?.address?.message as string}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PasswordInput
              control={control}
              name="password"
              errMsg={errors?.password?.message as string}
            />

            <PasswordInput
              control={control}
              name="confirmPassword"
              errMsg={errors?.confirmPassword?.message as string}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-500 text-black rounded-xl"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-slate-400 text-sm mt-4">
            Already have an account?{" "}
            <a href="/" className="text-emerald-400">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
