"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button, Card, Skeleton, Tag, Divider, message } from "antd";
import { 
  ArrowLeft, Mail, Phone, User, MapPin, 
  ShieldCheck, Calendar, Clock, Copy, Check 
} from "lucide-react";
import dayjs from "dayjs";
import authSvc from "../../services/Auth.service";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authSvc.getRequest(`/auth/user-detail/${id}`);
        const userData = response.data[0];
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserDetails();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    message.success("ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-10 bg-slate-950 min-h-screen"><Skeleton active avatar /></div>;
  if (!user || !user._id) return <div className="p-10 text-white">User not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-200">
      {/* 🔹 Header Area */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Button 
          type="text" 
          icon={<ArrowLeft size={18} />} 
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white flex items-center gap-2"
        >
          Back to Registry
        </Button>
        <div className="flex gap-2">
          <Tag color="blue" className="px-3 border-none bg-blue-500/20 text-blue-400 font-bold uppercase">
            {user.status || "active"}
          </Tag>
          <Tag color="gold" className="px-3 border-none bg-amber-500/20 text-amber-400 font-bold uppercase">
            {user.role}
          </Tag>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 🔹 Left Panel: Identity (Fixed to Slate 900) */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-900 border-white/10 shadow-2xl rounded-3xl overflow-hidden">
            <div className="flex flex-col items-center p-6">
              <div className="relative">
                {/* Profile Image made Circular */}
                <img 
                  src={user.image?.optimizedUrl || user.image?.secureUrl || "https://via.placeholder.com/150"} 
                  alt={user.name} 
                  className="h-44 w-44 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
                />
              </div>
              
              <h2 className="text-2xl font-black text-white mt-6 tracking-tight">{user.name}</h2>
              <p className="text-slate-800 font-medium text-sm mt-1">{user.email}</p>
              
              <Divider className="border-white/5 my-6" />

         
              <div className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-700 uppercase font-black mb-2 tracking-widest flex justify-between items-center">
                  Full User ID
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </p>
                <div 
                  className="flex items-center justify-between gap-2 cursor-pointer group"
                  onClick={() => copyToClipboard(user._id)}
                >
                  <code className="text-[11px] text-slate-800 font-semibold break-all leading-relaxed group-hover:text-blue-400 transition-colors">
                    {user._id}
                  </code>
                </div>
              </div>

              <div className="w-full mt-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-2xl text-center border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Gender</p>
                  <p className="text-white font-bold capitalize">{user.gender || "N/A"}</p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl text-center border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Status</p>
                  <p className="text-emerald-400 font-bold capitalize">{user.status || "Active"}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 🔹 Right Panel: Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl shadow-xl h-full">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
              <User size={20} className="text-blue-500" /> Profile Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <InfoRow icon={<Mail size={20} />} label="Email Address" value={user.email} />
              <InfoRow icon={<Phone size={20} />} label="Contact Number" value={user.phone} />
              <InfoRow icon={<MapPin size={20} />} label="Residential Address" value={user.address || "ktm"} />
              <InfoRow icon={<ShieldCheck size={20} />} label="Account Role" value={user.role} isTag />
              
              <div className="md:col-span-2"><Divider className="border-white/5 my-2" /></div>

              <InfoRow 
                icon={<Calendar size={20} />} 
                label="Registered On" 
                value={user.createdAt ? dayjs(user.createdAt).format("MMMM D, YYYY") : "N/A"} 
                subValue={user.createdAt ? dayjs(user.createdAt).format("h:mm A") : ""}
              />
              <InfoRow 
                icon={<Clock size={20} />} 
                label="Last Profile Update" 
                value={user.updatedAt ? dayjs(user.updatedAt).format("MMMM D, YYYY") : "N/A"} 
                subValue={user.updatedAt ? dayjs(user.updatedAt).format("h:mm A") : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Sub-Component: Details Row
const InfoRow = ({ icon, label, value, subValue, isTag }: any) => (
  <div className="flex gap-4">
    <div className="mt-1 text-slate-500">{icon}</div>
    <div>
      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest leading-none mb-1.5">{label}</p>
      {isTag ? (
        <Tag className="m-0 bg-blue-500/10 border-blue-500/20 text-blue-400 font-bold uppercase text-[10px] px-3">
          {value || "Unknown"}
        </Tag>
      ) : (
        <p className="text-white font-semibold">{value || "N/A"}</p>
      )}
      {subValue && <p className="text-[10px] text-slate-500 mt-1 font-medium">{subValue}</p>}
    </div>
  </div>
);

export default UserDetail;