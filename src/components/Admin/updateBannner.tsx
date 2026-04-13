"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import axiosInstance from "../../config/axios.config";

// Replace with your actual form input components
import { TextInput, ImageInput } from "../../components/formInput/formInput";

interface IFormInputs {
  title: string;
  description: string;
  link?: string;
  isActive: "active" | "inactive";
  image: File | null;
}

const UpdateBanner: React.FC = () => {
  const { id } = useParams(); // ✅ useParams inside component
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
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

  // Fetch banner details and populate form
  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/banners/${id}`);
        const banner = res.data.data;

        reset({
          title: banner.title,
          description: banner.description,
          link: banner.link || "",
          isActive: banner.isActive === "true" ? "active" : "inactive",
          image: null,
        });

        // If you want to show preview of existing image
        if (banner.image?.secureUrl) {
          setValue("image", banner.image.secureUrl as unknown as File);
        }
      } catch (err: any) {
        console.log(err);
        toast.error("Failed to fetch banner data");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, reset, setValue]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.link) formData.append("link", data.link);
      formData.append("isActive", data.isActive);
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await axiosInstance.put(`/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Banner updated successfully!", { position: "top-right" });
      navigate("/admin/banners");
    } catch (error: any) {
      console.log(error.response?.data || error);
      toast.error("Failed to update banner!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left side banner */}
      <div className="flex justify-center items-center bg-slate-900 border-2 border-slate-900">
        <div className="text-center">
          <h1 className="text-white text-5xl font-extrabold">Suv</h1>
          <h1 className="text-green-400 text-5xl font-extrabold">Yatra</h1>
        </div>
      </div>

      {/* Right side form */}
      <div className="p-10 bg-slate-900 border-2 border-slate-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          encType="multipart/form-data"
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
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
              Is Active?
            </label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-white"
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
            disabled={isSubmitting || loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
                text-slate-900 font-bold rounded-2xl transition-all transform
                hover:scale-[1.01] active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting || loading ? "Submitting..." : "Update Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBanner;