"use client";

import { List, Avatar, Button, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { useState, useEffect, useCallback } from "react";
import { assignCurrentUser, getAllUsers } from "../../reducer/user.reducer";

const UserList = ({ getChatDetail }: { getChatDetail: (id: string) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get data from Redux
  const userState = useSelector((root: RootState) => root.user);
  const activeUser = userState.currentUser;
  const { allUsers, pagination, loading } = userState;

  const [currentPage, setCurrentPage] = useState(1);

  // Initial Fetch
  useEffect(() => {
    dispatch(
      getAllUsers({
        role: "",
        search: "",
        page: 1,
        limit: 20,
      })
    );
  }, [dispatch]);

  // ✅ Fix: Use useCallback for the handler to prevent unnecessary re-renders
  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(
      getAllUsers({
        role: "",
        search: "",
        page: nextPage,
        limit: 20,
      })
    );
  }, [currentPage, dispatch]);

  // ✅ Simplified Load More logic
  const loadMoreButton = 
    !loading && pagination && pagination.totalPages > currentPage ? (
      <div className="flex justify-center mt-4 h-8">
        <Button 
          onClick={handleLoadMore}
          className="border-emerald-500 text-emerald-600 hover:text-emerald-700 hover:border-emerald-700"
        >
          Load more
        </Button>
      </div>
    ) : null;

  return (
    <div className="user-list-container h-full overflow-y-auto">
      {allUsers && allUsers.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={allUsers}
          // Only show full loading state on the first page load
          loading={loading && currentPage === 1} 
          loadMore={loadMoreButton}
          renderItem={(item: any) => (
            <List.Item
              // ✅ Corrected Tailwind spacing: used 'mx-3' instead of 'mx-3!' for standard classes
              className={`px-4 cursor-pointer transition-all my-2 mx-2 rounded-xl border border-transparent hover:shadow-md ${
                activeUser?._id === item._id 
                  ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                  : "bg-white hover:bg-slate-50 border-slate-100"
              }`}
              onClick={() => {
                dispatch(assignCurrentUser(item));
                getChatDetail(item._id);
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={45}
                    className="bg-slate-200"
                    src={
                      item.image?.optimized_url || 
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name)}`
                    }
                  />
                }
                title={<span className="font-bold text-slate-800">{item.name}</span>}
                description={
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 truncate">{item.email}</span>
                    {item.role && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">
                        {item.role}
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
          {loading ? <Spin size="large" /> : <p>No users found</p>}
        </div>
      )}
      
      {/* Show small spinner at bottom when loading more pages */}
      {loading && currentPage > 1 && (
        <div className="flex justify-center p-4">
          <Spin size="small" />
        </div>
      )}
    </div>
  );
};

export default UserList;