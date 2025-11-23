import React, { useState, useRef, useEffect, useMemo } from "react";
import AdminProfile from "../components/AdminProfile";
import { useSelector } from "react-redux";
import { useGetAllChannelsForAdminQuery } from "../../../redux/api/chat/getAllChannelsForAdminApi";
import {
  useGetMessagesByChannelNameQuery,
  useSendMessageWithImageMutation,
} from "../../../redux/api/chat/getAllMSGApi";
import useChatSocket from "../../../hooks/useChatSocket";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

// Import components
import ChannelSidebar from "./allMSGComponents/ChannelSidebar";
import ChatHeader from "./allMSGComponents/ChatHeader";
import MessageList from "./allMSGComponents/MessageList";
import MessageInput from "./allMSGComponents/MessageInput";
import TopBar from "./allMSGComponents/TopBar";

const AllMessage = () => {
  const { channelName: routeChannelName } = useParams();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // kept for compatibility with child props
  const [limit, setLimit] = useState(20);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingImageUrl, setUploadingImageUrl] = useState(null);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const fileInputRef = useRef(null);
  const listRef = useRef(null);
  // Search term for filtering channels
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input to limit API calls
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Get admin user data from Redux
  const { userId: currentAdminId, user } = useSelector((state) => state.auth);

  const {
    data: channelsData,
    isLoading: channelsLoading,
    error: channelsError,
  } = useGetAllChannelsForAdminQuery({ searchTerm: debouncedSearchTerm });
  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch,
  } = useGetMessagesByChannelNameQuery(
    { channelName: selectedChannel?.channelName, page: 1, limit },
    { skip: !selectedChannel }
  );
  const [sendMessageWithImage] = useSendMessageWithImageMutation();

  // Ensure channels is always an array per API shape: { data: { meta, data: [] } }
  const channels = channelsData?.data?.data || [];
  const apiMessages = messagesData?.data?.data?.[0]?.messages || [];

  // Auto-select channel based on route param when channels are loaded
  useEffect(() => {
    if (!routeChannelName || !channels?.length) return;
    const found = channels.find((c) => c?.channelName === routeChannelName);
    if (found && selectedChannel?.channelName !== found.channelName) {
      setSelectedChannel(found);
    }
  }, [routeChannelName, channels]);

  // Socket hook for real-time messaging
  const { messages: socketMessages, sendMessage } = useChatSocket(
    selectedChannel?.channelName,
    currentAdminId
  );
  const lastSocketIndexRef = useRef(0);
  // Track recently sent text messages to avoid echo duplicates from WS
  const recentlySentRef = useRef(new Set());

  // Sort messages by creation time
  const sortByCreatedAtAsc = (arr) =>
    [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Detect control messages (not for display)
  const isControlMessage = (msg) => {
    if (!msg || typeof msg.message !== "string") return false;
    try {
      const parsed = JSON.parse(msg.message);
      return parsed?.type === "refetch-img";
    } catch (_) {
      return false;
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Track last channel to prevent cross-channel merges
  const lastChannelNameRef = useRef(null);

  // Load API messages
  useEffect(() => {
    if (apiMessages && apiMessages.length > 0) {
      // Filter out control messages like {"type":"refetch-img"}
      const displayable = apiMessages.filter((m) => !isControlMessage(m));
      const sorted = sortByCreatedAtAsc(displayable);
      // Replace with freshly fetched channel messages, but KEEP optimistic temp messages
      setMessages((prev) => {
        const byId = new Map();
        for (const m of sorted) byId.set(m.id, m);
        // keep optimistic temp messages until server confirms
        for (const m of prev) {
          if (
            typeof m.id === "string" &&
            m.id.startsWith("temp-") &&
            !byId.has(m.id)
          ) {
            byId.set(m.id, m);
          }
        }
        return sortByCreatedAtAsc(Array.from(byId.values()));
      });

      // Check if there are more messages to load
      const total = messagesData?.data?.meta?.total || 0;
      setHasMoreMessages(sorted.length < total);
      // End channel-loading state once we have data
      if (isChannelLoading) setIsChannelLoading(false);
    } else if (!selectedChannel) {
      // Only reset if something is actually different to avoid redundant updates
      if (messages.length > 0) setMessages([]);
      if (currentPage !== 1) setCurrentPage(1);
      if (limit !== 20) setLimit(20);
      if (!hasMoreMessages) setHasMoreMessages(true);
      if (isChannelLoading) setIsChannelLoading(false);
    } else if (selectedChannel && messagesLoading) {
      // While fetching for a selected channel, ensure loading is shown
      if (!isChannelLoading) setIsChannelLoading(true);
    }
  }, [
    apiMessages,
    selectedChannel,
    messages.length,
    currentPage,
    hasMoreMessages,
    limit,
    messagesData?.data?.meta?.total,
    messagesLoading,
    isChannelLoading,
  ]);

  // Reset pagination when channel changes
  useEffect(() => {
    if (selectedChannel) {
      // Clear current messages so the new channel's messages show without mixing
      setMessages([]);
      setIsChannelLoading(true);
      setCurrentPage(1);
      setLimit(20);
      setHasMoreMessages(true);
      // reset socket processing index for the new channel
      lastSocketIndexRef.current = 0;
      // clear any recently sent markers when switching channels
      try { recentlySentRef.current.clear(); } catch (_) {}
      // trigger a refetch explicitly to ensure freshest data
      try { refetch && refetch(); } catch (_) {}
    }
  }, [selectedChannel?.channelName]);

  // Load more messages function
  const handleLoadMore = () => {
    if (hasMoreMessages && !messagesLoading) {
      setLimit((prev) => prev + 20);
    }
  };

  // Handle socket messages (process only new items)
  useEffect(() => {
    if (!socketMessages || socketMessages.length === 0) return;
    const start = lastSocketIndexRef.current || 0;
    const newItems = socketMessages.slice(start);
    if (newItems.length === 0) return;

    newItems.forEach((m) => {
      // Check for refetch signals
      if (typeof m.message === "string") {
        try {
          const parsed = JSON.parse(m.message);
          if (parsed.type === "refetch-img") {
            refetch();
            return;
          }
        } catch (err) {
          // Normal message
        }
      }

      // If this is an echo of our own recently sent text, ignore it to avoid duplicates
      if (
        typeof m.message === "string" &&
        m.senderId === currentAdminId &&
        recentlySentRef.current.has(m.message)
      ) {
        // consume once
        recentlySentRef.current.delete(m.message);
        return;
      }

      // Add new messages
      setMessages((prev) => {
        const seen = new Set(prev.map((msg) => msg.id));
        if (seen.has(m.id)) return prev;
        return [...prev, m].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
    });
    lastSocketIndexRef.current = socketMessages.length;
  }, [socketMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;
    if (!selectedChannel) return;

    // For images, do NOT add an optimistic bubble to avoid duplicates.
    // We'll rely on the server response/refetch to render the final message.
    // For text-only messages, add an optimistic bubble for instant feedback.

    if (file) {
      // Show uploading placeholder in UI
      try {
        const previewUrl = URL.createObjectURL(file);
        setUploadingImageUrl(previewUrl);
        setIsUploadingImage(true);
      } catch (_) {}

      const formData = new FormData();
      // Backend expects: messageImages (file) and data (JSON string with { message })
      formData.append("data", JSON.stringify({ message: newMessage || "" }));
      formData.append("messageImages", file);

      // derive the receiver userId from channel participants
      const receiverId =
        selectedChannel?.person1?.id === currentAdminId
          ? selectedChannel?.person2?.id
          : selectedChannel?.person1?.id;

      if (!receiverId) {
        console.error("Could not determine receiverId from selectedChannel");
        Swal.fire("Error", "Unable to determine recipient.", "error");
        return;
      }

      try {
        await sendMessageWithImage({ userId: receiverId, formData }).unwrap();

        // Notify other clients to refetch
        sendMessage(JSON.stringify({ type: "refetch-img" }));
      } catch (err) {
        console.error("Image message failed", err);
        Swal.fire("Error", "Failed to send image message.", "error");
      }

      setFile(null);
      // Clear the underlying input so the same file can be selected again
      if (fileInputRef.current) {
        try {
          fileInputRef.current.value = "";
        } catch (_) {}
      }
      // Hide uploading placeholder (actual image will appear from API/socket)
      setIsUploadingImage(false);
      setUploadingImageUrl(null);
    } else {
      // Text-only: add an optimistic bubble for instant feedback,
      // and rely on socket echo (filtered) without API refetch.
      const tempMessage = {
        id: `temp-${Date.now()}`,
        message: newMessage || "",
        senderId: currentAdminId,
        createdAt: new Date().toISOString(),
        files: [],
      };
      setMessages((prev) => [...prev, tempMessage]);
      // Track this message to skip the immediate echo from WS
      if (newMessage) {
        recentlySentRef.current.add(newMessage);
        // Auto-expire the marker after a few seconds to avoid suppressing future identical texts
        setTimeout(() => {
          try { recentlySentRef.current.delete(newMessage); } catch (_) {}
        }, 5000);
      }
      sendMessage(newMessage);
    }

    setNewMessage("");
  };

  const getLastMessage = (channel) => {
    return "Click to view messages";
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      <AdminProfile headingText="All Messages" />

      <TopBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <div className="flex h-screen overflow-hidden">
        <ChannelSidebar
          channels={channels}
          selectedChannel={selectedChannel}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          setSelectedChannel={setSelectedChannel}
          channelsLoading={channelsLoading}
          channelsError={channelsError}
          currentAdminId={currentAdminId}
          getLastMessage={getLastMessage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <ChatHeader
            selectedChannel={selectedChannel}
            currentAdminId={currentAdminId}
          />

          <MessageList
            selectedChannel={selectedChannel}
            messages={messages}
            messagesLoading={messagesLoading || isChannelLoading}
            currentPage={currentPage}
            hasMoreMessages={hasMoreMessages}
            handleLoadMore={handleLoadMore}
            currentAdminId={currentAdminId}
            formatTime={formatTime}
            listRef={listRef}
            isUploadingImage={isUploadingImage}
            uploadingImageUrl={uploadingImageUrl}
          />

          <MessageInput
            selectedChannel={selectedChannel}
            file={file}
            setFile={setFile}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSend={handleSend}
            fileInputRef={fileInputRef}
            isUploadingImage={isUploadingImage}
          />
        </div>
      </div>
    </div>
  );
};

export default AllMessage;
