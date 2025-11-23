import { DollarSign } from "lucide-react";

const FinanceSummaryCards = ({ userRole, financeData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {userRole === "BUSINESS_PARTNER" ? (
        <>
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-brandGreen">
                Earnings
              </h3>
              <DollarSign className="w-5 h-5 text-brandGreen" />
            </div>
            <p className="text-2xl font-bold text-green-900">
              ${financeData.earnings.toLocaleString()}
            </p>
          </div>

          <div className="bg-blueLightBg rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-800">
                Cleared Balance
              </h3>
              <DollarSign className="w-5 h-5 text-brandBlue" />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              ${financeData.cleared.toLocaleString()}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-red-800">Expenses</h3>
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-900">
              ${financeData.expenses.toLocaleString()}
            </p>
          </div>

          <div className="bg-blueLightBg rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-800">
                Cleared Balance
              </h3>
              <DollarSign className="w-5 h-5 text-brandBlue" />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              ${financeData.cleared.toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceSummaryCards;
