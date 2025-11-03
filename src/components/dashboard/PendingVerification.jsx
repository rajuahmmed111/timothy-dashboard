import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const PendingVerification = ( {isLoading, overviewData}) => {
  const navigate = useNavigate();
  const total = overviewData?.data?.totalPartners || 0;
  const pending = overviewData?.data?.totalPendingPartners || 0;
  const completed = total - pending;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#FF9900", "#FFCC66"]; // Adjusted to match the reference image

  if (isLoading || !overviewData?.data) {
    return (
      <div className="bg-white shadow-lg border rounded-xl p-6 w-full max-w-lg mx-auto h-[22rem] md:h-[24rem] flex items-center justify-center">
        <Spin size="large" tip="Loading verification data..." />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg border rounded-xl p-6  w-full max-w-lg mx-auto h-[22rem] md:h-[24rem]">
      <div className="flex justify-between items-center h-full">
        {/* Left Section */}
        <div className="h-full flex flex-col gap-16 justify-center items-center text-center">
<div className="">
          <h2 className="!text-2xl sm:text-xl font-semibold text-darkGray mb-1">
            Pending Verification
          </h2>
            <p className="text-xl semibold  text-darkGray mb-1">
            Total (partners)
          </p>
          <p className="text-3xl font-bold text-darkGray mb-4">
            {total.toLocaleString()}
          </p>
</div>

          <button
            onClick={() => navigate("/dashboard/approve-partners")}
            className="bg-[#FF9900] hover:bg-[#e88700] text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition"
          >
            Verification <FaArrowRight />
          </button>
        </div>

{/* Right Section (Pie Chart + Legend) */}
<div className="flex items-center gap-4 flex-col">
  {/* Pie Chart */}
  <div className="w-44 h-44"> {/* increased size */}
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={60} // also increased for better fill
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Legend */}
  <div className="flex gap-4 text-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#FF9900]" />
      <span>Completed {completed}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-[#FFCC66]" />
      <span>Pending {pending}</span>
    </div>
  </div>
</div>



      </div>
    </div>
  );
};

export default PendingVerification;
