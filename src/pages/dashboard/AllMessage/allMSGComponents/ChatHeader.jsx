import React from "react";
import { FiMoreVertical } from "react-icons/fi";

const ChatHeader = ({ selectedChannel, currentAdminId }) => {
  if (!selectedChannel) return null;

  const otherPerson = selectedChannel.person1?.id === currentAdminId 
    ? selectedChannel.person2 
    : selectedChannel.person1;

  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          {otherPerson?.profileImage ? (
            <img
              src={otherPerson.profileImage}
              alt={otherPerson?.fullName || "user"}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              {(otherPerson?.fullName?.[0] || "?").toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {otherPerson?.fullName || "Unknown User"}
          </h2>
        </div>
      </div>
      <FiMoreVertical className="w-5 h-5 text-gray-500" />
    </div>
  );
};

export default ChatHeader;
