import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LuUsers } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useGetPaymentUserAnalysisQuery } from "../../redux/api/statistics/paymentAndUserAnalisys";

const UserAnalytics = ({
  title = "User Analytics",
  subtitle = "User Growth",
}) => {
  // Generate year options (current year and previous 4-5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push((currentYear - i).toString());
  }

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedPartnerYear, setSelectedPartnerYear] = useState(currentYear.toString());
  
  // Fetch data from API
  const { data: apiData, isLoading, error } = useGetPaymentUserAnalysisQuery(selectedYear);
  
  // Transform API data for charts
  const transformedData = apiData?.data?.userMonthsData?.map(item => ({
    name: item.month.substring(0, 3), // Convert "January" to "Jan"
    users: item.userCount,
    partners: item.partnerCount
  })) || [];
  
  const usersCount = apiData?.data?.totalUsers || 0;
  const partnersCount = apiData?.data?.totalPartners || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded border text-sm">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const [isOpenPartner, setIsOpenPartner] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectPartner = (year) => {
    setSelectedYear(year);
    setIsOpenPartner(false);
  }; 


  const handleSelect = (year) => {
    setSelectedPartnerYear(year);
    setIsOpen(false);
  }; 


  return (
    <div>
      <h3 className="text-2xl mb-6 font-semibold text-gray-800">{title}</h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Users Box */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <LuUsers className="w-5 h-5 text-[#ffc983]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Users</h3>
                <p className="text-sm text-gray-500">Growth Analytics</p>
              </div>
            </div>

            {/* dropdown  */}

            <div className="relative inline-block text-left">
              {/* Trigger */}
              <div
                onClick={() => setIsOpenPartner(!isOpenPartner)}
                className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
              >
                {selectedYear}
                <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
              </div>

              {/* Dropdown Options */}
              {isOpenPartner && (
                <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
                  {yearOptions.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleSelectPartner(year)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-800">
                {usersCount.toLocaleString()}
              </p>
              {/* <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>12.5%</span>
              </div> */}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total active users</p>
          </div>

          {/* Chart */}
          <div className="h-48 px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transformedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="userGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ffc983" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffc983" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#ffc983"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partners Box */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <LuUsers className="w-5 h-5 text-[#c3720b]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Partners</h3>
                <p className="text-sm text-gray-500">Growth Analytics</p>
              </div>
            </div>

            {/* Dropdown  */}

            <div className="relative inline-block text-left">
              {/* Trigger */}
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
              >
                {selectedPartnerYear}
                <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
              </div>

              {/* Dropdown Options */}
              {isOpen && (
                <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
                  {yearOptions.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleSelect(year)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-800">
                {partnersCount.toLocaleString()}
              </p>
              {/* <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>8.2%</span>
              </div> */}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total active partners</p>
          </div>

          {/* Chart */}
          <div className="h-48 px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transformedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="partnerGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#c3720b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c3720b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="partners"
                  stroke="#c3720b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#partnerGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

UserAnalytics.defaultProps = {
  title: "User Analytics",
  subtitle: "User Growth",
};

export default UserAnalytics;