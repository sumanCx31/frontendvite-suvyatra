"use client";

import { useState } from "react";
import { 
  Lock, ShieldCheck, KeyRound, Eye, EyeOff, AlertTriangle, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import authSvc from "../services/Auth.service";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  
  // State matching your Postman/Backend fields
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Frontend Validation
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    if (formData.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken"); // or however you store your token

      const response:any = await authSvc.putRequest(`auth/change-password`, 
        formData, // Sending oldPassword, newPassword, confirmPassword
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );


      if (response.status === "PASSWORD_CHANGE_SUCCESS") {
        toast.success("Password updated successfully!", { description: "You will be logged out from all devices." });
        
        // Since backend logs you out from all devices, clear local storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirect to login
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
          Security <span className="text-emerald-500">Center</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-2">
          Your session will be terminated upon a successful password change.
        </p>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <ShieldCheck className="absolute -top-10 -right-10 size-40 text-emerald-500/5 rotate-12" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Old Password */}
          <PasswordField 
            label="Current Password"
            name="oldPassword"
            value={formData.oldPassword}
            placeholder="Enter current password"
            show={showPass.old}
            toggle={() => setShowPass({ ...showPass, old: !showPass.old })}
            icon={<KeyRound size={18} />}
            onChange={handleChange}
          />

          <hr className="border-white/5 my-8" />

          {/* New Password */}
          <PasswordField 
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            placeholder="Enter new strong password"
            show={showPass.new}
            toggle={() => setShowPass({ ...showPass, new: !showPass.new })}
            icon={<Lock size={18} />}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <PasswordField 
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Repeat new password"
            show={showPass.confirm}
            toggle={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
            icon={<ShieldCheck size={18} />}
            onChange={handleChange}
          />

          {/* Warning */}
          <div className="flex items-start gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
              Security Protocol: You will be automatically logged out from all devices after this change.
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-emerald-950 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Update Security Credentials"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* Internal Password Field Component */
const PasswordField = ({ label, name, value, placeholder, show, toggle, icon, onChange }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-emerald-500">
        {icon}
      </div>
      <input 
        required
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800/40 border border-white/3 focus:border-emerald-500/40 focus:bg-slate-950 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl pl-14 pr-14 py-4 text-sm text-white outline-none transition-all placeholder:text-slate-700"
      />
      <button 
        type="button"
        onClick={toggle}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default ChangePassword;