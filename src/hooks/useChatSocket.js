import { useEffect, useRef, useState } from "react";
import {wsUrl} from "../config/envConfig";

export default function useChatSocket(channelName, senderId) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // If there's no valid channel, don't open a socket
    if (!channelName) {
      // Ensure any existing socket is closed when channel becomes falsy
      if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
        try { socketRef.current.close(); } catch (_) {}
      }
      return;
    }

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("✅ Connected to WebSocket server");

      // subscribe to channel
      const subscribePayload = {
        type: "subscribe",
        channelName,
      };
      try {
        socketRef.current.send(JSON.stringify(subscribePayload));
        console.log(`📡 Subscribed to channel: ${channelName}`);
      } catch (err) {
        console.error("❌ Failed to send subscribe payload:", err);
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📥 Incoming WS message:", data);

        // Case 1: Standard shape { type: 'message', data: {...} }
        if (data?.type === "message" && data?.data) {
          setMessages((prev) => [...prev, data.data]);
          return;
        }

        // Case 2: JSON with a 'message' field directly
        if (typeof data?.message !== "undefined") {
          const normalized = {
            id: data.id || `ws-${Date.now()}`,
            message: data.message ?? "",
            files: Array.isArray(data.files) ? data.files : [],
            createdAt: data.createdAt || new Date().toISOString(),
            senderId: data.senderId || senderId,
            channelName: data.channelName || channelName,
            sender: data.sender || undefined,
          };
          setMessages((prev) => [...prev, normalized]);
          return;
        }

        // Otherwise ignore control or unknown payloads
      } catch (err) {
        // Case 3: Non-JSON payload, treat as plain text message
        const text = String(event.data ?? "");
        if (text) {
          const normalized = {
            id: `ws-${Date.now()}`,
            message: text,
            files: [],
            createdAt: new Date().toISOString(),
            senderId,
            channelName,
          };
          setMessages((prev) => [...prev, normalized]);
        } else {
          console.error("❌ Failed to parse WS message:", event.data, err);
        }
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socketRef.current.onclose = () => {
      console.log(`🔌 WebSocket closed (unsubscribed from ${channelName})`);
    };

    // cleanup on unmount or when channel changes
    return () => {
      const rs = socketRef.current?.readyState;
      if (rs === WebSocket.OPEN || rs === WebSocket.CONNECTING) {
        try { socketRef.current.close(); } catch (_) {}
      }
    };
  }, [channelName]);

  // send message via socket
  const sendMessage = (message, file = null) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not open, message not sent");
      return;
    }

    const msgData = {
      type: "message",
      channelName,
      senderId,
      message,
      files: file ? [file.name] : [],
    };

    console.log("📤 Sending message:", msgData);
    socketRef.current.send(JSON.stringify(msgData));
  };

  return { messages, sendMessage };
}
