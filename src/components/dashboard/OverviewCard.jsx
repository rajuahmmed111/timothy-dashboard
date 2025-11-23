import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
const OverviewCard = ({ title, value, growth, showDropdown = false, selectedTime = "This Month", onTimeChange, timeOptions = ["Today", "This Week", "This Month", "This Year"] }) => {
  // local dropdown open state; selection comes from parent
  const [open, setOpen] = useState(false);

  const isNumber = typeof growth === "number";
  const isPositive = isNumber && growth >= 0;
  const isNegative = isNumber && growth < 0;
  const isNeutral = isNumber && growth === 0;

  const arrow = isPositive ? "↑" : isNegative ? "↓" : "↑";
  const percent = isNumber ? Math.abs(growth) : null;
  const trendLabel = isNumber ? `${arrow} ${percent}%` : "--";

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-brandGray text-sm font-medium">{title}</h3>
        {showDropdown && (
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
                      onTimeChange && onTimeChange(opt);
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
        )}
      </div>
      <div className="flex justify-between items-end mt-5">
        <span className="text-2xl font-bold text-darkGray">{value}</span>
        <span
          className={`text-sm ${
            isPositive
              ? "text-brandGreen bg-greenMutedBg p-2 rounded-lg"
              : isNegative
              ? "text-brandRed bg-redMutedBg p-2 rounded-lg"
              : "text-brandGray bg-gray-100 p-2 rounded-lg"
          }`}
        >
          {trendLabel}
        </span>
      </div>
    </div>
  );
};

export default OverviewCard;
