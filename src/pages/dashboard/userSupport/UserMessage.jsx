import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, Paperclip, Send } from "lucide-react";
import { useParams } from "react-router-dom";

const UserMessage = () => {
  const [message, setMessage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const { id } = useParams();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []); // this makes it scroll whenever new messages arrive

  const ticketData = {
    id: "#974923",
    title: "Cannot access the system",
    status: "Open",
    priority: "Urgent",
    created: "31 Dec 2022",
    lastMessage: "31 Dec 2022",
    assignedAgent: {
      name: "Sonal Gupta",
      username: "@sonal123",
      avatar:
        "https://www.shutterstock.com/image-vector/man-character-face-avatar-glasses-260nw-562077406.jpg",
    },
    requester: {
      name: "Sonal Gupta",
      username: "@sonal123",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXZhdGFyfGVufDB8fDB8fHww",
    },
  };

  const messages = [
    {
      id: 1,
      type: "user",
      content: "Morning Angela, I have question about My Task",
      time: "Today 11:52",
      isHighlighted: true,
    },
    {
      id: 2,
      type: "agent",
      content: "Yes sure, Any problem with your assignment?",
      time: "Today 11:53",
    },
    {
      id: 3,
      type: "user",
      content: "How to make a responsive display from the dashboard?",
      time: "Today 11:52",
      hasImage: true,
      imageUrl:
        "https://www.lexus.co.nz/content/dam/lexus-v3-new-zealand/discover-lexus/future-concept-cars/lf-zl-concept.jpg",
    },
    {
      id: 4,
      type: "agent",
      content: "Is there a plugin to do this task?",
      time: "Today 11:52",
    },
    {
      id: 5,
      type: "user",
      content:
        "No plugins, You just have to make it smaller according to the size of the phone.",
      time: "",
    },
    {
      id: 6,
      type: "user",
      content: "How to make a responsive display from the dashboard?",
      time: "Today 11:52",
      hasImage: true,
      imageUrl:
        "https://www.lexus.co.nz/content/dam/lexus-v3-new-zealand/discover-lexus/future-concept-cars/lf-zl-concept.jpg",
    },
    {
      id: 7,
      type: "agent",
      content: "Is there a plugin to do this task?",
      time: "Today 11:52",
    },
    {
      id: 8,
      type: "user",
      content:
        "No plugins, You just have to make it smaller according to the size of the phone.",
      time: "",
    },
    {
      id: 9,
      type: "user",
      content: "How to make a responsive display from the dashboard?",
      time: "Today 11:52",
      hasImage: true,
      imageUrl:
        "https://www.lexus.co.nz/content/dam/lexus-v3-new-zealand/discover-lexus/future-concept-cars/lf-zl-concept.jpg",
    },
    {
      id: 10,
      type: "agent",
      content: "Is there a plugin to do this task?",
      time: "Today 11:52",
    },
    {
      id: 11,
      type: "user",
      content:
        "No plugins, You just have to make it smaller according to the size of the phone.",
      time: "",
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLoadmore = () => {
    console.log("handle load more tapped");
  };

  return (
    <div className="flex flex-col-reverse md:flex-row  md:h-screen bg-grayLightBg font-sans">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded">
              <ArrowLeft size={20} className="text-brandGray" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-darkGray">
                Query:{" "}
                <span className="font-normal">Cannot access the system</span>
                <span className="text-sm text-brandGray ml-2">{id}</span>
              </h1>
            </div>
          </div>
          <button className="text-brandGray hover:text-darkGray">
            More info
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Today Label */}
          <div className="flex justify-center">
            <span
              onClick={() => {
                handleLoadmore();
              }}
              className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm cursor-pointer"
            >
              Load More
            </span>
          </div>
          <div className="flex justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
              Today
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md ${
                  msg.type === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.type === "user"
                      ? msg.isHighlighted
                        ? "bg-orange-400 text-white"
                        : "bg-orangeLightBg text-darkGray"
                      : msg.isHighlighted
                      ? "bg-orange-400 text-white"
                      : "bg-white text-darkGray border border-gray-200"
                  }`}
                >
                  {msg.hasImage && (
                    <div className="mb-2">
                      <img
                        src={msg.imageUrl}
                        alt="Attachment"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.time && (
                  <p className="text-xs text-brandGray mt-1 text-right">
                    {msg.time}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* This is the invisible marker we scroll to */}
          <div ref={bottomRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3 hidden">
            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                isCompleted
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-darkGray text-brandGray hover:bg-grayLightBg"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full  ${
                  isCompleted ? "bg-white" : "bg-orange-500"
                }`}
              ></div>
              <span className="text-sm font-medium ">Mark as Completed</span>
            </button>
          </div>

          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write your response for issue"
                className="w-full p-3 border text-brandGray rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="1"
              />
            </div>
            <button className="p-3 text-brandGray hover:text-darkGray">
              <Paperclip size={20} />
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <span>Send</span>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="md:w-80 w-full bg-white border-l border-gray-200 p-6">
        {/* Ticket Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-darkGray mb-4">
            Ticket Info
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-brandGray">Ticket ID:</span>
              <span className="text-sm font-medium text-darkGray">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-brandGray">Created:</span>
              <span className="text-sm text-darkGray">
                {ticketData.created}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-brandGray">Last message:</span>
              <span className="text-sm text-darkGray">
                {ticketData.lastMessage}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-brandGray">Status:</span>
              <span className="text-xs px-2 py-1 bg-greenMutedBg text-brandGreen rounded-full">
                {ticketData.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-brandGray">Priority:</span>
              <span className="text-xs px-2 py-1 bg-redMutedBg text-red-800 rounded-full">
                {ticketData.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned to */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-darkGray">Assigned to</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus size={16} className="text-brandGray" />
            </button>
          </div>
          <div className="mb-3">
            <span className="text-sm text-brandGray">Agent</span>
          </div>
          <div className="flex items-center space-x-3">
            <img
              src={ticketData.assignedAgent.avatar}
              alt={ticketData.assignedAgent.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-darkGray">
                {ticketData.assignedAgent.name}
              </p>
              <p className="text-xs text-brandGray">
                {ticketData.assignedAgent.username}
              </p>
            </div>
          </div>
        </div>

        {/* Requester Detail */}
        <div>
          <h2 className="text-lg font-semibold text-darkGray mb-4">
            Requester Detail
          </h2>
          <div className="flex items-center space-x-3">
            <img
              src={ticketData.requester.avatar}
              alt={ticketData.requester.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-darkGray">
                {ticketData.requester.name}
              </p>
              <p className="text-xs text-brandGray">
                {ticketData.requester.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
