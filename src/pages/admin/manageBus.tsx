"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";
import authSvc from "../../services/Auth.service";
import { SearchInput } from "../../components/formInput/formInput";
import { message } from "antd";

const ManageBus: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await authSvc.getRequest("/bus");
      setBuses(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to decommission this bus from the fleet?")) {
      try {
        await authSvc.deleteRequest(`/bus/${id}`);
        message.success("Bus removed successfully");
        setBuses((prev) => prev.filter((bus) => bus._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
        message.error("Failed to delete bus");
      }
    }
  };

  const filteredBuses = useMemo(() => {
    return buses.filter(
      (bus) =>
        bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.driverName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [buses, searchQuery]);

  if (loading)
    return (
      <div className="text-slate-500 text-center p-20 bg-slate-950 min-h-screen">
        Synchronizing Fleet...
      </div>
    );

  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Bus Management
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor and maintain your bus fleet.
          </p>
        </div>
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
          onClick={() => navigate("add-bus")}
        >
          <Plus size={18} /> Add New Bus
        </button>
      </div>

      <div className="relative">
        <SearchInput
          placeholder="Search by name, plate number, or driver..."
          onChange={(val) => setSearchQuery(val)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <div
            key={bus._id}
            className="bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-emerald-500/30 transition-all shadow-xl"
          >
            {bus.image?.secureUrl && (
              <img
                src={bus.image.secureUrl}
                alt={bus.name}
                className="w-full h-40 object-cover rounded-2xl mb-4 shadow-inner"
              />
            )}

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white leading-tight">{bus.name}</h2>
              <span
                className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                  bus.isActive === "active"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500"
                }`}
              >
                {bus.isActive}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <DetailItem label="Plate" value={bus.busNumber} />
              <DetailItem label="Type" value={bus.busType} />
              <DetailItem label="Driver" value={bus.driverName} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                  onClick={() => navigate(`/admin/manage-buses/view-routes/${bus._id}`)}
                >
                  <Eye size={14} /> Routes
                </button>
                
                {/* 🔹 Updated Edit Button with Redirect */}
                <button 
                  className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                  onClick={() => navigate(`/admin/manage-buses/edit-bus/${bus._id}`)}
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>
              
              <button 
                onClick={() => handleDelete(bus._id)}
                className="w-full bg-rose-500/5 hover:bg-rose-500/15 text-rose-500/70 hover:text-rose-500 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all mt-1"
              >
                <Trash2 size={14} /> Delete Bus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500 uppercase text-[10px] font-black tracking-widest">
      {label}
    </span>
    <span className="text-slate-300 font-medium">{value}</span>
  </div>
);

export default ManageBus;