"use client";

import { useEffect, useState } from "react";
import { Table, ConfigProvider, theme, Tag, Button } from "antd";
import { Eye, Phone } from "lucide-react";
import authSvc from "../../services/Auth.service";
import { useNavigate } from "react-router";

const UserRegistry = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>({ users: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await authSvc.getRequest("/auth/user");

        const usersWithKeys = response.data.Users.map((u: any) => ({
          ...u,
          key: u._id,
        }));

        setData({
          users: usersWithKeys,
          stats: {
            driver: response.data.Driver,
            passenger: response.data.passenger,
            total: response.data.TotalUsers,
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const columns = [
    {
      title: "Photo",
      dataIndex: "image",
      key: "image",
      render: (text: any, record: any) => (
        <div className="flex items-center justify-center">
          {text?.secureUrl ? (
            <img
              src={text.secureUrl}
              alt="user"
              className="h-10 w-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-700 text-white font-bold">
              {record.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-white">{text}</span>
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
            {record.gender || "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string, record: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Phone size={12} className="text-emerald-500" /> {phone}
          </div>
          <div className="text-[10px] text-slate-500 lowercase italic">
            {record.email}
          </div>
        </div>
      ),
    },
     {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<Eye size={16} className="text-blue-400" />}
          // ✅ Changed from router.push to navigate()
          onClick={() => navigate(`/admin/users/${record._id}`)} 
          className="hover:bg-blue-500/10 flex items-center gap-2 text-blue-400 font-bold text-xs"
        >
          Details
        </Button>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          color={role === "driver" ? "green" : "blue"}
          className="font-black uppercase text-[10px] rounded-md px-3"
        >
          {role}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6 h-screen">
      {/* 🔹 Stats */}
      <div className="grid grid-cols-3 gap-4">
        <QuickStat label="Drivers" value={data.stats.driver} color="emerald" />
        <QuickStat label="Passengers" value={data.stats.passenger} color="yellow" />
        <QuickStat label="Total Registry" value={data.stats.total} color="blue" />
      </div>

      {/* 🔹 Table */}
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Table
          columns={columns}
          dataSource={data.users}
          loading={loading}
          className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl"
          pagination={{ pageSize: 5 }}
        />
      </ConfigProvider>
    </div>
  );
};

// 🔹 Stat Component
const QuickStat = ({ label, value, color }: any) => (
  <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
      {label}
    </p>
    <p className={`text-2xl font-black text-${color}-500 italic`}>
      {value || 0}
    </p>
  </div>
);

export default UserRegistry;