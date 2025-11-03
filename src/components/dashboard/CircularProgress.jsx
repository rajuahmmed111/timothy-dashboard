import React, { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { useGetCancelRefundStatsQuery } from "../../redux/api/statistics/cancelRefundApi";

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
  selectedYear,
  onYearChange,
  yearOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (year) => {
    onYearChange(year);
    setIsOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      {/* Header + filter */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-darkGray font-medium text-sm">{title}</h3>

        {/* Year Filter dropdown */}
        <div className="relative inline-block text-left">
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
        <div className="flex items-center gap-1 text-brandGreen">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{growth}</span>
        </div>
      </div>
    </div>
  );
};

/* -------- Page component -------- */
const ContractManagement = () => {
  // Generate year options (current year and previous 4-5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push((currentYear - i).toString());
  }

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  // Fetch data from API
  const { data: apiData, isLoading, error } = useGetCancelRefundStatsQuery(selectedYear);
  
  const totalContracts = apiData?.data?.totalContracts || 0;
  const totalPending = apiData?.data?.totalPending || 0;
  const totalConfirmed = apiData?.data?.totalConfirmed || 0;
  const pendingRate = apiData?.data?.pendingRate || 0;
  const confirmedRate = apiData?.data?.confirmedRate || 0;
  const cancelRate = apiData?.data?.cancelRate || 0;

  const handleYearChange = (year) => {
    setSelectedYear(year);
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
            title="Total Contracts"
            percentage={100}
            value={totalContracts}
            growth={`${totalContracts > 0 ? '+' : ''}${totalContracts}`}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            yearOptions={yearOptions}
          />
          <ContractCard
            title="Confirmed"
            percentage={Math.round(confirmedRate)}
            value={totalConfirmed}
            growth={`${confirmedRate.toFixed(1)}%`}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            yearOptions={yearOptions}
          />
          <ContractCard
            title="Pending"
            percentage={Math.round(pendingRate)}
            value={totalPending}
            growth={`${pendingRate.toFixed(1)}%`}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            yearOptions={yearOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractManagement;
