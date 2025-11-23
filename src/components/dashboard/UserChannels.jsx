import { Spin, Alert, Avatar, Card, Empty } from "antd";
import { MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { useGetChannelsByUserIdQuery } from "../../redux/api/chat/getChannelsByIdApi";
import MessageModal from "./MessageModal";

const UserChannels = ({ userId, userName }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    data: channelsData, 
    isLoading, 
    error 
  } = useGetChannelsByUserIdQuery(userId, {
    skip: !userId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" tip="Loading channels..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error?.data?.message || "Failed to load channels"}
        type="error"
        showIcon
      />
    );
  }

  // Normalize channels array to support both shapes:
  // 1) { success, message, data: [ ... ] }
  // 2) { success, message, data: { meta, data: [ ... ] } }
  const channelsRaw = channelsData?.data;
  const channels = Array.isArray(channelsRaw)
    ? channelsRaw
    : Array.isArray(channelsRaw?.data)
    ? channelsRaw.data
    : [];

  if (channels.length === 0) {
    return (
      <Empty
        image={<MessageCircle className="w-16 h-16 text-gray-400 mx-auto" />}
        description={
          <span className="text-gray-500">
            No message channels found for this user
          </span>
        }
      />
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'BUSINESS_PARTNER':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-darkGray">
          Recent Channels of {userName || 'User'} ({channels.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {channels.map((channel) => (
          <Card
            key={channel.id}
            className="hover:shadow-md transition-shadow duration-200"
            bodyStyle={{ padding: '16px' }}
          >
            <div className="flex items-center space-x-4">
              <Avatar
                size={48}
                src={channel.receiverUser?.profileImage}
                icon={<User />}
                className="flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-base font-medium text-darkGray truncate">
                    {channel.receiverUser?.fullName || channel.receiverUser?.email || 'Unknown User'}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      channel.receiverUser?.role
                    )}`}
                  >
                    {channel.receiverUser?.role?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-brandGray">
                  <span>ID: {channel.receiverUser?.id}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                  <span>Created: {formatDate(channel.createdAt)}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChannel(channel);
                    setIsModalOpen(true);
                  }}
                  className="text-brandGray hover:text-brandBlue transition-colors p-1 rounded-full hover:bg-blue-50"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChannel(null);
        }}
        channelName={selectedChannel?.channelName}
        receiverUser={selectedChannel?.receiverUser}
      />
    </div>
  );
};

export default UserChannels;
