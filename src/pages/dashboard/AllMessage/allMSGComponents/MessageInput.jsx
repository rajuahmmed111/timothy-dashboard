import React from "react";
import { RiSendPlane2Fill } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";

const MessageInput = ({
  selectedChannel,
  file,
  setFile,
  newMessage,
  setNewMessage,
  handleSend,
  fileInputRef,
  isUploadingImage,
}) => {
  if (!selectedChannel) return null;

  return (
    <>
      {/* Image Preview */}
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
      <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
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
          <IoImagesOutline className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isUploadingImage) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleSend}
          disabled={(!newMessage.trim() && !file) || !!isUploadingImage}
          className={`p-3 rounded-full ${
            (newMessage.trim() || file) && !isUploadingImage
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title="Send message"
        >
          <RiSendPlane2Fill className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default MessageInput;
