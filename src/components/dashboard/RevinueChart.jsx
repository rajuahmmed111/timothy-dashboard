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
    <div className={`p-2 rounded-lg border-2 border-[#f4ece1]`}>
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
  // Time range options
  const timeOptions = ["Today", "This Week", "This Month", "This Year"];
  const [selectedTime, setSelectedTime] = useState("This Year");
  const [isOpen, setIsOpen] = useState(false);
  const timeParamMap = {
    "Today": "TODAY",
    "This Week": "THIS_WEEK",
    "This Month": "THIS_MONTH",
    "This Year": "THIS_YEAR",
  };
  
  // Fetch data from API with timeRange
  const { data: apiData, isLoading, error } = useGetFinancialMetricsQuery(timeParamMap[selectedTime]);
  
  // Transform API data for chart (use raw values; format via tick/tooltip)
  const data = apiData?.data?.paymentMonthsData?.map(item => ({
    name: item.month.substring(0, 3), // Convert "January" to "Jan"
    adminEarnings: item.adminEarnings,
    serviceEarnings: item.serviceEarnings
  })) || [];
  
  const adminEarnings = apiData?.data?.adminEarnings || 0;
  const serviceEarnings = apiData?.data?.serviceEarnings || 0;

  // Number formatting: plain numbers < 100k, compact >= 100k
  const formatNumberTick = (value) => {
    const abs = Math.abs(value);
    if (abs < 100_000) return new Intl.NumberFormat('en-US').format(value);
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  // Helpers to compute a "nice" Y-axis upper bound and step
  const getNiceMax = (n) => {
    if (!n || n <= 0) return 10;
    const pow = Math.pow(10, Math.floor(Math.log10(n)));
    const normalized = n / pow;
    let nice;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 5) nice = 5;
    else nice = 10;
    return nice * pow;
  };

  const getNiceStep = (n) => {
    const pow = Math.pow(10, Math.floor(Math.log10(n)));
    const normalized = n / pow;
    let nice;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 5) nice = 5;
    else nice = 10;
    return nice * pow;
  };

  // Derive Y-axis domain and ticks from both series
  const yValues = data.flatMap(d => [d.adminEarnings || 0, d.serviceEarnings || 0]);
  const maxY = yValues.length ? Math.max(...yValues) : 0;
  const niceMax = Math.max(10, getNiceMax(maxY)); // or getNiceMax(maxY * 1.1) for headroom
  const approxStep = niceMax / 5;
  const step = Math.max(1, Math.floor(getNiceStep(approxStep)));
  const yTicks = Array.from({ length: Math.floor(niceMax / step) }, (_, i) => (i + 1) * step).filter(t => t <= niceMax);

  const handleSelect = (option) => {
    setSelectedTime(option);
    setIsOpen(false);
  };


  return (
    <div className=" bg-grayLightBg">
      <h1 className="text-3xl font-semibold text-darkGray mb-6">
        Financial Metrics
      </h1>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-2 md:py-6 px-2 shadow-sm">
        {/* Chart Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-semibold text-brandGray ml-2">
            Revenue Overview
          </h2>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-3 sm:gap-4">
              <LegendItem color="#c3720b" label="Partners" />
              <LegendItem color="#FFC983" label="Users" />
            </div>


            {/* Time range dropdown */}
            <div className="relative inline-block text-left">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
              >
                {selectedTime}
                <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
                  {timeOptions.map((option) => (
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
        </div>

        {/* Metric Cards */}
        <div className="flex flex-col sm:flex-row mb-8 justify-start items-start gap-2 md:gap-4">
          <MetricCard
            title="All"
            value={adminEarnings}
            trend="up"
            icon={TrendingUp}
            trendColor="green"
          />
          <MetricCard
            title="Contracts"
            value={serviceEarnings}
            trend="up"
            icon={TrendingUp}
            trendColor="green"
          />
          <MetricCard
            title="Users"
            value={1009123}
            trend="down"
            icon={TrendingDown}
            trendColor="red"
          />
        </div>

        {/* Chart */}
        <div className="h-64 md:h-80">
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
                tickFormatter={formatNumberTick}
                allowDecimals={false}
                domain={[0, niceMax]}
                ticks={yTicks}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
                formatter={(value) => formatNumberTick(value)}
              />
              <Line
                type="linear"
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
                type="linear"
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
