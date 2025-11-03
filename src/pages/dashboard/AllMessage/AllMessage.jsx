import React from "react";
import AdminProfile from "../components/AdminProfile";
import { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";

const AllMessage = () => {
  const [selectedConversation, setSelectedConversation] = useState(0);

  const conversations = [
    {
      id: 0,
      name: "James Rodriguez",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      isOnline: true,
      isActive: true,
    },
    {
      id: 1,
      name: "James Rodriguez",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "JR",
      isOnline: false,
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      isActive: false,
    },
    {
      id: 2,
      name: "Daniel Hall",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "DH",
      isOnline: true,
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      isActive: false,
    },
    {
      id: 3,
      name: "James Rodriguez",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "JR",
      isOnline: false,
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      isActive: false,
    },
    {
      id: 4,
      name: "John Doe",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "JD",
      isOnline: false,
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      isActive: false,
    },
    {
      id: 5,
      name: "William Davis",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "WD",
      isOnline: true,
      avatarUrl: "https://i.pravatar.cc/150?img=6",
      isActive: false,
    },
    {
      id: 6,
      name: "Jane Smith",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "JS",
      isOnline: false,
      avatarUrl: "https://i.pravatar.cc/150?img=7",
      isActive: false,
    },
    {
      id: 7,
      name: "John Doe",
      message: "Lorem ipsum text is the best",
      time: "24m",
      avatar: "JD",
      isOnline: true,
      avatarUrl: "https://i.pravatar.cc/150?img=8",
      isActive: false,
    },
  ];

  const chatMessages = [
    {
      id: 1,
      text: "Morning Angate, I have question about My Task",
      time: "Today 11:52",
      isUser: true,
    },
    {
      id: 2,
      text: "Yes sure, Any problem with your assignment?",
      time: "Today 11:53",
      isUser: false,
    },
    {
      id: 3,
      text: "How to make a responsive display from the dashboard?",
      time: "",
      isUser: true,
      hasImage: true,
    },
    {
      id: 4,
      text: "Is there a plugin to do this task?",
      time: "Today 11:52",
      isUser: true,
    },
    {
      id: 5,
      text: "No plugins. You just have to make it smaller according to the size of the phone.",
      time: "",
      isUser: false,
    },
    {
      id: 6,
      text: "Thank you very much. I'm glad you asked about the assignment",
      time: "Today 11:53",
      isUser: false,
    },
  ];

  return (
    <div className="space-y-6 bg-grayLightBg min-h-screen md:px-6 font-sans">
      <AdminProfile headingText="All Messages" />

      <div className="flex flex-col w-full h-full justify-center md:flex-row bg-gray-100">
        {/* Sidebar */}
        <div className="md:w-80 w-full h-full bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Messages
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="All Conversations 24"
                className="w-full pr-10 p-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-brandGray" />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1  overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                  conversation.isActive
                    ? "bg-orangePrimary border-r-4 border-orangeAction hover:bg-orangePrimary"
                    : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={conversation.avatarUrl}
                    alt={conversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-greenLightText rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-darkGray">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-brandGray">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-brandGray truncate mt-1">
                    {conversation.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={`https://i.pravatar.cc/150?img=1`}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-greenLightText rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-darkGray">James Rodriguez</h3>
                <p className="text-sm text-brandGreen">Online</p>
              </div>
            </div>
            {/* <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button> */}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-center">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                Today
              </span>
            </div>

            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    message.isUser ? "order-1" : "order-2"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isUser
                        ? "bg-orangePrimary text-darkGray"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {message.hasImage && (
                      <div className="mb-2">
                        <img
                          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop"
                          alt="Dashboard screenshot"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.time && (
                    <p
                      className={`text-xs text-brandGray mt-1 ${
                        message.isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {message.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white p-4 border-t border-gray-200 hidden">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>


        </div>

      </div>
    </div>
  );
};

export default AllMessage;
