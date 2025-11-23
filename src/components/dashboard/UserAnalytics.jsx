import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TrendingUp } from "lucide-react";
import { HiArrowTrendingDown } from "react-icons/hi2";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useGetPaymentUserAnalysisQuery } from "../../redux/api/statistics/paymentAndUserAnalisys";

const UserAnalytics = ({
  title = "User Analytics",
  subtitle = "User Growth",
  showDropdown = false,
}) => {
  // Time-range filter (default by year)
  const timeOptions = ["Today", "This Week", "This Month", "This Year"];
  const [selectedTime, setSelectedTime] = useState("This Year");
  const [open, setOpen] = useState(false);
  const timeParamMap = {
    "Today": "TODAY",
    "This Week": "THIS_WEEK",
    "This Month": "THIS_MONTH",
    "This Year": "THIS_YEAR",
  };
  
  // Fetch data from API
  const { data: apiData, isLoading, error } = useGetPaymentUserAnalysisQuery(timeParamMap[selectedTime]);
  
  // Transform API data for chart (single series: users)
  const transformedData = apiData?.data?.userMonthsData?.map(item => ({
    name: item.month.substring(0, 3), // Convert "January" to "Jan"
    value: item.userCount,
  })) || [];
  
  const usersCount = apiData?.data?.totalUsers || 0;
  const partnersCount = apiData?.data?.totalPartners || 0;

  // Helpers to compute a "nice" Y-axis upper bound and ticks
  const getNiceMax = (n) => {
    if (!n || n <= 0) return 10; // minimum headroom to make small series visible
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

  // Derive Y-axis domain and ticks from data
  const yValues = transformedData.map(d => d.value || 0);
  const maxY = yValues.length ? Math.max(...yValues) : 0;
  const niceMax = Math.max(10, getNiceMax(maxY));
  const approxStep = niceMax / 5;
  const step = Math.max(1, Math.floor(getNiceStep(approxStep)));
  const yTicks = Array.from({ length: Math.floor(niceMax / step) }, (_, i) => (i + 1) * step).filter(t => t <= niceMax);

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

  // no separate year selector; using time-range only

  // Format large numbers for Y-axis ticks (e.g., 10000 -> 10k)
  const formatNumberTick = (value) => {
    const abs = Math.abs(value);
    // Plain numbers under 100k with locale separators
    if (abs < 100_000) {
      return new Intl.NumberFormat('en-US').format(value);
    }
    // Compact notation (K/M/B) at 100k and above
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };


  return (
    <div>
      <h3 className="text-2xl mb-6 font-semibold text-gray-800">{title}</h3>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6">
          <h3 className="text-lg font-semibold text-gray-600">{subtitle}</h3>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center text-xs text-brandGray bg-gray-50 px-3 py-1.5 rounded-full border"
            >
              {selectedTime}
              <IoIosArrowDown className="ml-1 text-gray-400" size={12} />
            </button>
            {open && (
              <div className="absolute right-0 z-10 mt-1 w-36 bg-white border rounded-md shadow-lg">
                {timeOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setSelectedTime(opt);
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center px-6 py-6 gap-8">
          {/* Chart Section */}
          <div className="flex-[0.86] h-56 md:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA500" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical horizontal={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={formatNumberTick}
                  allowDecimals={false}
                  domain={[0, niceMax]}
                  ticks={yTicks}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#FFA500" strokeWidth={2} fillOpacity={1} fill="url(#colorGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-60 bg-gray-300" />

          {/* Stats Section */}
          <div className="flex-[0.14] flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Partners</p>
                <p className="text-sm font-bold text-gray-900">{partnersCount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <HiArrowTrendingDown className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Users</p>
                <p className="text-sm font-bold text-gray-900">{usersCount.toLocaleString()}</p>
              </div>
            </div>
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