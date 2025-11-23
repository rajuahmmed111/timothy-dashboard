import { useState } from "react";
import {
  MessageCircle,
  User,
  Calendar,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import AdminProfile from "../components/AdminProfile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGetSupportsQuery, useUpdateSupportStatusMutation } from "../../../redux/api/support/supportApi";
import { useSendMessageToUserMutation } from "../../../redux/api/chat/getAllMSGApi";
import { Table, Modal } from "antd";

const UserSupport = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedTime, setSelectedTime] = useState("Critical");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");

  // API call for support tickets
  const { data: supportData, isLoading, error, refetch } = useGetSupportsQuery({
    limit: 10,
    page: currentPage,
    supportType: selectedTime,
  });

  // Mutation for updating support status
  const [updateSupportStatus, { isLoading: isUpdating }] = useUpdateSupportStatusMutation();
  // Mutation to create/open channel by sending default message
  const [sendMessageToUser, { isLoading: isCreatingChannel }] = useSendMessageToUserMutation();

  const supports = supportData?.data?.data || [];
  const totalSupports = supportData?.data?.meta?.total || 0;

  const handleUserClick = (userId) => {
    console.log("User ID:", userId);
  };

  const handleOpenChat = async (userId) => {
    if (!userId) return;
    try {
      const formData = new FormData();
      // According to API: body form-data with messageImages (file) and data as text containing {"message": "..."}
      // We are not attaching an image by default.
      formData.append("data", JSON.stringify({ "message" : "we are working with your metter " }));
      const res = await sendMessageToUser({ userId, formData }).unwrap();
      console.log("res", res);
      const channel = res?.data?.[0];
      const channelName = channel?.channelName;
      if (channelName) {
        navigate(`/dashboard/all-messages/${channelName}`);
      }
    } catch (err) {
      console.error("Failed to create/open channel:", err);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'text-yellow-600 bg-yellow-100',
      'Resolved': 'text-green-600 bg-green-100',
      'In Progress': 'text-blue-600 bg-blue-100',
      'Closed': 'text-gray-600 bg-gray-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  };

  // Get support type color
  const getSupportTypeColor = (type) => {
    const typeColors = {
      'Critical': 'text-red-600 bg-red-100',
      'High': 'text-orange-600 bg-orange-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'Low': 'text-green-600 bg-green-100'
    };
    return typeColors[type] || 'text-gray-600 bg-gray-100';
  };

  // Handle status update with confirmation
  const handleStatusUpdate = async (supportId, currentStatus) => {
    const statusCycle = {
      'Pending': 'In Progress',
      'In Progress': 'Resolved',
      'Resolved': 'Closed',
      'Closed': 'Pending'
    };
    
    const newStatus = statusCycle[currentStatus] || 'In Progress';
    
    // Show Ant Design confirmation modal
    Modal.confirm({
      title: 'Update Support Status',
      content: `Are you sure you want to update status from "${currentStatus}" to "${newStatus}"?`,
      okText: 'Yes, Update',
      cancelText: 'Cancel',
      onOk: async () => {
        setUpdatingId(supportId);
        
        try {
          await updateSupportStatus({ supportId, status: newStatus }).unwrap();
          // Refetch data to update the table
          refetch();
        } catch (error) {
          console.error('Failed to update support status:', error);
        } finally {
          setUpdatingId(null);
        }
      },
    });
  };

  // Auto filter trigger
  useEffect(() => {
    handleSelect();
  }, [selectedTime, selectedCountry, searchTerms]);

  const handleSelect = () => {
    console.log("Filter Applied:", {
      time: selectedTime,
      country: selectedCountry,
      search: searchTerms,
    });
  };

  return (
    <div className="px-0 md:px-6 bg-grayLightBg min-h-screen font-sans space-y-6">
      <AdminProfile headingText={`User Support`}></AdminProfile>

      <div className=" px-2 md:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-darkGray">
            Tickets
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
            {/* Time Filter */}
            {/* <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select> */}
            {/* Time Filter */}
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Country Filter */}
            {/* 
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="" disabled>
                Select Country
              </option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ae">United Arab Emirates</option>
              <option value="pt">Portugal</option>
              <option value="fr">France</option>
              <option value="es">Spain</option>
            </select>
            */}


          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Table */}
          <div className="overflow-scroll w-[20rem] md:w-full mx-auto">
            <Table
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id",
                  render: (id) => id?.slice(-8) || 'N/A'
                },
                {
                  title: "Subject",
                  dataIndex: "subject",
                  key: "subject",
                  render: (subject) => (
                    <span className="font-medium">{subject}</span>
                  )
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                  render: (description) => (
                    <div className="max-w-xs truncate" title={description}>
                      {description}
                    </div>
                  )
                },
                {
                  title: "Support Type",
                  dataIndex: "supportType",
                  key: "supportType",
                  render: (type) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSupportTypeColor(type)}`}>
                      {type}
                    </span>
                  )
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  )
                },
                {
                  title: "Created Date",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (date) => (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(date)}
                    </div>
                  )
                },
               
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleOpenChat(record.userId);
                        }}
                        className="text-brandGray hover:text-brandBlue transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(record.id, record.status);
                        }}
                        disabled={updatingId === record.id}
                        className={`flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors ${updatingId === record.id ? 'opacity-50 cursor-not-allowed bg-gray-400' : ''}`}
                        title={`Update status from ${record.status}`}
                      >
                        <RefreshCw className={`w-4 h-4 ${updatingId === record.id ? 'animate-spin' : ''}`} />
                        <span>Close</span>
                      </button>
                    </div>
                  )
                }
              ]}
              dataSource={supports}
              rowKey={(record) => record.id}
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: totalSupports,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
                position: ["bottomCenter"],
              }}
              onRow={() => ({})}
              scroll={{ x: "max-content" }}
            />
            {error && (
              <div className="text-center py-4 text-red-500">
                Error loading support tickets: {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSupport;
