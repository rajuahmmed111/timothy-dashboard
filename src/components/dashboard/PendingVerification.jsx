import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { HiDotsVertical } from "react-icons/hi";

const PendingVerification = ( {isLoading, overviewData, isnomaladmin}) => {
  const navigate = useNavigate();
  const total = overviewData?.data?.totalPartners || 0;
  const pending = overviewData?.data?.totalPendingPartners || 0;
  const completed = total - pending;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  // Updated colors per new design
  const COLORS = ["#FFB13A", "#FFDF3A"];

  if (isLoading || !overviewData?.data) {
    return (
      <div className="bg-white shadow-lg border rounded-xl p-6 w-full max-w-lg mx-auto h-[22rem] md:h-[24rem] flex items-center justify-center">
        <Spin size="large" tip="Loading verification data..." />
      </div>
    );
  }

  return (
    <div >
      <h1 className="text-2xl font-semibold mb-6">Pending Verification</h1>
      <div className="bg-white rounded-lg p-6  shadow-sm hover:shadow-md transition-shadow w-full max-w-md mx-auto h-full">
        <div className="flex flex-col items-center w-full h-full justify-between">
          {/* Top row: total and menu */}
          <div className="flex justify-around items-start w-full mb-2">
            <div className="text-3xl font-normal text-darkGray">{total.toLocaleString()}</div>
            <div className="text-2xl font-normal text-gray-400">
              <HiDotsVertical className="mt-1" />
            </div>
          </div>

          {/* Chart + Legend */}
          <div className="flex items-center justify-around w-full">
            {/* Pie Chart */}
            <div className="relative size-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={"80%"}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-5 ">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FFB13A] mr-2" />
                <span className="text-sm text-darkGray">Partners</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FFDF3A] mr-2" />
                <span className="text-sm text-darkGray">Users</span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className={`w-full ${isnomaladmin ? "mt-7" : ""}`}>
            <button
              onClick={() => navigate("/dashboard/approve-partners")}
              className="flex w-full justify-center gap-6 items-center text-white bg-[#ffd49d] py-3 px-8 rounded-lg hover:brightness-95 transition"
            >
              <span>Verification</span> <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
