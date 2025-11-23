// src/pages/Chat/ChatLayout.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { FiMenu, FiMoreVertical } from "react-icons/fi";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IoImagesOutline, IoCheckmarkDone } from "react-icons/io5";
import {
  useGetChannelChatHistoryQuery,
  useChannelChatDetailsQuery,
  useHandleImgMSGMutation,
  useHandleDeleteMSGMutation,
} from "../../Redux/api/Chat/chatHistoryApi";
import { jwtDecode } from "jwt-decode";
import useChatSocket from "../../hooks/useChatSocket";
import { getImageUrl } from "../../config/envConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";

export default function ChatLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [handleImgMSG] = useHandleImgMSGMutation();

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [page, setPage] = useState(1); // current page
  const [limit] = useState(20); // messages per page
  const [hasMore, setHasMore] = useState(true); // whether more messages exist

  const { search } = useLocation();
  let currentChannelName = "";

  if (search.startsWith("?")) {
    currentChannelName = search.substring(1); // remove "?"
  }

  console.log(currentChannelName);

  // myId
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? jwtDecode(token) : null;

  const myId = decoded?.id;

  // Sidebar: all chats
  const {
    data: chatsData,
    isLoading: chatsLoading,
    isError: chatsError,
  } = useGetChannelChatHistoryQuery();

  // Process chats to always show the other participant
  const allChats = useMemo(() => {
    return (chatsData?.data?.all_chat || []).map((chat) => {
      const partner =
        chat.receiverId?._id === myId ? chat.senderId : chat.receiverId;
      return {
        ...chat,
        partnerId: partner?._id,
        partnerName: partner
          ? `${partner.fastname || ""} ${partner.lastname || ""}`.trim()
          : "",
        partnerAvatar: partner?.photo || null,
      };
    });
  }, [chatsData, myId]);

  console.log(allChats, "all chats");

  const [activeChannel, setActiveChannel] = useState(
    currentChannelName ? currentChannelName : null
  );
  const [activePeer, setActivePeer] = useState(null);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [activeChannel]);

  // Default to first chat
  // Default to current channel from URL or first chat
  useEffect(() => {
    if (allChats.length === 0) return;

    // Prefer URL if present
    const chatFromUrl = currentChannelName
      ? allChats.find((c) => c.channelName === currentChannelName)
      : null;

    if (chatFromUrl) {
      setActiveChannel(chatFromUrl.channelName);
      setActivePeer({
        id: chatFromUrl.partnerId,
        name: chatFromUrl.partnerName,
        avatar: chatFromUrl.partnerAvatar,
      });
    } else if (!activeChannel) {
      // Fallback: first chat
      const first = allChats[0];
      setActiveChannel(first.channelName);
      setActivePeer({
        id: first.partnerId,
        name: first.partnerName,
        avatar: first.partnerAvatar,
      });
    }
  }, [allChats, currentChannelName]);

  // Messages query
  const {
    data: chatDetailData,
    isLoading: messagesLoading,
    refetch,
  } = useChannelChatDetailsQuery(
    activeChannel ? [activeChannel, page, limit] : null, // pass page & limit
    { skip: !activeChannel }
  );

  useEffect(() => {
    if (!chatDetailData?.data?.all_chat) return;

    const sorted = sortByCreatedAtAsc(chatDetailData.data.all_chat);

    if (page === 1) {
      setMessages(sorted); // first page → replace
    } else {
      setMessages((prev) => [...sorted, ...prev]); // prepend older messages
    }

    // Check if more pages exist
    if (chatDetailData.data.all_chat.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [chatDetailData, page]);

  const [messages, setMessages] = useState([]);

  // Socket hook
  const { messages: socketMessages, sendMessage } = useChatSocket(
    activeChannel,
    myId
  );

  const listRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  // Sort ascending (oldest first)
  const sortByCreatedAtAsc = (arr) =>
    [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Load API messages → ascending
  useEffect(() => {
    if (chatDetailData?.data?.all_chat) {
      const sorted = sortByCreatedAtAsc(chatDetailData.data.all_chat);
      setMessages(sorted);
    } else if (!activeChannel) {
      setMessages([]);
    }
  }, [chatDetailData, activeChannel]);

  // Merge realtime → append
  useEffect(() => {
    if (!socketMessages || socketMessages.length === 0) return;

    socketMessages.forEach((m) => {
      // check if hidden refetch signal
      if (typeof m.message === "string") {
        try {
          const parsed = JSON.parse(m.message);
          if (parsed.type === "refetch-img") {
            // refetch images/messages for this channel
            refetch();
            return; // don't add this to messages list
          }
        } catch (err) {
          // not a JSON, normal message
          console.log(err);
        }
      }

      // normal messages → append
      setMessages((prev) => {
        const seen = new Set(prev.map((msg) => msg._id));
        if (seen.has(m._id)) return prev;
        return [...prev, m].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
    });
  }, [socketMessages, refetch]);

  // Always scroll to bottom when messages change
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  // Send
  const handleSend = async () => {
    if (!newMessage.trim() && !file) return; // either text or file must exist
    if (!activeChannel) return;

    // Optimistic local temp message
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      message: newMessage || "",
      senderId: myId,
      createdAt: new Date().toISOString(),
      files: file ? [URL.createObjectURL(file)] : [],
    };
    setMessages((prev) => [...prev, tempMessage]);

    if (file) {
      const formData = new FormData();
      formData.append("type", "message");
      formData.append("channelName", activeChannel);
      formData.append("senderId", myId);
      formData.append("message", newMessage || "");
      formData.append("files", file);

      try {
        await handleImgMSG(formData).unwrap();

        // Notify other clients
        sendMessage(JSON.stringify({ type: "refetch-img" }));
      } catch (err) {
        console.error("Image message failed", err);
      }

      setFile(null);
    } else {
      // Only text message
      sendMessage(newMessage);
    }

    setNewMessage("");
  };

const [handleDeleteMSG] = useHandleDeleteMSGMutation();

const handleDeleteMessage = async (messageId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this message?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await handleDeleteMSG(messageId).unwrap();
      Swal.fire("Deleted!", "Your message has been deleted.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete message.", "error");
      console.log(err);
    }
  }
};


const navigate = useNavigate();
const handleReportUser = (userId, userName, userEmail,activePeer) => {
  Swal.fire({
    title: `Report ${userName  || "this user"}?`,
    text: "Do you want to report this user for inappropriate behavior?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, report",
  }).then((result) => {
    if (result.isConfirmed) {
      // Here you would typically call an API to report the user
      console.log(userId, userName, userEmail,activePeer, "reported");
      navigate(`/contact-us?reportedUserId=${userId}&reportedUserName=${userName}&reporterEmail=${userEmail}`);
      Swal.fire("Reported!", "The user has been reported.", "success");
    }
  });
}

  // Header peer info
  const headerPeer = useMemo(() => {
    // Prefer activePeer (from sidebar click)
    if (activePeer) return activePeer;

    // Fallback: find in allChats by activeChannel
    const found = allChats.find((c) => c.channelName === activeChannel);
    if (!found) return null;

    return {
      id: found.partnerId,
      name: found.partnerName,
      avatar: found.partnerAvatar,
    };
  }, [activePeer, allChats, activeChannel]);

  return (
    <div className="flex flex-col h-screen bg-white pt-20">
      {/* Top Bar */}
      <div className="p-5 border-b border-gray-200 flex md:flex-row flex-row-reverse items-center justify-between   md:justify-start ">
        <button
          className="md:hidden mr-3 text-gray-600"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Open conversations"
        >
          {showSidebar ? (
            <ImCross className="text-2xl text-gray-400" />
          ) : (
            <FiMenu className="text-2xl" />
          )}
        </button>
        <h1 className="text-[#3c3d37] text-3xl font-bold">Messages</h1>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={`absolute md:relative md:top-0 left-0 w-80 md:w-96 bg-white flex flex-col border-r border-gray-200 transition-transform duration-300 z-20
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4  justify-between hidden">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowSidebar(false)}
              aria-label="Close"
            >
              ✖
            </button>
          </div>

          {chatsLoading ? (
            <p className="p-4">Loading chats...</p>
          ) : chatsError ? (
            <p className="p-4 text-red-500">Failed to load chats.</p>
          ) : (
            <div className="overflow-y-auto flex-1">
              {allChats.map((chat) => {
                const isActive = chat.channelName === activeChannel;

                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setActiveChannel(chat.channelName);
                      setActivePeer({
                        id: chat.partnerId,
                        name: chat.partnerName,
                        avatar: chat.partnerAvatar,
                      });
                      if (window.innerWidth < 768) setShowSidebar(false);
                    }}
                    className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors
        ${isActive ? "bg-yellow-50 border-r-4 border-yellow-400" : ""}`}
                  >
                    <div className="relative">
                      {chat.partnerAvatar ? (
                        <img
                          src={getImageUrl(chat.partnerAvatar)}
                          alt={chat.partnerName || "user"}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                          {(chat.partnerName?.[0] || "?").toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {chat.partnerName}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          {activeChannel && (
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {headerPeer?.avatar ? (
                    <img
                      src={getImageUrl(headerPeer.avatar)}
                      alt={headerPeer?.name || "user"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                      {(headerPeer?.name?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {headerPeer?.name || activeChannel}
                  </h2>
                </div>
              </div>

              <FiMoreVertical
              onClick={() => 
                handleReportUser(activePeer?.id, headerPeer?.name, decoded?.email,)
              }
              className="w-5 h-5 text-gray-500" />
            </div>
          )}

          {hasMore && (
            <div className="text-center mb-2 bg-transparent">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-green-600 text-gray-50 rounded  text-sm"
              >
                {messagesLoading ? <>Loading...</> : <>Load More</>}
              </button>
            </div>
          )}

          {/* Messages ASC by time */}
          <div
            ref={listRef}
            className="flex-1 overflow-auto bg-gray-50 p-4 space-y-4"
          >
            {activeChannel ? (
              messagesLoading ? (
                <p>Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-500">No messages yet.</p>
              ) : (
                messages
                  .filter((msg) => {
                    // skip messages that are JSON with type "refetch-img"
                    if (typeof msg.message === "string") {
                      try {
                        const parsed = JSON.parse(msg.message);
                        if (parsed.type === "refetch-img") return false; // hide this
                      } catch (err) {
                        // not JSON → normal message
                        console.log(err);
                      }
                    }
                    return true; // keep normal messages
                  })
                  .map((msg) => {
                    const sid = msg?.senderId?._id || msg?.senderId;
                    const isMine = sid === myId;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl p-4 ${
                            isMine
                              ? "bg-[#00823b] text-white"
                              : "bg-white text-gray-900 shadow-sm border border-gray-200"
                          }`}
                        >
                          {msg.files && msg.files.length > 0 && (
                            <div className="mt-3 grid gap-2">
                              {msg.files.map((f, idx) => (
                                <img
                                  key={idx}
                                  src={
                                    f.startsWith("blob:") ? f : getImageUrl(f)
                                  }
                                  alt="attachment"
                                  className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-md object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                                  onClick={() =>
                                    window.open(
                                      f.startsWith("blob:")
                                        ? f
                                        : getImageUrl(f),
                                      "_blank"
                                    )
                                  }
                                />
                              ))}
                            </div>
                          )}

                          <p className="text-sm break-words">{msg.message}</p>

                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">
                              {formatTime(msg.createdAt)}
                            </p>
                            {isMine && (
                              <div className="flex items-center gap-1">
                                <IoCheckmarkDone className="" />
                                <AiOutlineDelete
                                onClick={() =>{
                                  handleDeleteMessage(msg._id);
                                }}
                                className="cursor-pointer hover:text-red-300" /> 
                              </div>
                            )}
                            
                          </div>
                        </div>
                      </div>
                    );
                  })
              )
            ) : (
              <p className="text-gray-500 p-2">
                Select a conversation to start chatting.
              </p>
            )}
          </div>

          {file && (
            <div className="p-2 flex items-start gap-2 bg-gray-50 border-b border-gray-200">
              <div className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          {activeChannel && (
            <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  className={`p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 ${
                    file && "bg-green-100 text-green-500"
                  }`}
                  title="Attach file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoImagesOutline className="w-5 h-5 " />
                </button>
              </>

              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <button
                onClick={handleSend}
                disabled={!newMessage.trim() && !file}
                className={`p-3 rounded-full ${
                  newMessage.trim() || file
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <RiSendPlane2Fill className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
