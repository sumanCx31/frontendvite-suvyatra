"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import authSvc from "../../services/Auth.service";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Banknote,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Bus } from "lucide-react";

const CreateTripPage = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bus: busId ?? "",
    from: "",
    to: "",
    price: "",
    status: "scheduled",
    departureTime: "",
    arrivalTime: "",
    date: "",
  });

  // 🔹 Handle input change (generic)
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit form
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        price: Number(formData.price), // convert to number
      };

      await authSvc.postRequest("/trip-update", payload);

      toast.success("Trip is Live!", {
        icon: <Bus size={20} className="text-emerald-500" />,
        style: {
          background: "#0f172a",
          color: "#fff",
          borderRadius: "1rem",
          borderLeft: "4px solid #10b981",
        },
      });

      navigate(`/driver/trip-update/${busId}`);
    } catch (error) {
      console.error("Trip creation failed:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // JSX continues...

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 hover:text-emerald-500 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Create New <span className="text-emerald-500">Manifest</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
          {/* Route Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Origin (From)
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  size={18}
                />
                <input
                  required
                  name="from"
                  placeholder="e.g. Lahan"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Destination (To)
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
                  size={18}
                />
                <input
                  required
                  name="to"
                  placeholder="e.g. Siraha"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Time & Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Date
              </label>
              <div className="relative">
                <CalendarIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  size={18}
                />
                <input
                  required
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Departure Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  size={18}
                />
                <input
                  required
                  type="text"
                  name="departureTime"
                  placeholder="07:00 AM"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Arrival Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  required
                  type="text"
                  name="arrivalTime"
                  placeholder="03:00 PM"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Price & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Ticket Price (NPR)
              </label>
              <div className="relative">
                <Banknote
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                  size={18}
                />
                <input
                  required
                  type="number"
                  name="price"
                  placeholder="3700"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Trip Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold appearance-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="boarding">Boarding</option>
                <option value="en-route">En-Route</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <CheckCircle2 size={20} />
                Confirm & Publish Trip
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTripPage;
