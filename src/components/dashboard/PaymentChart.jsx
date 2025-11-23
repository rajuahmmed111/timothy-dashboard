import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { IoIosArrowDown } from "react-icons/io";
import { useGetPaymentUserAnalysisQuery } from "../../redux/api/statistics/paymentAndUserAnalisys";

// Custom tooltip
const CustomTooltip = ({ active, payload, coordinate }) => {
  if (active && payload && payload.length > 0 && coordinate) {
    const value = payload[0].value.toFixed(2).replace(".", ",");

    return (
      <div
        style={{
          position: "absolute",
          left: coordinate.x,
          top: coordinate.y - 50,
          transform: "translate(-50%, -100%)",
          background: "#FFD49D",
          borderRadius: "8px",
          padding: "8px 12px",
          fontWeight: "bold",
          color: "#000",
          fontSize: "14px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      >
        ${value}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #FFD49D",
          }}
        />
      </div>
    );
  }
  return null;
};

// Chart component
const PaymentChart = () => {
  // Generate year options (current year and previous 4-5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push((currentYear - i).toString());
  }

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isOpen, setIsOpen] = useState(false);

  // Fetch data from API
  const {
    data: apiData,
    isLoading,
    error,
  } = useGetPaymentUserAnalysisQuery(selectedYear);

  // Transform API data for chart
  const data = apiData?.data?.paymentMonthsData?.map(item => ({
    name: item.month.substring(0, 3), // Convert "January" to "Jan"
    payments: item.totalAmount
  })) || [];

  // Shadow line
  // Compute a dynamic offset (~5% of data range) so the shadow sits just below the main line
  const values = data.map(d => d.payments);
  const range = values.length ? (Math.max(...values) - Math.min(...values)) : 0;
  const yDelta = values.length ? Math.max(1, Math.round(range * 0.05)) : 0;
  const shadowData = data.map(item => ({
    ...item,
    payments: Math.max(0, item.payments - yDelta),
  }));

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-darkGray">Payment</h1>

        {/* Year Filter Dropdown */}
        {/* <div className="relative inline-block text-left">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
          >
            {selectedYear}
            <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
          </div>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg right-0">
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
        </div> */}
      </div>

      <div className="rounded-lg col-span-4 py-6 px-2 bg-white shadow">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffdf3a" />
                  <stop offset="100%" stopColor="#ffb13a" />
                </linearGradient>
              </defs>

              {/* Dashed grid */}
              <CartesianGrid strokeDasharray="6 4" stroke="#F3F4F6" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, dy: 5 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, dx: 0 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'auto']}
                tickFormatter={(value) => `${value / 1000}k`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Shadow line */}
              <Line
                type="monotone"
                data={shadowData}
                dataKey="payments"
                stroke="#ededed"
                strokeWidth={2}
                strokeOpacity={0.9}
                dot={false}
                isAnimationActive={false}
              />

              {/* Area under main line */}
              <Area
                type="monotone"
                dataKey="payments"
                stroke="none"
                fill="#FFD49D"
                fillOpacity={0.2}
              />

              {/* Main Line */}
              <Line
                type="monotone"
                dataKey="payments"
                stroke="url(#gradientLine)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#fff",
                  stroke: "#FFD49D",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentChart;
