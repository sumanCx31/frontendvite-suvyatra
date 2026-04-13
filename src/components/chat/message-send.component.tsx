import React, { useState } from "react";
import { Input, Button } from "antd";
import { Send } from "lucide-react";
import { useSelector } from "react-redux"; // ✅ Added to get loggedInUser
import chatSvc from "../../services/chat.service";
import socket from "../../config/socket.config";
import { type RootState } from "../../../store";

interface MessageSendProps {
  receiver: any;
  getChatDetail: (userId: string) => void;
  onMessageSent: (newMsg: any) => void;
}

const MessageSend = ({ receiver, getChatDetail, onMessageSent }: MessageSendProps) => {
  const [message, setMessage] = useState<string>("");
  // ✅ Get the logged-in user from Redux
  const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);

  const submitMessage = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const currentMessage = message;
    setMessage("");

    try {
      const response = await chatSvc.postRequest("/chat/message", {
        message: currentMessage,
        receiver: receiver._id, 
      });

      // ✅ FIX: Manually build the full object so ChatDetail doesn't crash
      // Your API likely returns { _id, message, sender: "ID_STRING" }
      // We turn it into { _id, message, sender: { _id, name, image } }
      const optimisticMsg = {
        ...response.data,
        sender: loggedInUser, // Use the full object from Redux
      };

      socket.emit("sendMessage", optimisticMsg); 
      onMessageSent(optimisticMsg);

    } catch (err) {
      console.error("Message send error:", err);
      setMessage(currentMessage);
    }
  };

  return (
    <div className="flex gap-2 items-end bg-white p-1">
      <Input.TextArea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        className="rounded-xl border-slate-200 focus:border-emerald-500 transition-all resize-none"
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            submitMessage();
          }
        }}
      />
      <Button 
        type="primary" 
        onClick={() => submitMessage()} 
        icon={<Send size={18} />} 
        className="h-[54px] bg-emerald-500 hover:bg-emerald-600 border-none rounded-xl"
      >
        Send
      </Button>
    </div>
  );
};

export default MessageSend;