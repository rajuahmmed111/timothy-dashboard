import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import AdminProfile from "../components/AdminProfile";
import { useEffect } from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetFinancesQuery } from "../../../redux/api/finances/financesApi";
import { useDebounce } from "../../../hooks/useDebounce";

const FinancialPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  // Debounce search term with 500ms delay
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  // API call with dynamic parameters
  const {
    data: financesData,
    isLoading,
    error,
  } = useGetFinancesQuery({
    searchTerm: debouncedSearchTerms,
    timeRange: selectedTime,
    limit: pageSize,
    page: currentPage,
  });

  const payments = financesData?.data?.data || [];
  const totalRecords = financesData?.data?.meta?.total || 0;

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount, currency) => {
    const currencySymbols = {
      usd: "$",
      ngn: "₦",
      eur: "€",
      gbp: "£",
    };
    const symbol = currencySymbols[currency?.toLowerCase()] || "$";
    return `${symbol}${(amount / 100).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "text-green-600 bg-green-100";
      case "REFUNDED":
        return "text-red-600 bg-red-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // Auto filter trigger
  useEffect(() => {
    handleSelect();
  }, [selectedTime, selectedCountry, debouncedSearchTerms]);

  const handleSelect = () => {
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span className="text-sm font-mono text-gray-600">
          {id?.slice(-8) || "N/A"}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "payable_email",
      key: "payable_email",
      render: (email) => (
        <span className="text-sm text-gray-700">{email || "N/A"}</span>
      ),
    },
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      render: (type) => (
        <span className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
          {type || "N/A"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="text-sm text-gray-600">{formatDate(date)}</span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => (
        <span className="text-sm capitalize text-gray-700">
          {method || "N/A"}
        </span>
      ),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      render: (provider) => (
        <span className="text-sm font-medium text-purple-600">
          {provider || "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(
            status
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {status || "N/A"}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span className="text-sm font-semibold text-gray-800">
          {formatAmount(amount, record.currency)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => {
            navigate(`details/${record.id}`);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="px-0 sm:px-6 bg-grayLightBg min-h-screen font-sans">
      <AdminProfile headingText={`Financial Management`}></AdminProfile>
      
      <div className="md:p-6 p-2 sm:p-6 bg-grayLightBg md:min-h-screen font-sans w-full">
        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Payments
          </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
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

      {/* Table */}
      <div className="w-[20rem] md:w-full mx-auto sm:overflow-scroll md:overflow-auto">
        <div className="w-full flex justify-center">
          <div className="w-full overflow-x-auto border rounded-lg bg-white">
            <div className="">
              <Table
                columns={columns}
                dataSource={Array.isArray(payments) ? payments : []}
                rowKey="id"
                loading={isLoading}
                scroll={{ x: true }}
                pagination={{
                  position: ["bottomCenter"],
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalRecords,
                  onChange: (page) => setCurrentPage(page),
                  showSizeChanger: false,
                }}
                locale={{
                  emptyText: (
                    <div className="py-8">
                      <div className="text-gray-500 mb-2">
                        No payments found
                      </div>
                      <div className="text-gray-400 text-sm">
                        Try adjusting your filters
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FinancialPayments;
