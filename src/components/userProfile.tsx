"use client";

import { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Camera, 
  ShieldCheck, Calendar, CheckCircle2 
} from "lucide-react";
import { useAuth } from "../context/auth.context";


const userProfile = () => {
  const { loggedInUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!loggedInUser) return (
    <div className="h-96 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mb-4"></div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Loading Driver Identity...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER AREA */}
      <div className="relative group">
        <div className="h-44 w-full bg-slate-800 rounded-[3rem] overflow-hidden relative border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 via-transparent to-transparent"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
        </div>
        
        <div className="px-8 -mt-16 relative flex flex-col md:flex-row items-end gap-6">
          <div className="relative">
            <div className="size-36 rounded-[2.5rem] bg-slate-900 border-8 border-slate-900 overflow-hidden shadow-2xl">
              <img 
                src={loggedInUser.image?.secureUrl || `https://ui-avatars.com/api/?name=${loggedInUser.name}&background=10b981&color=fff`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2.5 bg-emerald-500 text-emerald-950 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl">
              <Camera size={20} />
            </button>
          </div>

          <div className="flex-1 mb-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-4xl font-black text-white tracking-tighter">{loggedInUser.name}</h1>
                <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <p className="text-slate-500 font-bold text-sm tracking-tight italic">
               Senior {loggedInUser.role} • <span className="text-emerald-500/80 uppercase text-xs tracking-widest font-black">Verified</span>
            </p>
          </div>

          <div className="mb-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                isEditing 
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* INFORMATION AREA */}
      <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-xl">
        <div className="flex items-center justify-between mb-10">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                <User className="text-emerald-500" size={18} /> Driver Identity Details
            </h3>
            {isEditing && (
              <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full italic uppercase tracking-widest border border-emerald-500/20">
                Editing Mode
              </span>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <ProfileField 
            label="Legal Full Name" 
            value={loggedInUser.name} 
            icon={<User size={16} />} 
            isEditing={isEditing} 
          />
          <ProfileField 
            label="Contact Number" 
            value={loggedInUser.phone || "+977 98XXXXXXXX"} 
            icon={<Phone size={16} />} 
            isEditing={isEditing} 
            verified={true}
          />
          <ProfileField 
            label="Email Address" 
            value={loggedInUser.email} 
            icon={<Mail size={16} />} 
            isEditing={false} 
          />
          <ProfileField 
            label="Base Location" 
            value="Kathmandu, Nepal" 
            icon={<MapPin size={16} />} 
            isEditing={isEditing} 
          />
          <ProfileField 
            label="Account Status" 
            value={loggedInUser.role} 
            icon={<ShieldCheck size={16} />} 
            isEditing={false} 
          />
          <ProfileField 
            label="Registration Date" 
            value="April 2024" 
            icon={<Calendar size={16} />} 
            isEditing={false} 
          />
        </div>

        {isEditing && (
            <div className="mt-16 pt-8 border-t border-white/5 flex justify-end">
                <button className="w-full md:w-auto bg-emerald-500 text-emerald-950 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/20">
                    Save Driver Profile
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

/* Component for individual fields */
const ProfileField = ({ label, value, icon, isEditing, verified = false }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {verified && !isEditing && (
          <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
            <CheckCircle2 size={10}/> Verified
          </span>
        )}
    </div>
    
    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
        isEditing 
        ? "bg-slate-950 border-emerald-500/40 text-white ring-4 ring-emerald-500/5 shadow-inner" 
        : "bg-slate-800/30 border-white/3 text-slate-400"
    }`}>
      <div className={`${isEditing ? 'text-emerald-500' : 'text-slate-600'}`}>{icon}</div>
      {isEditing ? (
          <input 
            type="text" 
            defaultValue={value} 
            className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-800"
          />
      ) : (
          <span className="text-sm font-bold tracking-tight">{value}</span>
      )}
    </div>
  </div>
);

export default userProfile;