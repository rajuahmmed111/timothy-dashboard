import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCreateMessageMutation } from "../../Redux/api/Chat/createChatApi";

export default function Chat() {
  const { id: receiverId } = useParams();
  const [searchParams] = useSearchParams();
  const registrationId = searchParams.get("plate");
  const navigate = useNavigate();

  const [createMessage] = useCreateMessageMutation();
  const [loading, setLoading] = useState(true);

  const hasRunRef = useRef(false); // <--- track if already run

  useEffect(() => {
    if (hasRunRef.current) return; // prevent running twice
    hasRunRef.current = true;

    const createChannel = async () => {
      try {
        const initialFormData = new FormData();
        initialFormData.append(
          "message",
          `Is this plate ${registrationId} available?`
        );

        const res = await createMessage({
          id: receiverId,
          formData: initialFormData,
        }).unwrap();

        const channel = res.data.channel;
        if (channel?.channelName) {
          navigate(
            `/userdashboard/message-center?${channel.channelName}`
          );
        }
      } catch (err) {
        console.error("Failed to create/get channel:", err);
      } finally {
        setLoading(false);
      }
    };

    createChannel();
  }, [receiverId, registrationId, createMessage, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {loading ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Creating chat channel...</h1>
          <p className="text-gray-500">Please wait while we set things up.</p>
        </>
      ) : (
        <p className="text-red-500">
          Couldn’t create channel. Please try again.
        </p>
      )}
    </div>
  );
}
