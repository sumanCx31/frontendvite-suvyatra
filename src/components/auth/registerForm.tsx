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
      role: "admin",
      address: "",
      image: null,
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(RegisterDTO),
  });

  const onSubmit: SubmitHandler<IRegisterFormData> = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response);

      navigate("/");
    } catch (error: any) {
      console.log("Registeration Failed! ", error);
      alert("Invalid credientials");
    }
  };

  return (
    <div className="flex justify-center lg:justify-end">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl animate-fade-in-up">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-slate-400 mt-2">
            Join SuvYatra for a better travel experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Name
            </label>
            <TextInput
              control={control}
              name={"name"}
              errMsg={errors?.name?.message as string}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Email Address
            </label>
            <EmailInput
              control={control}
              name={"email"}
              errMsg={errors?.email?.message as string}
            />
          </div>

          {/* Phone & Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Phone Number
              </label>
              <PhoneInput
                control={control}
                name={"phone"}
                errMsg={errors?.phone?.message as string}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Profile Photo
              </label>
              <ImageInput
                control={control}
                name={"image"}
                errMsg={errors?.image?.message as string}
              />
            </div>
          </div>

          {/* Gender & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select {...field} className="input w-full">
                    <option value="">Select Gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                  </select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Role
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <select {...field} className="input w-full">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Address
            </label>
            <TextInput
              control={control}
              name={"address"}
              errMsg={errors?.name?.message as string}
            />
          </div>


          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Password
              </label>
              <PasswordInput
                control={control}
                name={"password"}
                errMsg={errors?.password?.message as string}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Confirm
              </label>
              <PasswordInput
                control={control}
                name={"confirmPassword"}
                errMsg={errors?.confirmPassword?.message as string}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
              text-slate-900 font-bold rounded-2xl transition-all transform
              hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting
              ? "Register for SuvYatra...."
              : "Register for SuvYatra"}
          </button>
        

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/"
            className="text-emerald-400 font-semibold hover:underline transition-all"
          >
            Log in here
          </a>
        </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
