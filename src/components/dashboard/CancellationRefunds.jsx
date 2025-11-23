import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useGetCancelRefundStatsQuery } from "../../redux/api/statistics/cancelRefundApi";

// Inline SVG icons to match the provided arrow style
const ArrowUpIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 19V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDownIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 14L12 19L17 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MinusIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MetricCard = ({
  title,
  value,
  percentage,
  dropdown = true,
  selectedTime,
  onTimeChange,
  timeOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onTimeChange(option);
    setIsOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-brandGray text-sm font-medium">{title}</h3>

        {dropdown && (
          <div className="relative inline-block text-left">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center text-xs text-brandGray bg-grayLightBg px-3 py-1.5 rounded-full border cursor-pointer"
            >
              {selectedTime}
              <IoIosArrowDown className="ml-1 text-brandGray" size={12} />
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-1 w-36 bg-white border rounded-md shadow-lg right-0">
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
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="text-xl font-bold text-darkGray">
          {typeof value === "string" ? value : value.toLocaleString()}
        </div>
        {(() => {
          const pctStr = String(percentage ?? "0");
          const numeric = parseFloat(pctStr.replace("%", ""));
          const isPositive = Number.isFinite(numeric) && numeric >= 0;
          const isNegative = Number.isFinite(numeric) && numeric < 0;
          const trendLabel = pctStr;

          const pillBase = "inline-flex items-center gap-2 px-3 py-1 rounded-full";
          const pillColor = isPositive
            ? "text-brandGreen bg-greenMutedBg"
            : isNegative
            ? "text-brandRed bg-redMutedBg"
            : "text-brandGray bg-gray-100";

          return (
            <div className={`${pillBase} ${pillColor}`}>
              {isPositive ? (
                <ArrowUpIcon className="w-6 h-6" />
              ) : isNegative ? (
                <ArrowDownIcon className="w-6 h-6" />
              ) : (
                <MinusIcon className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{trendLabel}</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

const CancellationRefunds = () => {
  // Time range filter options
  const timeOptions = ["Today", "This Week", "This Month", "This Year"];
  const [selectedTime, setSelectedTime] = useState("This Month");
  const timeParamMap = {
    "Today": "TODAY",
    "This Week": "THIS_WEEK",
    "This Month": "THIS_MONTH",
    "This Year": "THIS_YEAR",
  };

  // Fetch data from API
  const {
    data: apiData,
    isLoading,
    error,
  } = useGetCancelRefundStatsQuery(timeParamMap[selectedTime]);

  const canceledCount = apiData?.data?.canceledCount || 0;
  const refundAmount = apiData?.data?.refundAmount || 0;
  const cancelRate = apiData?.data?.cancelRate || 0;
  // Growth values from API
  const canceledCountGrowth = apiData?.data?.canceledCountGrowth ?? 0;
  const refundAmountGrowth = apiData?.data?.refundAmountGrowth ?? 0;
  const cancelRateGrowth = apiData?.data?.cancelRateGrowth ?? 0;

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="bg-grayLightBg">
      <h1 className="text-2xl font-semibold text-darkGray mb-6">
        Cancellation & Refunds
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Cancelled Jobs" 
          value={canceledCount} 
          percentage={`${Number(apiData?.data?.canceledCountGrowth).toFixed(1)}%`}
          selectedTime={selectedTime}
          onTimeChange={handleTimeChange}
          timeOptions={timeOptions}
        />
        <MetricCard 
          title="Refunded Amount" 
          value={refundAmount} 
          percentage={`${Number(apiData?.data?.refundAmountGrowth).toFixed(1)}%`}
          selectedTime={selectedTime}
          onTimeChange={handleTimeChange}
          timeOptions={timeOptions}
        />
        <MetricCard 
          title="Cancel Rate" 
          value={`${cancelRate.toFixed(1)}%`} 
          percentage={`${Number(apiData?.data?.cancelRateGrowth).toFixed(1)}%`}
          selectedTime={selectedTime}
          onTimeChange={handleTimeChange}
          timeOptions={timeOptions}
        />
      </div>
    </div>
  );
};

export default CancellationRefunds;
