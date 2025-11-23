import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { HiArrowTrendingDown } from "react-icons/hi2";

const CommunicationSupport = ({ supportData, selectedTime = "This Month", onTimeChange, timeOptions = ["Today", "This Week", "This Month", "This Year"] }) => {
  const [open, setOpen] = useState(false);
  // Extract dynamic support data with safe fallbacks
  const {
    totalSupports = 0,
    totalPendingSupport = 0,
    Critical = 0,
    High = 0,
    Medium = 0,
    Low = 0,
  } = supportData || {};

  // Pie chart data with updated colors to match the image
  const severityData = [
    { name: "Critical", value: Critical, color: "#8B4513" }, // Brown
    { name: "High", value: High, color: "#FF8C00" }, // Orange
    { name: "Medium", value: Medium, color: "#FFD700" }, // Light orange/yellow
    { name: "Low", value: Low, color: "#FFA500" }, // Orange
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Communication & Support
          </h2>
          <p className="text-xl text-gray-500">Reported Issues</p>
        </div>
        {/* Time-range filter */}
        <div className="relative inline-block text-left">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border cursor-pointer"
          >
            {selectedTime}
            <IoIosArrowDown className="ml-1 text-gray-400" size={12} />
          </div>
          {open && (
            <div className="absolute right-0 z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
              {timeOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => { onTimeChange && onTimeChange(opt); setOpen(false); }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
          {/* Pie Chart */}
          <div className="flex justify-center md:justify-start w-full md:w-auto overflow-visible">
            <div className="w-40 h-40 md:w-48 md:h-48 overflow-visible">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={isMobile ? 70 : 90}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 w-full">
            <div className="flex flex-col space-y-6">
              {/* Total Issues */}
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-md text-gray-500 ">Total Issues</p>
                  <p className="text-lg font-bold text-gray-900">{totalSupports}</p>
                </div>
              </div>

              {/* Pending Issues */}
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
                  <HiArrowTrendingDown className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-md text-gray-500">Pending Issues</p>
                  <p className="text-lg font-bold text-gray-900">{totalPendingSupport}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Legend */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
            <div className="flex justify-between items-center flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                <span className="text-sm font-medium text-gray-700">Critical</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{Critical}</span>
            </div>

            <div className="flex justify-between items-center flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#FF8C00]"></div>
                <span className="text-sm font-medium text-gray-700">High</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{High}</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
            <div className="flex justify-between items-center flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#FFD700]"></div>
                <span className="text-sm font-medium text-gray-700">Medium</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{Medium}</span>
            </div>

            <div className="flex justify-between items-center flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                <span className="text-sm font-medium text-gray-700">Low</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{Low}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationSupport;
