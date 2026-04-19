"use client";

import { useEffect, useState } from "react";
import { Table, ConfigProvider, theme, Tag, Button, Input } from "antd";
import { Eye, Phone, Search, Users as UsersIcon } from "lucide-react";
import authSvc from "../../services/Auth.service";
import { useNavigate } from "react-router";

const UserRegistry = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>({ users: [], stats: {} });
  const [loading, setLoading] = useState(true);
  
  // ✅ State for Search query
  const [searchQuery, setSearchQuery] = useState("");

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

  // ✅ Logic to filter data based on Search Query (Email or Phone)
  const filteredUsers = data.users.filter((user: any) => {
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) || 
      user.phone?.includes(query) ||
      user.name?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      title: "Photo",
      dataIndex: "image",
      key: "image",
      width: 80,
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
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
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
      title: "Contact Information",
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      // ✅ Added Filter by Role
      filters: [
        { text: 'Drivers', value: 'driver' },
        { text: 'Passengers', value: 'passenger' },
      ],
      onFilter: (value: any, record: any) => record.role === value,
      render: (role: string) => (
        <Tag
          color={role === "driver" ? "green" : "blue"}
          className="font-black uppercase text-[10px] rounded-md px-3 border-none shadow-sm"
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<Eye size={16} />}
          onClick={() => navigate(`/admin/users/${record._id}`)} 
          className="hover:bg-blue-500/10 flex items-center gap-2 text-blue-400 font-bold text-xs"
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              User <span className="text-emerald-500">Registry</span>
           </h1>
           <p className="text-xs text-slate-500 font-medium">Manage and monitor all system participants</p>
        </div>
        
        {/* 🔍 Search Input */}
        <div className="w-full max-w-sm">
           <Input 
             placeholder="Search by Email, Phone or Name..." 
             prefix={<Search size={16} className="text-slate-500 mr-2" />}
             className="bg-slate-900 border-white/10 text-white h-11 rounded-xl focus:border-emerald-500 hover:border-emerald-500/50 transition-all"
             onChange={(e) => setSearchQuery(e.target.value)}
             allowClear
           />
        </div>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickStat icon={<UsersIcon size={14}/>} label="Drivers" value={data.stats.driver} color="emerald" />
        <QuickStat icon={<UsersIcon size={14}/>} label="Passengers" value={data.stats.passenger} color="blue" />
        <QuickStat icon={<UsersIcon size={14}/>} label="Total Registry" value={data.stats.total} color="slate" />
      </div>

      {/* 🔹 Table */}
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
          <Table
            columns={columns}
            dataSource={filteredUsers} // ✅ Use filtered data here
            loading={loading}
            pagination={{ 
              pageSize: 7, 
              showSizeChanger: false,
              className: "pr-6"
            }}
          />
        </div>
      </ConfigProvider>
    </div>
  );
};

// 🔹 Stat Component
const QuickStat = ({ label, value, color, icon }: any) => (
  <div className="bg-slate-900 border border-white/5 p-5 rounded-[1.5rem] flex justify-between items-center group hover:border-emerald-500/30 transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
        {icon} {label}
      </p>
      <p className={`text-3xl font-black text-${color === 'slate' ? 'white' : color + '-500'} italic tracking-tighter`}>
        {value || 0}
      </p>
    </div>
    <div className={`size-10 rounded-full bg-${color === 'slate' ? 'white' : color + '-500'}/5 flex items-center justify-center text-slate-700`}>
        <div className={`size-2 rounded-full bg-${color === 'slate' ? 'white' : color + '-500'} animate-pulse`} />
    </div>
  </div>
);

export default UserRegistry;