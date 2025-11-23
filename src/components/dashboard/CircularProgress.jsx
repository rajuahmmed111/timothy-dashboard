import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useGetCancelRefundStatsQuery } from "../../redux/api/statistics/cancelRefundApi";

// Inline SVG icons to match the arrow style used elsewhere
const ArrowUpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 14L12 19L17 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MinusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------- CircularProgress (unchanged) -------- */
const CircularProgress = ({ percentage, size = 80 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f59e0b"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-brandGray">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

/* -------- ContractCard with dropdown -------- */
const ContractCard = ({
  title,
  percentage,
  value,
  growth,
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
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      {/* Header + filter */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-darkGray font-medium text-sm">{title}</h3>

        {/* Time Filter dropdown */}
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
      </div>

      {/* Circular progress */}
      <div className="flex flex-col items-center mb-6">
        <CircularProgress percentage={percentage} />
      </div>

      {/* Value + growth */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-darkGray">
          {value.toLocaleString()}
        </div>
        {(() => {
          const label = String(growth ?? "0");
          const numeric = parseFloat(label.replace("%", "").replace("+", ""));
          const isPositive = Number.isFinite(numeric) && numeric >= 0; // zero counts as positive per requirement
          const isNegative = Number.isFinite(numeric) && numeric < 0;

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
              <span className="text-sm font-medium">{label}</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

/* -------- Page component -------- */
const ContractManagement = () => {
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
  const { data: apiData, isLoading, error } = useGetCancelRefundStatsQuery(timeParamMap[selectedTime]);
  
  const totalContracts = apiData?.data?.totalContracts || 0;
  const totalPending = apiData?.data?.totalPending || 0;
  const totalConfirmed = apiData?.data?.totalConfirmed || 0;
  const pendingRate = apiData?.data?.pendingRate || 0;
  const confirmedRate = apiData?.data?.confirmedRate || 0;
  const cancelRate = apiData?.data?.cancelRate || 0;
  // Growth values from API
  const totalContractsGrowth = apiData?.data?.totalContractsGrowth ?? 0;
  const totalPendingGrowth = apiData?.data?.totalPendingGrowth ?? 0;
  const totalConfirmedGrowth = apiData?.data?.totalConfirmedGrowth ?? 0;
  const pendingRateGrowth = apiData?.data?.pendingRateGrowth ?? 0;
  const confirmedRateGrowth = apiData?.data?.confirmedRateGrowth ?? 0;

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="bg-grayLightBg">
      <h1 className="text-2xl font-semibold text-darkGray mb-6">
        Contract Management
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-brandGray font-medium mb-6">Contract Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContractCard
            title="Active Contracts"
            percentage={100}
            value={totalContracts}
            growth={`${Number(totalContractsGrowth).toFixed(1)}%`}
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            timeOptions={timeOptions}
          />
          <ContractCard
            title="Completed"
            percentage={Math.round(confirmedRate)}
            value={totalConfirmed}
            growth={`${Number(confirmedRateGrowth).toFixed(1)}%`}
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            timeOptions={timeOptions}
          />
          <ContractCard
            title="Pending"
            percentage={Math.round(pendingRate)}
            value={totalPending}
            growth={`${Number(pendingRateGrowth).toFixed(1)}%`}
            selectedTime={selectedTime}
            onTimeChange={handleTimeChange}
            timeOptions={timeOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractManagement;
