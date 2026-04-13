import React from "react";
import { Avatar } from "antd";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";

const ChatDetail = ({ chatDetail }: { chatDetail: any[] }) => {
  const activeUser = useSelector((root: RootState) => root?.user?.currentUser);

  if (!activeUser) return null;

  return (
    <div className="flex flex-col space-y-4 p-2">
      {chatDetail && chatDetail.length > 0 ? (
        chatDetail.map((chat: any, index: number) => {
          // ✅ FIX: Defensive check for chat.sender.
          // If sender is just a string ID, we compare it directly.
          // If it's an object, we use ._id
          const senderId =
            typeof chat.sender === "string" ? chat.sender : chat.sender?._id;
          const isSentByMe = senderId !== activeUser._id;

          return (
            <div
              key={chat._id || index}
              className={`flex items-end gap-2 ${isSentByMe ? "justify-end" : "justify-start"}`}
            >
              {!isSentByMe && (
                <Avatar
                  src={
                    activeUser.image?.optimized_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${activeUser.name}`
                  }
                />
              )}

              <div
                className={`p-3 rounded-2xl max-w-[70%] shadow-sm ${isSentByMe ? "bg-teal-600 text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"}`}
              >
                <p className="text-sm">
                  {chat.message || chat.text || chat.content || "Empty Message"}
                </p>
              </div>

              {isSentByMe && (
                <Avatar
                  // ✅ FIX: Optional chaining to prevent "undefined" crash
                  src={
                    chat.sender?.image?.optimized_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${chat.sender?.name || "Me"}`
                  }
                />
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 mt-10">
          No messages yet. Say hello!
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
