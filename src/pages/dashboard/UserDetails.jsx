import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Result } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Components
import UserProfileHeader from "../../components/dashboard/UserProfileHeader";
import PersonalInfoSection from "../../components/dashboard/PersonalInfoSection";
import TransactionTable from "../../components/dashboard/TransactionTable";
import FinanceSummaryCards from "../../components/dashboard/FinanceSummaryCards";
import TabNavigation from "../../components/dashboard/TabNavigation";
import UserChannels from "../../components/dashboard/UserChannels";

// Redux
import {
  getSingleUser,
  getUserFinances,
  getProviderFinances,
} from "../../redux/features/user/getSIngleUserSlice";

const UserDetails = () => {
  // Mock id for demonstration - in your actual app, use useParams()
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const {
    singleUser,
    loading,
    error,
    userFinances,
    financesLoading,
    financesError,
  } = useSelector((state) => state.singleUser);

  useEffect(() => {
    if (id) {
      dispatch(getSingleUser(id));
    }
  }, [id, dispatch]);

  // Fetch user finances when finance or profile tab is active
  useEffect(() => {
    if ((activeTab === "finance" || activeTab === "profile") && id) {
      const userRole = singleUser?.data?.role;

      if (userRole === "BUSINESS_PARTNER") {
        dispatch(
          getProviderFinances({ providerId: id, page: currentPage, limit: 10 })
        );
      } else {
        dispatch(getUserFinances({ userId: id, page: currentPage }));
      }
    }
  }, [activeTab, id, currentPage, singleUser?.data?.role, dispatch]);

  // console.log(singleUser);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          tip="Fetching user details..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-10">
        <Result status="error" title="Failed to Fetch User" subTitle={error} />
      </div>
    );
  }

  const userData = {
    id: singleUser?.data?.id,
    name: singleUser?.data?.fullName,
    email: singleUser?.data?.email,
    phone: singleUser?.data?.contactNumber || "N/A",
    status: singleUser?.data?.status || "N/A",
    joinDate: new Date(singleUser?.data?.createdAt).toLocaleDateString(),
    profileImage:
      singleUser?.data?.profileImage || "https://via.placeholder.com/100",
    address: singleUser?.data?.address || "Not Provided",
    role: singleUser?.data?.role || "N/A",
    lastLogin: singleUser?.data?.updatedAt || "N/A",
  };


  // Finance data from API - conditional based on user role
  const userRole = singleUser?.data?.role;
  const financeData =
    userRole === "BUSINESS_PARTNER"
      ? {
          earnings: userFinances?.data?.totalServiceFee || 0,
          cleared: userFinances?.data?.totalServiceFee || 0,
        }
      : {
          expenses: userFinances?.data?.totalUserExpense || 0,
          cleared: userFinances?.data?.totalUserExpense || 0,
        };


  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <UserProfileHeader userData={userData} />
      <PersonalInfoSection userData={userData} />
      
      <div>
        <h3 className="text-lg font-semibold text-darkGray mb-4">
          Transaction History
        </h3>
        <TransactionTable
          userFinances={userFinances}
          financesLoading={financesLoading}
          financesError={financesError}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={5}
          showTotal={false}
          size="small"
        />
      </div>
    </div>
  );

  const renderFinanceTab = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-darkGray mb-6">Finances</h2>

        <FinanceSummaryCards userRole={userRole} financeData={financeData} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-darkGray mb-4">
            Transaction History
          </h3>
          <TransactionTable
            userFinances={userFinances}
            financesLoading={financesLoading}
            financesError={financesError}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={10}
            showTotal={true}
          />
        </div>
      </div>
    );
  };

  const renderMessagesTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-darkGray mb-6">Messages</h2>
      <UserChannels userId={userData.id} userName={userData.name} />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "finance":
        return renderFinanceTab();
      case "messages":
        return renderMessagesTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-lightGray p-6 font-sans">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-darkGray mb-2">
            User Details
          </h1>
          <p className="text-brandGray">
            Comprehensive view of user information and activity
          </p>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserDetails;
