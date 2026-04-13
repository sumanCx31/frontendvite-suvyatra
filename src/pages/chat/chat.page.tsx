import { Content } from "antd/es/layout/layout";
import { useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { useEffect, useState, useRef } from "react";
import chatSvc from "../../services/chat.service";
import UserList from "../../components/chat/user-list.component";
import MessageSend from "../../components/chat/message-send.component";
import ChatDetail from "../../components/chat/chat-detail.component";
import socket from "../../config/socket.config";

const ChatPage = () => {
  const [chatDetail, setChatDetail] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get data from Redux
  const activeUser = useSelector((root: RootState) => root?.user?.currentUser);
 const loggedInUser = useSelector((root: RootState) => root?.user?.loggedInUser); // ✅ Looking in 'user' slice

  // ✅ Use a ref to track activeUser inside the socket listener to avoid stale closures
  const activeUserRef = useRef(activeUser);
  useEffect(() => {
    activeUserRef.current = activeUser;
  }, [activeUser]);

  // Fetch full history when clicking a user
  const getChatDetail = async (senderId: string) => {
  try {
    const response = await chatSvc.getRequest("/chat/" + senderId);
    console.log("RAW API RESPONSE:", response); // 👈 LOOK AT THIS IN CONSOLE
    
    // If your API returns { status: true, data: [...] }, use response.data
    // If your API returns just the array, use response
    const messages = response.data || response.data || response; 
    
    setChatDetail(Array.isArray(messages) ? messages : []);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};

  // ✅ Auto-scroll to bottom whenever chatDetail updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatDetail]);

  // ✅ Socket Logic: LISTEN for incoming messages
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleIncoming = (newMessage: any) => {
      const currentChatPartner = activeUserRef.current;
      
      // Check if the incoming message belongs to the currently open chat window
      const isFromActiveUser = newMessage.sender === currentChatPartner?._id;
      const isToActiveUser = newMessage.receiver === currentChatPartner?._id;

      if (currentChatPartner && (isFromActiveUser || isToActiveUser)) {
        // ✅ OPTIMIZATION: Instead of calling the API again, just append the new message
        setChatDetail((prev) => {
          // Prevent duplicate messages if the backend sends an "echo"
          const exists = prev.find(m => m._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });
      }
    };

    socket.on("messageReceived", handleIncoming);

    return () => {
      socket.off("messageReceived", handleIncoming);
    };
  }, []); // Run once on mount

  return (
    <Content className="h-[calc(100vh-120px)] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
      {/* Sidebar: User List */}
      <div className="w-full lg:w-[350px] border-r border-gray-100 overflow-y-auto bg-slate-50/50">
        <UserList getChatDetail={getChatDetail} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
        {activeUser ? (
          <>
            {/* Header: User Info */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center">
              <span className="font-bold text-slate-700">Chatting with: {activeUser.name}</span>
            </div>

            {/* Message History */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              <ChatDetail chatDetail={chatDetail} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <MessageSend 
                receiver={activeUser} 
                // Passing a callback to append your own message locally for instant feedback
                onMessageSent={(newMsg: any) => setChatDetail(prev => [...prev, newMsg])}
                getChatDetail={getChatDetail} 
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 animate-pulse" />
            <p>Select a customer or driver to start chatting</p>
          </div>
        )}
      </div>
    </Content>
  );
};

export default ChatPage;