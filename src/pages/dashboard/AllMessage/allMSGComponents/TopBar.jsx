import React from "react";
import { FiMenu } from "react-icons/fi";
import { ImCross } from "react-icons/im";

const TopBar = ({ showSidebar, setShowSidebar }) => {
  return (
    <div className="p-5 border-b border-gray-200 flex md:flex-row flex-row-reverse items-center justify-between md:justify-start">
      <button
        className="md:hidden mr-3 text-gray-600"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label="Open conversations"
      >
        {showSidebar ? (
          <ImCross className="text-2xl text-gray-400" />
        ) : (
          <FiMenu className="text-2xl" />
        )}
      </button>
    </div>
  );
};

export default TopBar;
