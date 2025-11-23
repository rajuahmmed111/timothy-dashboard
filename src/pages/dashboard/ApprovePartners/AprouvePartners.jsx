import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Avatar,
  Tag,
  message,
  Popconfirm,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import AdminProfile from "../components/AdminProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetApprovedPartnersQuery,
  useUpdatePartnerStatusActiveMutation,
  useUpdatePartnerStatusRejectMutation
} from "../../../redux/api/userApi";
import { useDebounce } from "../../../hooks/useDebounce";

const ApprovePartners = () => {
  const navigate = useNavigate();
  
  // Filter states
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  // Debounced search like UsersTable
  const debouncedSearchTerms = useDebounce(searchTerms, 300);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // API hooks
  const { data: partnersData, isLoading, error, refetch } = useGetApprovedPartnersQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    searchTerm: debouncedSearchTerms,
    country: selectedCountry,
    timeRange: selectedTime,
  });
  
  const [updatePartnerStatusActive, { isLoading: isApproving }] = useUpdatePartnerStatusActiveMutation();
  const [updatePartnerStatusReject, { isLoading: isRejecting }] = useUpdatePartnerStatusRejectMutation();
  
  const partners = partnersData?.data?.data || [];
  const meta = partnersData?.data?.meta || {};
  
  // Update pagination total when data changes
  useEffect(() => {
    if (meta.total) {
      setPagination(prev => ({
        ...prev,
        total: meta.total
      }));
    }
  }, [meta.total]);


  const handleApprove = async (partnerId, partnerName) => {
    try {
      const response = await updatePartnerStatusActive(partnerId);
      
      if (response.data?.success) {
        message.success(response.data.message || `${partnerName} has been approved as a business partner!`);
        refetch();
      } else {
        const errorMessage = response.error?.data?.message || response.data?.message || 'Failed to approve partner';
        message.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to approve partner';
      message.error(errorMessage);
    }
  };

  const handleReject = async (partnerId, partnerName) => {
    try {
      const response = await updatePartnerStatusReject(partnerId);
      
      if (response.data?.success) {
        message.success(response.data.message || `${partnerName}'s partnership application has been rejected.`);
        refetch();
      } else {
        const errorMessage = response.error?.data?.message || response.data?.message || 'Failed to reject partner';
        message.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to reject partner';
      message.error(errorMessage);
    }
  };

  // Remove old filtering logic since API handles filtering
  const filteredPartners = partners;

  const columns = [
    {
      title: "Partner ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text) => (
        <span className="text-gray-600 font-mono text-sm">{text}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.profileImage} icon={<UserOutlined />} size={40} />
          <span className="font-medium text-gray-800">{text || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Applied Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <span className="text-gray-600">
          {new Date(text).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Tag color="#ffc983" className="border-none text-gray-700 font-medium">
          {text === 'BUSINESS_PARTNER' ? 'Partner' : text.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          INACTIVE: { color: "#ffc983", text: "Pending" },
          ACTIVE: { color: "#52c41a", text: "Active" },
          REJECTED: { color: "#ff4d4f", text: "Rejected" },
        };
        return (
          <Tag
            color={statusConfig[status]?.color || "#ffc983"}
            className="border-none font-medium"
          >
            {statusConfig[status]?.text || status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {record.status === "INACTIVE" && (
            <>
              <Popconfirm
                title="Approve Partner"
                description={`Are you sure you want to approve ${record.fullName || record.email} as a business partner?`}
                onConfirm={() => handleApprove(record.id, record.fullName || record.email)}
                okText="Yes, Approve"
                cancelText="Cancel"
                okButtonProps={{
                  style: { backgroundColor: "#ffc983", borderColor: "#ffc983" },
                }}
                icon={<CheckOutlined style={{ color: "#52c41a" }} />}
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                  loading={isApproving}
                >
                  Approve
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Reject Partner"
                description={`Are you sure you want to reject ${record.fullName || record.email}'s partnership application?`}
                onConfirm={() => handleReject(record.id, record.fullName || record.email)}
                okText="Yes, Reject"
                cancelText="Cancel"
                okButtonProps={{
                  style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" },
                }}
                icon={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
              >
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  loading={isRejecting}
                >
                  Reject
                </Button>
              </Popconfirm>
            </>
          )}

          {/* Info Button to navigate to details */}
          <Button
            type="default"
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => navigate(`approve-details/${record.id}`)}
          >
            Info
          </Button>

          {record.status === "ACTIVE" && (
            <Tag color="#52c41a" className="border-none font-medium">
              <CheckOutlined /> Active
            </Tag>
          )}
          {record.status === "REJECTED" && (
            <Tag color="#ff4d4f" className="border-none font-medium">
              <CloseOutlined /> Rejected
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  // Auto filter trigger: reset to page 1 when filters change (like UsersTable)
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [selectedTime, selectedCountry, debouncedSearchTerms]);

  const handleTableChange = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current, 
      pageSize: paginationInfo.pageSize,
      total: pagination.total,
    });
  };

  return (
    <div className="px-0 sm:px-6 bg-gray-50 min-h-screen">
      <AdminProfile headingText="Approve Partners" />

      {/* Title + Filters Section */}
      <div className="my-4 sm:my-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Review and approve partner applications
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full md:w-auto">
          {/* Time Filter */}
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Time</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="THIS_YEAR">This Year</option>
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
              <option value="">All Countries</option>
            <option value="United_States">United States</option>
            <option value="United_Kingdom">United Kingdom</option>
            <option value="United_Arab_Emirates">United Arab Emirates</option>
            <option value="Portugal">Portugal</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Table Wrapper for Mobile Responsiveness */}
      <div className="overflow-x-auto md:min-w-[600px] max-w-[20rem] md:max-w-full mx-auto  rounded-lg shadow-sm border border-gray-200 w-full">
        <div className=" ">
          <Table
            columns={columns}
            dataSource={filteredPartners}
            rowKey="id"
            loading={isLoading}
            pagination={{
              ...pagination,
              position: ["bottomCenter"],
              showSizeChanger: false,
              showQuickJumper: false,
              className: "px-6",
            }}
            onChange={handleTableChange}
            className="custom-table"
            rowClassName="hover:bg-gray-50"
            scroll={{ x: 900 }}
          />
        </div>
      </div>

      <style jsx>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
          font-weight: 600;
          color: #495057;
        }

        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f3f5;
          padding: 16px;
        }

        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f8f9fa;
        }

        .ant-btn-primary {
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }

        .ant-btn-primary:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default ApprovePartners;
