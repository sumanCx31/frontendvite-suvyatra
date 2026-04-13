"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Popconfirm, ConfigProvider, theme } from "antd";
import { Plus, Edit, Trash, Image as ImageIcon, ExternalLink } from "lucide-react";
import bannerSvc from "../../services/banner.service";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const BannerPage: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response: any = await bannerSvc.getRequest("/banners");
      setBanners(response.data || []);
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await bannerSvc.deleteRequest(`/banners/${id}`);
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch {
      toast.error("Delete operation failed");
    }
  };

  const columns = [
    {
      title: "IMAGE",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (image: any) =>
        image?.optimizedUrl ? (
          <div className="relative group overflow-hidden rounded-lg border border-white/10 w-28 h-16">
            <img
              src={image.optimizedUrl}
              alt="banner"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="w-28 h-16 bg-slate-800 flex items-center justify-center rounded-lg border border-dashed border-slate-700">
            <ImageIcon size={20} className="text-slate-600" />
          </div>
        ),
    },
    {
      title: "BANNER DETAILS",
      key: "details",
      render: (_: any, record: any) => (
        <div className="flex flex-col gap-1">
          <span className="text-white font-bold tracking-tight">{record.title}</span>
          <span className="text-slate-500 text-xs line-clamp-1">{record.description || "No description provided."}</span>
        </div>
      ),
    },
    {
      title: "LINK",
      dataIndex: "link",
      key: "link",
      render: (link: string) =>
        link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noreferrer" 
            className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 text-xs font-medium"
          >
            <ExternalLink size={12} /> View Link
          </a>
        ) : (
          <span className="text-slate-600 text-xs italic">Internal Only</span>
        ),
    },
    {
      title: "STATUS",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (status: string) => (
        <Tag 
          className="border-none px-3 py-0.5 rounded-full font-bold text-[10px]"
          color={status === "active" ? "#10b98120" : "#ef444420"}
          style={{ color: status === "active" ? "#10b981" : "#ef4444" }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 200,
      render: (_: any, record: any) => (
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/banners/update/${record._id}`)}
            className="p-2 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 rounded-xl transition-all border border-white/5"
          >
            <Edit size={18} />
          </button>
          <Popconfirm
            title="Delete Banner?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, className: "bg-red-500" }}
          >
            <button className="p-2 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-white/5">
              <Trash size={18} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    // ConfigProvider forces Ant Design components into Dark Mode
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#10b981", // Emerald 500
          colorBgContainer: "#0f172a", // Slate 900
          borderRadius: 12,
        },
      }}
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-white/5 p-6 rounded-[2rem] shadow-2xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase italic">
              Banner <span className="text-emerald-500">Management</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Manage promotional sliders and advertisements for SuvYatra
            </p>
          </div>
          <button
            onClick={() => navigate("add-banner")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-sm uppercase"
          >
            <Plus size={20} strokeWidth={3} /> Add New Banner
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={banners}
            loading={loading}
            pagination={{
              pageSize: 6,
              className: "px-6 py-4",
            }}
            className="suvyatra-table"
            // Custom CSS logic via standard AntD styles (passed through ConfigProvider)
            scroll={{ x: 800 }}
          />
        </div>

        {/* Total Banners Count Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full w-fit">
          <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {banners.length} Total Banners Live
          </span>
        </div>
      </div>

      <style>{`
        .suvyatra-table .ant-table {
          background: transparent !important;
        }
        .suvyatra-table .ant-table-thead > tr > th {
          background: #1e293b50 !important;
          color: #64748b !important;
          font-weight: 800 !important;
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        .suvyatra-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 16px 24px !important;
        }
        .suvyatra-table .ant-table-tbody > tr:hover > td {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default BannerPage;