"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Plus, Eye, Edit2 } from "lucide-react";
import authSvc from "../../services/Auth.service";
import { SearchInput } from "../../components/formInput/formInput";

const ManageBus: React.FC = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await authSvc.getRequest("/bus");
        setBuses(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  // Professional Memoized Filter: Only runs when 'buses' or 'searchQuery' changes
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
      <div className="text-slate-500 text-center p-20">
        Synchronizing Fleet...
      </div>
    );

  return (
    <div className="p-8 space-y-8">
      {/* Header with Search & Add */}
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

      {/* Search Input */}
      <div className="relative">
        <SearchInput
          placeholder="Search by name, plate number, or driver..."
          onChange={(val) => setSearchQuery(val)}
        />
      </div>

      {/* Bus Grid */}
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
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />
            )}

            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">{bus.name}</h2>
              <span
                className={`px-2 py-1 rounded text-[10px] font-black uppercase ${bus.isActive === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
              >
                {bus.isActive}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <DetailItem label="Plate" value={bus.busNumber} />
              <DetailItem label="Type" value={bus.busType} />
              <DetailItem label="Driver" value={bus.driverName} />
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold"
                onClick={() =>
                  navigate(`/admin/manage-buses/view-routes/${bus._id}`)
                }
              >
                <Eye size={14} /> View Routes
              </button>
              <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                <Edit2 size={14} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500 uppercase text-[10px] font-black tracking-widest">
      {label}
    </span>
    <span className="text-slate-300 font-medium">{value}</span>
  </div>
);

export default ManageBus;
