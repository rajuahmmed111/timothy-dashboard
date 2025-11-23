import React from "react";
import { IoCheckmarkDone } from "react-icons/io5";

const MessageList = ({
  selectedChannel,
  messages,
  messagesLoading,
  currentPage,
  hasMoreMessages,
  handleLoadMore,
  currentAdminId,
  formatTime,
  listRef,
  isUploadingImage,
  uploadingImageUrl,
}) => {
  if (!selectedChannel) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-gray-500 p-2">
          Select a conversation to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Progressive top loading hint when fetching but we already have some messages */}
      {messagesLoading && messages.length > 0 && (
        <div className="flex justify-center mb-2">
          <span className="text-xs text-gray-500">Loading…</span>
        </div>
      )}

      {/* Load More Button */}
      {hasMoreMessages && messages.length > 0 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={handleLoadMore}
            disabled={messagesLoading}
            className={`px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors ${
              messagesLoading ? "opacity-50 cursor-not-allowed bg-gray-400" : ""
            }`}
          >
            {messagesLoading ? "Loading..." : "Load More Messages"}
          </button>
        </div>
      )}

      {/* When there are no messages yet */}
      {messages.length === 0 ? (
        messagesLoading ? (
          <p>Loading messages...</p>
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )
      ) : (
        messages.map((msg) => {
          const isAdminMessage = msg.senderId === currentAdminId;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isAdminMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl p-4 ${
                  isAdminMessage
                    ? "bg-[#00823b] text-white"
                    : "bg-white text-gray-900 shadow-sm border border-gray-200"
                }`}
              >
                {Array.isArray(msg.files) && msg.files.length > 0 && (
                  <div
                    className={`mt-3 grid gap-2 ${
                      msg.files.length > 1 ? "grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {msg.files.map((f, idx) => {
                      const isHttp =
                        typeof f === "string" &&
                        (f.startsWith("http://") || f.startsWith("https://"));
                      return (
                        <img
                          key={idx}
                          src={f}
                          alt="attachment"
                          className="w-full h-auto rounded-xl shadow-md object-cover cursor-pointer transition-transform hover:scale-[1.02]"
                          onClick={() => {
                            if (isHttp) window.open(f, "_blank");
                          }}
                          onError={(e) => {
                            // Hide broken images (e.g., file:// URLs that cannot render in browser)
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                <p className="text-sm break-words">{msg.message}</p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs opacity-70">
                    {formatTime(msg.createdAt)}
                  </p>
                  {isAdminMessage && (
                    <div className="flex items-center gap-1">
                      <IoCheckmarkDone className="" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Uploading placeholder for images */}
      {isUploadingImage && uploadingImageUrl && (
        <div className="flex justify-end">
          <div className="max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl p-4 bg-[#00823b] text-white opacity-80">
            <div className="mt-1 grid gap-2">
              <img
                src={uploadingImageUrl}
                alt="uploading"
                className="w-full max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-md object-cover opacity-70"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs italic animate-pulse">Uploading…</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
