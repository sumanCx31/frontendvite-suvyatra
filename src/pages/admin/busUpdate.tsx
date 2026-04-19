"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { 
  Bus, 
  User, 
  Phone, 
  Armchair, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import authSvc from "../../services/Auth.service";



interface IBusUpdateForm {
  name: string;
  busNumber: string;
  busType: string;
  driverName: string;
  phone: string;
  totalSeats: number;
  isActive: string;
  image?: {
    secureUrl: string;
  };
}

const BusUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IBusUpdateForm>();

  // Fetch Data on Load
  useEffect(() => {
    const getBus = async () => {
      try {
        const response = await authSvc.getRequest(`/bus/${id}`);
        const busData = response.data;
        
        // Auto-fill form fields
        reset(busData);
        
        // Set image preview if exists
        if (busData.image?.secureUrl) {
          setPreview(busData.image.secureUrl);
        }
        
        setLoading(false);
      } catch (error) {
        toast.error("Bus not found!");
        navigate("/admin/manage-buses");
      }
    };
    getBus();
  }, [id, reset, navigate]);

  const onSubmit = async (data: IBusUpdateForm) => {
    try {
      // Note: If you are uploading a new image, use FormData. 
      // Otherwise, simple JSON works for text fields.
      await authSvc.putRequest(`/bus/${id}`, data);
      toast.success("Fleet updated successfully");
      navigate("/admin/manage-buses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-emerald-500">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black uppercase tracking-widest text-xs">Syncing Fleet Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-3"
          >
            <ArrowLeft size={14} /> Back to Inventory
          </button>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Edit <span className="text-emerald-500">Bus Unit</span>
          </h1>
        </div>
        
        {preview && (
          <div className="h-16 w-32 rounded-2xl border border-white/10 overflow-hidden bg-slate-900">
             <img src={preview} alt="Bus" className="w-full h-full object-cover opacity-60" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Identity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <Bus size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Vehicle Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Company / Bus Name</label>
                <input 
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Plate Number</label>
                <input 
                  {...register("busNumber", { required: "Plate number is required" })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Bus Category</label>
                <select 
                  {...register("busType")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all appearance-none"
                >
                  <option value="deluxe">Deluxe</option>
                  <option value="ac">AC</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Total Capacity</label>
                <div className="relative">
                  <input 
                    type="number"
                    {...register("totalSeats")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                  />
                  <Armchair className="absolute right-5 top-4 text-slate-700" size={20} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Personnel Assignment</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Assigned Driver</label>
                <input 
                  {...register("driverName", { required: "Driver name required" })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Driver Contact</label>
                <div className="relative">
                  <input 
                    {...register("phone", { required: "Contact required" })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                  />
                  <Phone className="absolute right-5 top-4 text-slate-700" size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[3rem] shadow-2xl">
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Operational Status</h3>
             
             <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("active")}
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                        field.value === "active" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      <CheckCircle2 size={18} /> Active Fleet
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("inactive")}
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                        field.value === "inactive" 
                        ? "bg-red-500/10 border-red-500 text-red-500" 
                        : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      <Loader2 size={18} /> Maintenance
                    </button>
                  </div>
                )}
             />

             <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500 text-emerald-950 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Commit Changes
                </button>
                <p className="text-[10px] text-center text-slate-500 font-medium">
                  Last updated records will be visible to passengers immediately.
                </p>
             </div>
          </div>
          
          <div className="bg-slate-900/20 border border-dashed border-white/10 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-slate-600">
             <ImageIcon size={32} />
             <p className="text-[10px] font-bold uppercase tracking-tighter">Media Assets Linked</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BusUpdatePage;