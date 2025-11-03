import React, { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { useGetCancelRefundStatsQuery } from "../../redux/api/statistics/cancelRefundApi";

const MetricCard = ({ title, value, percentage, dropdown = true, selectedYear, onYearChange, yearOptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (year) => {
    onYearChange(year);
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
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-darkGray">
          {typeof value === "string" ? value : value.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-brandGreen">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{percentage}</span>
        </div>
      </div>
    </div>
  );
};

const CancellationRefunds = () => {
  // Generate year options (current year and previous 4-5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i < 5; i++) {
    yearOptions.push((currentYear - i).toString());
  }

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  // Fetch data from API
  const { data: apiData, isLoading, error } = useGetCancelRefundStatsQuery(selectedYear);
  
  const canceledCount = apiData?.data?.canceledCount || 0;
  const refundAmount = apiData?.data?.refundAmount || 0;
  const cancelRate = apiData?.data?.cancelRate || 0;

  const handleYearChange = (year) => {
    setSelectedYear(year);
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
          percentage={`${cancelRate.toFixed(1)}%`}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          yearOptions={yearOptions}
        />
        <MetricCard 
          title="Refunded Amount" 
          value={refundAmount} 
          percentage={`${cancelRate.toFixed(1)}%`}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          yearOptions={yearOptions}
        />
        <MetricCard 
          title="Cancel Rate" 
          value={`${cancelRate.toFixed(1)}%`} 
          percentage={`${cancelRate.toFixed(1)}%`}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          yearOptions={yearOptions}
        />
      </div>
    </div>
  );
};

export default CancellationRefunds;
