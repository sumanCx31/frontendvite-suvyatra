"use client";

import React from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { ImageInput, TextInput } from "../../components/formInput/formInput";
import { toast } from "sonner";
import axiosInstance from "../../config/axios.config";

interface IFormInputs {
  name: string;
  busNumber: string;
  busType: string;
  isActive: string;
  driverName: string;
  totalSeats: number;
  phone: string;
  image: File | null;
  driverId:string;
}

const AddBus: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    defaultValues: {
      busNumber: "",
      busType: "",
      isActive: "active",
      driverId:"69b3e1981b2b62c1fff48fc7",
      driverName: "",
      totalSeats: 30,
      image: null,
      phone: "",
    },
  });
const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const response = await axiosInstance.post("/bus", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response:", response);
      toast.success("Bus Listed Sucessfully!!",{
        position:"top-right"
      })
      navigate("/admin/manage-buses");
    } catch (error: any) {
      console.log(error);
      alert("Not listed at the moment!");
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid bg-slate-900 border-2 border-slate-900 h-screen">
          <div className="relative flex font-sans font-extrabold justify-center top-100">
            <p className="text-white text-5xl">Suv</p>
            <p className="text-green-400 text-5xl">Yatra</p>
          </div>
        </div>
        <div className="grid bg-slate-900 border-2 border-slate-900 h-screen">
          <div className="p-15">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 gap-4 p-5">
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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Bus Number
                </label>
                <TextInput
                  control={control}
                  name={"busNumber"}
                  errMsg={errors?.name?.message as string}
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Total Seats
                </label>
                <TextInput
                  control={control}
                  name={"totalSeats"}
                  errMsg={errors?.name?.message as string}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Driver Name
                </label>
                <TextInput
                  control={control}
                  name={"driverName"}
                  errMsg={errors?.name?.message as string}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  DriverId
                </label>
                <TextInput
                  control={control}
                  name={"driverId"}
                  errMsg={errors?.name?.message as string}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Phone
                </label>
                <TextInput
                  control={control}
                  name={"phone"}
                  errMsg={errors?.name?.message as string}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                Bus Type
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                    
                  </label>
                  <Controller
                    name="busType"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="input w-full hover hover:bg-slate-900 border border-slate-900 bg-slate-900">
                        <option value="deluxe">deluxe</option>
                        <option value="ac">ac</option>
                      </select>
                    )}
                  />
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                  Photo
                </label>
                <ImageInput
                  control={control}
                  name={"image"}
                  errMsg={errors?.image?.message as string}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                IsActive ?
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                    
                  </label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="input w-full  hover:bg-slate-900 border border-slate-900 bg-slate-900">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    )}
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
                {isSubmitting ? "Signing In..." : "Sign In to SuvYatra"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBus;
