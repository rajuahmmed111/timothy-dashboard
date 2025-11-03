import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useGetFinancialMetricsQuery } from "../../redux/api/statistics/getOverviewApi";


const MetricCard = ({ title, value, trend, icon: Icon, trendColor }) => (
  <div className="bg-white flex-row-reverse p-2 md:p-6 rounded-lg flex items-center justify-start gap-2">
    <div>
      <p className="text-brandGray text-sm font-medium mb-1">{title}</p>
      <p className="text-sm md:text-lg font-semibold text-darkGray">
        {value.toLocaleString()}
      </p>
    </div>
    <div
      className={`p-2 rounded-lg border-2 border-[#f4ece1]`}
    >
      <Icon
        className={`w-10 h-10 ${
          trendColor === "green" ? "text-brandGreen" : "text-red-600"
        }`}
      />
    </div>
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-3 h-3 rounded-full`}
      style={{ backgroundColor: color }}
    ></div>
    <span className="text-brandGray text-sm font-medium">{label}</span>
  </div>
);





const FinancialDashboard = () => {
  // Generate year options (current year and previous 4-5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push((currentYear - i).toString());
  }

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isOpen, setIsOpen] = useState(false);
  
  // Fetch data from API
  const { data: apiData, isLoading, error } = useGetFinancialMetricsQuery();
  
  // Transform API data for chart
  const data = apiData?.data?.paymentMonthsData?.map(item => ({
    name: item.month.substring(0, 3), // Convert "January" to "Jan"
    adminEarnings: item.adminEarnings / 1000, // Convert to thousands for better display
    serviceEarnings: item.serviceEarnings / 1000
  })) || [];
  
  const adminEarnings = apiData?.data?.adminEarnings || 0;
  const serviceEarnings = apiData?.data?.serviceEarnings || 0;

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };


  return (
    <div className=" bg-grayLightBg">
      <h1 className="text-3xl font-semibold text-darkGray mb-6">
        Financial Metrics
      </h1>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-2 md:p-6 shadow-sm">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-brandGray">
            Revenue Overview
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <LegendItem color="#c3720b" label="Admin Earnings" />
              <LegendItem color="#FFC983" label="Service Earnings" />
            </div>


            {/* dropdown  */}

            <div className="relative inline-block text-left">
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
      >
        {selectedYear}
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
        </div>

        {/* Metric Cards */}
        <div className="flex mb-8 justify-start gap-2">
          <MetricCard
            title="Admin Earnings"
            value={adminEarnings}
            trend="up"
            icon={TrendingUp}
            trendColor="green"
          />
          <MetricCard
            title="Service Earnings"
            value={serviceEarnings}
            trend="up"
            icon={TrendingUp}
            trendColor="green"
          />
          {/* <MetricCard
            title="Users"
            value={1009123}
            trend="down"
            icon={TrendingDown}
            trendColor="red"
          /> */}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                stroke="#f3f4f6"
                strokeDasharray="none"
                vertical={false}
                horizontal={true}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
              />
              <Line
                type="monotone"
                dataKey="adminEarnings"
                stroke="#c3720b"
                strokeWidth={3}
                dot={{ fill: "#c3720b", strokeWidth: 0, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#c3720b",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="serviceEarnings"
                stroke="#FFC983"
                strokeWidth={3}
                dot={{ fill: "#FFC983", strokeWidth: 0, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#FFC983",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
