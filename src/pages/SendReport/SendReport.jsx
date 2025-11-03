import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Input,
  Space,
  Avatar,
  Tag,
  message,
  Drawer,
  Descriptions,
  Typography,
  Card,
  Spin,
  Alert,
} from "antd";
import {
  InfoCircleOutlined,
  PrinterOutlined,
  MailOutlined,
  SearchOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import AdminProfile from "../dashboard/components/AdminProfile";
import { useGetServiceProvidersQuery, useSendReportServiceProviderMutation } from "../../redux/api/userApi";

const { Search } = Input;
const { TextArea } = Input;
const { Title, Text } = Typography;

const SendReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  // Filter states
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  
  // API hooks
  const { data: serviceProvidersData, isLoading, error } = useGetServiceProvidersQuery({
    time: selectedTime,
    country: selectedCountry,
    search: searchTerms,
  });
  
  const [sendReportServiceProvider, { isLoading: isSendingReport }] = useSendReportServiceProviderMutation();
  
  const partners = serviceProvidersData?.data?.partnerEarnings || [];

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setDetailsVisible(true);
  };

  const handlePrint = (partner) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #ea580c; margin-bottom: 20px;">Partner Report</h2>
        <div style="border: 1px solid #d1d5db; padding: 20px; border-radius: 8px;">
          <h3>${partner.name}</h3>
          <p><strong>Partner ID:</strong> ${partner.id}</p>
          <p><strong>Email:</strong> ${partner.email}</p>
          <p><strong>Phone:</strong> ${partner.phone}</p>
          <p><strong>Role:</strong> ${partner.role}</p>
          <p><strong>Status:</strong> ${partner.status}</p>
          <p><strong>Level:</strong> ${partner.level}</p>
          <p><strong>Earnings:</strong> ${partner.earnings}</p>
          <p><strong>Location:</strong> ${partner.location}</p>
          <p><strong>Joined Date:</strong> ${partner.joinedDate}</p>
          <p><strong>Total Projects:</strong> ${partner.totalProjects}</p>
          <p><strong>Completion Rate:</strong> ${partner.completionRate}</p>
          <p><strong>Rating:</strong> ${partner.rating}/5</p>
        </div>
        <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
          Generated on: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    message.success("Report sent to printer!");
  };

  const handleSendEmail = async (partner) => {
    try {
      const response = await sendReportServiceProvider(partner.id);
      
      if (response.data?.success) {
        message.success(response.data.message || `Earning report sent successfully to ${partner.email}!`);
      } else {
        const errorMessage = response.error?.data?.message || response.data?.message || 'Failed to send report';
        message.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to send report';
      message.error(errorMessage);
    }
  };

  // Filter partners based on search term (client-side filtering for additional search)
  const filteredPartners = partners.filter(
    (partner) =>
      (partner.fullName && partner.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      partner.id.includes(searchTerm) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Partner ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text) => (
        <span style={{ fontFamily: "monospace", color: "#6b7280" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar src={record.profileImage} icon={<UserOutlined />} size={40} />
          <div>
            <div style={{ fontWeight: 600, color: "#0d0d0d" }}>{text || 'N/A'}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => (
        <Tag
          style={{
            backgroundColor: "#fff0dd",
            color: "#ea580c",
            border: "none",
            fontWeight: 500,
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          style={{
            backgroundColor: status === "ACTIVE" ? "#dcfce7" : "#fef2f2",
            color: status === "ACTIVE" ? "#009106" : "#ef4444",
            border: "none",
            fontWeight: 500,
          }}
        >
          {status === 'ACTIVE' ? 'Active' : status === 'INACTIVE' ? 'Inactive' : status}
        </Tag>
      ),
    },
    {
      title: "Service Fee",
      dataIndex: "service_fee",
      key: "service_fee",
      render: (fee) => (
        <span style={{ fontWeight: 600, color: "#0d0d0d" }}>
          ${fee ? fee.toLocaleString() : '0'}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetails(record)}
            style={{ color: "#1e40af" }}
          >
            Details
          </Button>
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            style={{ color: "#6b7280" }}
          >
            Print
          </Button>
          <Popconfirm
            title="Send Earning Report"
            description={`Are you sure you want to send the earning report to ${record.email}?`}
            onConfirm={() => handleSendEmail(record)}
            okText="Yes, Send"
            cancelText="Cancel"
            okButtonProps={{
              loading: isSendingReport,
              style: { backgroundColor: "#ea580c", borderColor: "#ea580c" }
            }}
          >
            <Button
              type="text"
              icon={<MailOutlined />}
              style={{ color: "#ea580c" }}
              loading={isSendingReport}
            >
              Email
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
  
  if (isLoading) {
    return (
      <div className="px-0 md:px-6">
        <AdminProfile headingText="Send Report" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="px-0 md:px-6">
        <AdminProfile headingText="Send Report" />
        <Alert
          message="Error"
          description={error?.data?.message || "Failed to load service providers"}
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      </div>
    );
  }

  return (
    <div className="px-0 md:px-6">
      <AdminProfile headingText="Send Report"></AdminProfile>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          padding: "0px",
        }}
      >
        <div
          style={{ marginBottom: "24px" }}
          className="flex py-4 justify-between items-center"
        >
          <div className="w-60 md:w-[50%]">
            <Title level={2} style={{ color: "#0d0d0d", marginBottom: "8px", }}>
              Generate and send partner reports
            </Title>
          </div>

          <div>
 

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
          {/* Time Filter */}
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Countries</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
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
        </div>


      <div className="w-[20rem] md:w-full mx-auto sm:overflow-scroll md:overflow-auto">
        <div>
  <Card
  className="rounded-lg shadow-sm border border-gray-300 p-0 md:p-4"
>
  {/* Responsive table wrapper */}
  <div className="overflow-x-auto w-full">
    <div className=" md:w-full">
      <Table
        columns={columns}
        dataSource={filteredPartners}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} partners`,
        }}
        style={{ backgroundColor: "white" }}
      />
    </div>
  </div>
</Card>
</div>


      </div>



        {/* Details Drawer */}
        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                src={selectedPartner?.image}
                icon={<UserOutlined />}
                size={40}
              />
              <div>
                <div style={{ fontWeight: 600, color: "#0d0d0d" }}>
                  {selectedPartner?.name}
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Partner Details
                </div>
              </div>
            </div>
          }
          placement="right"
          onClose={() => setDetailsVisible(false)}
          open={detailsVisible}
          width={500}
        >
          {selectedPartner && (
            <div>
              <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Partner ID">
                  <span style={{ fontFamily: "monospace", color: "#6b7280" }}>
                    {selectedPartner.id}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <span style={{ color: "#1e40af" }}>
                    {selectedPartner.email}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <span style={{ color: "#0d0d0d" }}>
                    {selectedPartner.phone}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag
                    style={{
                      backgroundColor: "#fff0dd",
                      color: "#ea580c",
                      border: "none",
                    }}
                  >
                    {selectedPartner.role}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    style={{
                      backgroundColor:
                        selectedPartner.status === "Active"
                          ? "#dcfce7"
                          : "#fef2f2",
                      color:
                        selectedPartner.status === "Active"
                          ? "#009106"
                          : "#ef4444",
                      border: "none",
                    }}
                  >
                    {selectedPartner.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Level">
                  <Tag
                    style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      border: "none",
                    }}
                  >
                    {selectedPartner.level}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {selectedPartner.location}
                </Descriptions.Item>
                <Descriptions.Item label="Joined Date">
                  {selectedPartner.joinedDate}
                </Descriptions.Item>
                <Descriptions.Item label="Earnings">
                  <span style={{ fontWeight: 600, color: "#009106" }}>
                    {selectedPartner.earnings}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Total Projects">
                  {selectedPartner.totalProjects}
                </Descriptions.Item>
                <Descriptions.Item label="Completion Rate">
                  <span style={{ color: "#009106" }}>
                    {selectedPartner.completionRate}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Rating">
                  <span style={{ color: "#ea580c", fontWeight: 600 }}>
                    {selectedPartner.rating}/5
                  </span>
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: "24px", textAlign: "right" }}>
                <Space>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={() => handlePrint(selectedPartner)}
                    style={{
                      backgroundColor: "#f9fafb",
                      borderColor: "#d1d5db",
                      color: "#6b7280",
                    }}
                  >
                    Print Report
                  </Button>
                  <Popconfirm
                    title="Send Earning Report"
                    description={`Are you sure you want to send the earning report to ${selectedPartner.email}?`}
                    onConfirm={() => handleSendEmail(selectedPartner)}
                    okText="Yes, Send"
                    cancelText="Cancel"
                    okButtonProps={{
                      loading: isSendingReport,
                      style: { backgroundColor: "#ea580c", borderColor: "#ea580c" }
                    }}
                  >
                    <Button
                      type="primary"
                      icon={<MailOutlined />}
                      style={{
                        backgroundColor: "#ea580c",
                        borderColor: "#ea580c",
                      }}
                      loading={isSendingReport}
                    >
                      Send Email
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            </div>
          )}
        </Drawer>

      </div>
    </div>
  );
};

export default SendReport;
