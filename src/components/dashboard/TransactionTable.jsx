import { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";

const TransactionTable = ({ 
  userFinances, 
  financesLoading, 
  financesError, 
  currentPage, 
  setCurrentPage, 
  pageSize = 10,
  showTotal = true,
  size = "default"
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const handler = (e) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      responsive: ["md", "lg"],
    },
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      responsive: ["sm", "md", "lg"],
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
      responsive: ["xs", "sm", "md", "lg"],
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
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  // Add additional columns for detailed view
  const detailedColumns = [
    ...columns,
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      responsive: ["md", "lg"],
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      responsive: ["md", "lg"],
    },
    {
      title: "Admin Commission",
      dataIndex: "admin_commission",
      key: "admin_commission",
      render: (commission) => commission?.toLocaleString() || 0,
      responsive: ["md", "lg"],
    },
  ];

  const finalColumns = pageSize > 5 ? detailedColumns : columns;

  if (financesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin size="large" tip="Loading transactions..." />
      </div>
    );
  }

  if (financesError) {
    return (
      <Alert
        message="Error"
        description={financesError}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Table
      columns={finalColumns}
      dataSource={userFinances?.data?.data || []}
      rowKey="id"
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: userFinances?.data?.meta?.total || 0,
        onChange: (page) => setCurrentPage(page),
        showSizeChanger: false,
        showTotal: showTotal ? (total, range) =>
          `${range[0]}-${range[1]} of ${total} transactions` : false,
        size: pageSize <= 5 ? "small" : "default",
      }}
      scroll={isMobile ? undefined : { x: pageSize > 5 ? 1000 : 700 }}
      className="border rounded-lg"
      size={size}
    />
  );
};

export default TransactionTable;
