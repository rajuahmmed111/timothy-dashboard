import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetOverviewQuery } from "../redux/api/statistics/getOverviewApi";
import { Spin } from "antd";
import OverviewCard from "./dashboard/OverviewCard"
import PaymentChart from "./dashboard/PaymentChart";
import UserAnalytics from "./dashboard/UserAnalytics";
import FinancialDashboard from "./dashboard/RevinueChart";
import CancellationRefunds from "./dashboard/CancellationRefunds";
import ContractManagement from "./dashboard/CircularProgress";
import PendingVerification from "./dashboard/PendingVerification";
import CommunicationSupport from "./dashboard/CommunicationSupport";
import UserSupportTickets from "./dashboard/UserSupportTickets";
import UserDemographics from "./dashboard/UserDemographics";

const Dashboard = () => {
  // Shared time filter for overview cards
  const timeOptions = ["Today", "This Week", "This Month", "This Year"];
  const [selectedTime, setSelectedTime] = useState("This Month");
  const timeParamMap = {
    "Today": "TODAY",
    "This Week": "THIS_WEEK",
    "This Month": "THIS_MONTH",
    "This Year": "THIS_YEAR",
  };

  const { data: overviewData, error, isLoading } = useGetOverviewQuery(
    timeParamMap[selectedTime],
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (overviewData) {
    }
    if (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [overviewData, error]);

  // Match previous data path: overviewData?.data?.Supports
  const supportData = overviewData?.data?.Supports ?? {};
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="px-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-6">
        {/* Left/Main column */}
        <div className="col-span-1 md:col-span-6 rounded-lg space-y-6">
          {/* Overview cards: 2-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <OverviewCard 
              title="Total Users" 
              value={isLoading ? <Spin size="small" /> : overviewData?.data?.totalUsers?.count} 
              growth={overviewData?.data?.totalUsers?.growth}
              showDropdown
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              timeOptions={timeOptions}
            />
            <OverviewCard 
              title="Active Contracts" 
              value={isLoading ? <Spin size="small" /> : overviewData?.data?.totalContracts?.count} 
              growth={overviewData?.data?.totalContracts?.growth}
              showDropdown
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
              timeOptions={timeOptions}
            />
          </div>

          {/* Payment and verification section (Payment visible only to SUPER_ADMIN) */}
          {isSuperAdmin ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-10 mb-10">
              <div className="md:col-span-4">
                <PaymentChart />
              </div>
              <div className="md:col-span-2">
                <PendingVerification isLoading={isLoading} overviewData={overviewData} />
              </div>
            </div>
          ) : (
           <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-10 mb-10">
              <div className="md:col-span-4">
                <div className="">
                    <h1 className="text-2xl font-semibold mb-6">User Support Tickets</h1>
                    <UserSupportTickets />
                </div>
              </div>
              <div className="md:col-span-2">
                <PendingVerification isnomaladmin={isSuperAdmin ? false : true} isLoading={isLoading} overviewData={overviewData} />
              </div>
            </div>
          )}

          <UserAnalytics />

          <UserDemographics />

          {isSuperAdmin && <FinancialDashboard />}

          <CancellationRefunds />

          <ContractManagement />
        </div>

        {/* Right/Sidebar column */}
        <div className="col-span-1 md:col-span-4 bg-white rounded-lg p-4 shadow-sm space-y-6 md:sticky md:top-24 md:h-fit min-h-fit md:min-h-0 self-start max-h-[calc(100vh-2rem)] overflow-auto">
          <CommunicationSupport 
            supportData={supportData}
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            timeOptions={timeOptions}
          />

          {isSuperAdmin && <UserSupportTickets />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    </div>
  );
};

export default Dashboard;
