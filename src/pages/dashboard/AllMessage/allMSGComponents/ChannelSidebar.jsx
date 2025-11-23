import React from "react";
import { Search } from "lucide-react";
import { FiMenu } from "react-icons/fi";
import { ImCross } from "react-icons/im";

const ChannelSidebar = ({
  channels,
  selectedChannel,
  showSidebar,
  setShowSidebar,
  setSelectedChannel,
  channelsLoading,
  channelsError,
  currentAdminId,
  getLastMessage,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className={`absolute md:relative md:top-0 left-0 w-80 md:w-96 bg-white flex flex-col border-r border-gray-200 transition-transform duration-300 z-20
      ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <button
          onClick={() => setShowSidebar(false)}
          className="text-gray-600"
          aria-label="Close sidebar"
        >
          <ImCross className="text-xl text-gray-400" />
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 hidden md:block">
          Messages
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder={`Search conversations (${channels.length})`}
            className="w-full pr-10 p-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-brandGray" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="overflow-y-auto flex-1">
        {channelsLoading ? (
          <p className="p-4">Loading channels...</p>
        ) : channelsError ? (
          <p className="p-4 text-red-500">Failed to load channels.</p>
        ) : (
          channels.map((channel) => {
            const isActive = selectedChannel?.id === channel.id;
            const person1 = channel.person1;
            const person2 = channel.person2;
            
            // Determine which person is NOT the admin
            const otherPerson = person1?.id === currentAdminId ? person2 : person1;
            
            return (
              <div
                key={channel.id}
                onClick={() => {
                  setSelectedChannel(channel);
                  if (window.innerWidth < 768) setShowSidebar(false);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${isActive ? "bg-yellow-50 border-r-4 border-yellow-400" : ""}`}
              >
                <div className="relative">
                  <img
                    src={otherPerson?.profileImage || "https://i.pravatar.cc/150?img=1"}
                    alt={otherPerson?.fullName || "User"}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {otherPerson?.fullName || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {getLastMessage(channel)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChannelSidebar;
