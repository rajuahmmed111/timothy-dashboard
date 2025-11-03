import { useState } from "react";
import { User, DollarSign, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import UserMessage from "./userSupport/UserMessage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getSingleUser,
  getUserFinances,
  getProviderFinances,
} from "../../redux/features/user/getSIngleUserSlice";

import { Spin, Alert, Result, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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

  // Mock transaction data
  const transactions = [
    {
      id: 1,
      date: "12 Nov 2023",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel earum tenetur qui in commodo.",
      type: "Gift box",
      code: "GIFT001",
      amount: 240,
      status: "completed",
    },
    {
      id: 2,
      date: "15 Nov 2023",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel earum tenetur qui in commodo.",
      type: "Gift box",
      code: "GIFT002",
      amount: 340,
      status: "pending",
    },
    {
      id: 3,
      date: "18 Nov 2023",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel earum tenetur qui in commodo.",
      type: "Gift box",
      code: "GIFT003",
      amount: 520,
      status: "completed",
    },
    {
      id: 4,
      date: "20 Nov 2023",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel earum tenetur qui in commodo.",
      type: "Gift box",
      code: "GIFT004",
      amount: 180,
      status: "failed",
    },
    {
      id: 5,
      date: "22 Nov 2023",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel earum tenetur qui in commodo.",
      type: "Gift box",
      code: "GIFT005",
      amount: 420,
      status: "completed",
    },
  ];

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-brandGreen";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-brandGray";
    }
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-8">
        <img
          src={userData.profileImage}
          alt={userData.name}
          className="w-20 h-20 rounded-full mr-6"
        />
        <div>
          <h2 className="text-2xl font-bold text-darkGray">{userData.name}</h2>
          <p className="text-brandGray">{userData.email}</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
              userData.status === "Active"
                ? "bg-greenMutedBg text-brandGreen"
                : "bg-redMutedBg text-red-800"
            }`}
          >
            {userData.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-darkGray mb-4">
            Personal Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-brandGray">User ID:</span>
              <span className="ml-2 text-darkGray">{userData.id}</span>
            </div>
            <div>
              <span className="text-brandGray">User Role:</span>
              <span className="ml-2 text-darkGray">{userData.role}</span>
            </div>
            <div>
              <span className="text-brandGray">Phone:</span>
              <span className="ml-2 text-darkGray">{userData.phone}</span>
            </div>
            <div>
              <span className="text-brandGray">Join Date:</span>
              <span className="ml-2 text-darkGray">{userData.joinDate}</span>
            </div>
            <div>
              <span className="text-brandGray">Last Login:</span>
              <span className="ml-2 text-darkGray">{userData.lastLogin}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-darkGray mb-4">Address</h3>
          <p className="text-brandGray">{userData.address}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-darkGray mb-4">
          Transaction History
        </h3>

        {financesLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" tip="Loading transactions..." />
          </div>
        ) : financesError ? (
          <Alert
            message="Error"
            description={financesError}
            type="error"
            showIcon
          />
        ) : (
          <Table
            columns={[
              {
                title: "Date",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (date) => new Date(date).toLocaleDateString(),
                width: 120,
              },
              {
                title: "Service Type",
                dataIndex: "serviceType",
                key: "serviceType",
                width: 120,
              },
              {
                title: "Transaction ID",
                dataIndex: "id",
                key: "id",
                width: 200,
                render: (id) => <span className="font-mono text-sm">{id}</span>,
              },
              {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
                render: (amount, record) => (
                  <span className="font-semibold">
                    {amount.toLocaleString()} {record.currency?.toUpperCase()}
                  </span>
                ),
                width: 120,
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : status === "REFUNDED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {status}
                  </span>
                ),
                width: 100,
              },
            ]}
            dataSource={userFinances?.data?.data || []}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: 5, // Smaller page size for profile tab
              total: userFinances?.data?.meta?.total || 0,
              onChange: (page) => setCurrentPage(page),
              showSizeChanger: false,
              size: "small",
            }}
            scroll={{ x: 700 }}
            className="border rounded-lg"
            size="small"
          />
        )}
      </div>
    </div>
  );

  const renderFinanceTab = () => {
    // Define columns for the finance table
    const financeColumns = [
      {
        title: "Transaction ID",
        dataIndex: "id",
        key: "id",
        width: 150,
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleDateString(),
        width: 120,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount, record) =>
          `${amount.toLocaleString()} ${record.currency?.toUpperCase()}`,
        width: 120,
      },
      {
        title: "Service Type",
        dataIndex: "serviceType",
        key: "serviceType",
        width: 120,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "PAID"
                ? "bg-green-100 text-green-800"
                : status === "REFUNDED"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        ),
        width: 100,
      },
      {
        title: "Payment Method",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        width: 120,
      },
      {
        title: "Provider",
        dataIndex: "provider",
        key: "provider",
        width: 100,
      },
      {
        title: "Admin Commission",
        dataIndex: "admin_commission",
        key: "admin_commission",
        render: (commission) => commission?.toLocaleString() || 0,
        width: 130,
      },
    ];

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-darkGray mb-6">Finances</h2>

        {/* Finance Summary Cards */}
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

          {/* <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-800">
                Available Balance
              </h3>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">
              ${financeData.availableBalance.toLocaleString()}
            </p>
          </div> */}
        </div>

        {/* Finance Transactions Table */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-darkGray mb-4">
            Transaction History
          </h3>

          {financesLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" tip="Loading transactions..." />
            </div>
          ) : financesError ? (
            <Alert
              message="Error"
              description={financesError}
              type="error"
              showIcon
            />
          ) : (
            <Table
              columns={financeColumns}
              dataSource={userFinances?.data?.data || []}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: userFinances?.data?.meta?.total || 0,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`,
              }}
              scroll={{ x: 1000 }}
              className="border rounded-lg"
            />
          )}
        </div>
      </div>
    );
  };

  const renderMessagesTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-darkGray mb-6">Messages</h2>
      {/* <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-brandGray mx-auto mb-4" />
        <h3 className="text-lg font-medium text-darkGray mb-2">
          User ID: {userData.id}
        </h3>
        <p className="text-brandGray">
          Message functionality for user {userData.id}
        </p>
      </div> */}

      <UserMessage></UserMessage>
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === "profile"
                  ? "text-yellow-500 border-b-2 border-orangePrimary"
                  : "text-brandGray hover:text-darkGray"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("finance")}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === "finance"
                  ? "text-yellow-500 border-b-2 border-orangePrimary"
                  : "text-brandGray hover:text-darkGray"
              }`}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Finance
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === "messages"
                  ? "text-yellow-500 border-b-2 border-orangePrimary"
                  : "text-brandGray hover:text-darkGray"
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserDetails;
