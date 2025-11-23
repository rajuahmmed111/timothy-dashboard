import { Modal, Spin, Alert, Avatar, Empty, Image } from "antd";
import { MessageCircle, User, Clock } from "lucide-react";
import { useGetMessagesByChannelNameQuery } from "../../redux/api/chat/getAllMSGApi";
import { useSelector } from "react-redux";

const MessageModal = ({ isOpen, onClose, channelName, receiverUser }) => {
  const { userId: currentAdminId } = useSelector((state) => state.auth);
  const { 
    data: messagesData, 
    isLoading, 
    error 
  } = useGetMessagesByChannelNameQuery(
    { channelName, page: 1, limit: 100 },
    { skip: !channelName || !isOpen }
  );
  // Normalize API data shape similar to AllMessage.jsx
  const messages = messagesData?.data?.data?.[0]?.messages || [];

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <Spin size="large" tip="Loading messages..." />
        </div>
      );
    }

    if (error) {
      return (
        <Alert
          message="Error"
          description={error?.data?.message || "Failed to load messages"}
          type="error"
          showIcon
        />
      );
    }

    if (messages.length === 0) {
      return (
        <Empty
          image={<MessageCircle className="w-16 h-16 text-gray-400 mx-auto" />}
          description={
            <span className="text-gray-500">
              No messages found in this conversation
            </span>
          }
        />
      );
    }

    return (
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {messages.map((message) => {
          const isOwn = message?.senderId === currentAdminId;
          const hasImages = Array.isArray(message?.files) && message.files.length > 0;
          return (
            <div
              key={message.id}
              className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwn && (
                <Avatar
                  size={32}
                  src={message.sender?.profileImage}
                  icon={<User />}
                  className="mr-2"
                />
              )}

              <div className={`max-w-[75%] ${isOwn ? 'text-right' : 'text-left'}`}>
                <div
                  className={`${
                    isOwn
                      ? 'bg-orange-100 text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                  } rounded-2xl px-4 py-2 shadow-sm`}
                >
                  {/* Sender name and time */}
                  <div className={`flex items-center ${isOwn ? 'justify-end' : 'justify-start'} gap-2 mb-1`}>
                    <span className="text-xs font-medium text-gray-700">
                      {message.sender?.fullName || 'Unknown User'}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(message.createdAt)}
                    </span>
                  </div>

                  {/* Message text */}
                  {message?.message && (
                    <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                  )}

                  {/* Image attachments */}
                  {hasImages && (
                    <div className={`mt-2 grid ${message.files.length > 1 ? 'grid-cols-2 gap-2' : 'grid-cols-1'} rounded-md`}>
                      {message.files.map((file) => (
                        <div key={file?.id || file?.url} className="overflow-hidden rounded-lg">
                          <Image
                            src={file?.url || file}
                            alt="attachment"
                            className="rounded-lg object-cover"
                            placeholder
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isOwn && (
                <Avatar
                  size={32}
                  src={message.sender?.profileImage}
                  icon={<User />}
                  className="ml-2"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={receiverUser?.profileImage}
            icon={<User />}
          />
          <div>
            <h3 className="text-lg font-medium text-darkGray">
              Conversation with {receiverUser?.fullName || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      className="message-modal"
    >
      {renderContent()}
    </Modal>
  );
};

export default MessageModal;
