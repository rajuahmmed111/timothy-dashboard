import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { HiArrowTrendingDown } from "react-icons/hi2";
import { useState } from "react";

const CommunicationSupport = () => {
  // Pie chart data with updated colors to match the image
  const severityData = [
    { name: "Critical", value: 410, color: "#8B4513" }, // Brown
    { name: "High", value: 142, color: "#FF8C00" }, // Orange
    { name: "Medium", value: 340, color: "#FFD700" }, // Light orange/yellow
    { name: "Low", value: 590, color: "#FFA500" }, // Orange
  ];

  const options = ["Today", "This Week", "This Month", "This Year"];
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Today");

  const handleSelect = (option) => {
    setSelected(option);
    console.log("Selected:", option);
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl w-full p-4 md:p-6 shadow-lg border  border-gray-100 mx-auto md:h-[24rem] flex flex-col md:flex-row items-center justify-center">

      <div className="flex gap-10 flex-col md:flex-row">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 gap-6">
            <div>
              <h2 className="text-xl font-bold text-darkGray mb-1">
                Communication & Support
              </h2>
              <p className="text-xl text-brandGray">Reported Issues</p>
            </div>

            {/* Date Selector */}
            <div className="relative inline-block text-left">
              {/* Trigger */}
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
              >
                {selected}
                <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
              </div>

              {/* Dropdown Options */}
              {isOpen && (
                <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleSelect(option)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="divider-vertical border-b"></div>

          {/* Main Content Layout */}
          <div className="space-y-6">
            {/* Severity Legend */}
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
                <div className="flex justify-between items-center flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                    <span className="text-sm font-medium text-darkGray">
                      Critical
                    </span>
                  </div>
                  <span className="text-sm font-bold text-darkGray">410</span>
                </div>

                <div className="flex justify-between items-center flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-[#FF8C00]"></div>
                    <span className="text-sm font-medium text-darkGray">
                      High
                    </span>
                  </div>
                  <span className="text-sm font-bold text-darkGray">142</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between">
                <div className="flex justify-between items-center flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-[#FFD700]"></div>
                    <span className="text-sm font-medium text-darkGray">
                      Medium
                    </span>
                  </div>
                  <span className="text-sm font-bold text-darkGray">340</span>
                </div>

                <div className="flex justify-between items-center flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                    <span className="text-sm font-medium text-darkGray">
                      Low
                    </span>
                  </div>
                  <span className="text-sm font-bold text-darkGray">590</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2">
          {/* Pie Chart */}
          <div className="flex justify-center md:justify-start">
            {/* bump size up on all screens, scale further on ≥md */}
            <div className="w-64 h-64 md:w-72 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius="90%" // Let it fill the container nicely
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

          {/* Stats */}
          <div className="flex flex-col space-y-6">
            {/* Total Issues */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-greenMutedBg rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brandGreen" />
              </div>
              <div>
                <p className="text-sm text-brandGray">Total Issues</p>
                <p className="text-lg font-bold text-darkGray">120</p>
              </div>
            </div>

            {/* Pending Issues */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orangeLightBg rounded-md flex items-center justify-center">
                <HiArrowTrendingDown className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-brandGray">Pending Issues</p>
                <p className="text-lg font-bold text-darkGray">1,009,123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationSupport;
