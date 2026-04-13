"use client";

import React from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { ImageInput, TextInput } from "../../components/formInput/formInput";
import { toast } from "sonner";
import axiosInstance from "../../config/axios.config";

interface IFormInputs {
  title: string;
  description: string;
  link?: string;
  isActive: string;
  image: File | null;
}

const AddBanner: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      link: "",
      isActive: "active",
      image: null,
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.link) formData.append("link", data.link);
      formData.append("isActive", data.isActive);
      if (data.image) formData.append("image", data.image);

      const response = await axiosInstance.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", response.data);
      toast.success("Banner Listed Successfully!!", { position: "top-right" });
      navigate("/admin/banners");
    } catch (error: any) {
      console.log(error.response?.data || error);
      toast.error("Failed to create banner!");
    }
  };

  return (
    <div className="w-full h-screen bg-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left side banner */}
      <div className="grid bg-slate-900 border-2 border-slate-900 h-screen">
        <div className="relative flex font-sans font-extrabold justify-center top-100">
          <p className="text-white text-5xl">Suv</p>
          <p className="text-green-400 text-5xl">Yatra</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="grid bg-slate-900 border-2 border-slate-900 h-screen">
        <div className="p-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 gap-4 p-5"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Title
              </label>
              <TextInput
                control={control}
                name="title"
                errMsg={errors?.title?.message as string}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Description
              </label>
              <TextInput
                control={control}
                name="description"
                errMsg={errors?.description?.message as string}
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Link (optional)
              </label>
              <TextInput
                control={control}
                name="link"
                errMsg={errors?.link?.message as string}
              />
            </div>

            {/* IsActive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Is Active?
              </label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="input w-full hover:bg-slate-900 border border-slate-900 bg-slate-900"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                )}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Banner Image
              </label>
              <ImageInput
                control={control}
                name="image"
                errMsg={errors?.image?.message as string}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
                text-slate-900 font-bold rounded-2xl transition-all transform
                hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? "Submitting..." : "Create Banner"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;