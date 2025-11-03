import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuTicket } from "react-icons/lu";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

const UserSupportTickets = ({
  totalTickets = 2420,
  pendingTickets = 2420,
  totalPercentage = 20,
  pendingPercentage = 20,
  totalTrend = "up", // "up" or "down"
  pendingTrend = "up", // "up" or "down"
  title = "User Support Tickets",
}) => {
  const TrendIcon = ({ trend, percentage }) => {
    const isUp = trend === "up";
    const IconComponent = isUp ? BsArrowUp : BsArrowDown;
    const colorClass = isUp
      ? "text-brandGreen bg-greenMutedBg p-2 rounded-lg"
      : "text-red-600 bg-redMutedBg p-2 rounded-lg";

    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <IconComponent className="w-3 h-3" />
        <span className="text-xs font-medium">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100  mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold  text-darkGray mb-1">
            Total Earnings
          </h2>
          {/* <h2 className="text-xl font-semibold text-darkGray">Tickets</h2> */}
        </div>
        <div className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border">
          This Month{" "}
          <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Total Tickets */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-brandGray mb-2">Admins Earnings</p>
            <h3 className="text-3xl font-semibold text-darkGray">
              {totalTickets.toLocaleString()}
            </h3>
          </div>

          <div className="flex flex-col items-center space-y-2">
            {/* Orange Ticket Icon */}
            <div className="w-12 h-12 bg-orangeLightBg rounded-lg flex items-center justify-center">
              <LuTicket className="w-6 h-6 text-orange-500" />
            </div>

            {/* Trend Arrow */}

            <TrendIcon trend={totalTrend} percentage={totalPercentage} />
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Pending Tickets */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-brandGray mb-2">
              Service Providers Earnings
            </p>
            <h3 className="text-3xl font-semibold text-darkGray">
              {pendingTickets.toLocaleString()}
            </h3>
          </div>

          <div className="flex flex-col items-center space-y-2">
            {/* Red/Pink Ticket Icon */}
            <div className="w-12 h-12 bg-redMutedBg rounded-lg flex items-center justify-center">
              <LuTicket className="w-6 h-6 text-brandRed" />
            </div>

            {/* Trend Arrow */}
            <TrendIcon trend={pendingTrend} percentage={pendingPercentage} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage with default data
UserSupportTickets.defaultProps = {
  totalTickets: 2420,
  pendingTickets: 2420,
  totalPercentage: 20,
  pendingPercentage: 20,
  totalTrend: "up",
  pendingTrend: "up",
  title: "User Support Tickets",
};

export default UserSupportTickets;
