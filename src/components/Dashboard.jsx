import React, { useEffect } from "react";
import { useGetOverviewQuery } from "../redux/api/statistics/getOverviewApi";
import { Spin } from "antd";
// import OverviewCard from "./dashboard/OverviewCard";
// import PaymentChart from "@/components/dashboard/PaymentChart";
// import PendingVerification from "@/components/dashboard/PendingVerification";
// import CommunicationSupport from "@/components/dashboard/CommunicationSupport";
// import UserSupportTickets from "@/components/dashboard/UserSupportTickets";

// import OverviewCard from "./Dashboard/OverviewCard";
import OverviewCard from "./dashboard/OverviewCard"
import PaymentChart from "./dashboard/PaymentChart";
import UserAnalytics from "./dashboard/UserAnalytics";
import FinancialDashboard from "./dashboard/RevinueChart";
import CancellationRefunds from "./dashboard/CancellationRefunds";
import ContractManagement from "./dashboard/CircularProgress";
import CommAndverification from "../pages/dashboard/CommunicationAndVerify/CommAndverification";

const Dashboard = () => {
  const { data: overviewData, error, isLoading } = useGetOverviewQuery();

  useEffect(() => {
    if (overviewData) {
      // console.log('Statistics Overview Data:', overviewData);
    }
    if (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [overviewData, error]);

  return (
    <div className="md:px-6 px-1 bg-grayLightBg min-h-screen font-sans">
      <h1 className="text-2xl font-semibold mb-6 text-darkGray">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-6">
        <div className="col-span-1 md:col-span-10 rounded-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <OverviewCard 
              title="Total Users" 
              value={isLoading ? <Spin size="small" /> : overviewData?.data?.totalUsers} 
              trend="↑ 20%" 
            />
            <OverviewCard
              title="Total Service Providers"
              value={isLoading ? <Spin size="small" /> : overviewData?.data?.totalPartners}
              trend="↑ 20%"
            />
            <OverviewCard 
              title="Total Contracts" 
              value={isLoading ? <Spin size="small" /> : overviewData?.data?.totalContracts} 
              trend="↓ 5%" 
            />
            <OverviewCard 
              title="Admin Earnings" 
              value={isLoading ? <Spin size="small" /> : `$${overviewData?.data?.adminEarnings}`} 
              trend="↑ 5%" 
            />
          </div>

          
            <CommAndverification isLoading={isLoading} overviewData={overviewData}></CommAndverification>

          {/* payment and verification section */}
          <div className="w-full grid grid-cols-6 gap-6">
            <PaymentChart />
            {/* <div className="h-full rounded-lg col-span-2">
              <PendingVerification />
            </div> */}
          </div>


          <UserAnalytics></UserAnalytics>

          <FinancialDashboard></FinancialDashboard>

          <CancellationRefunds></CancellationRefunds>

          <ContractManagement></ContractManagement>
        </div>

        {/* <div className="col-span-1 md:col-span-4 bg-white rounded-lg p-4 shadow-sm space-y-6">
          <CommunicationSupport />

          <UserSupportTickets />
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    </div>
  );
};

export default Dashboard;
