import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import AdminProfile from "../components/AdminProfile";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { useGetContractsQuery } from "../../../redux/api/userApi";
import { useDebounce } from "../../../hooks/useDebounce";

const Contracts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const navigate = useNavigate();

  // Debounce search term to limit API calls
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  // API call for contracts
  const {
    data: contractsData,
    isLoading,
    error,
  } = useGetContractsQuery({
    searchTerm: debouncedSearchTerms,
    limit: 10,
    page: currentPage,
    timeRange: selectedTime.toUpperCase(),
    country: selectedCountry,
  });

  // Debug logging
  console.log("Current page:", currentPage);
  console.log("API Query params:", {
    searchTerm: debouncedSearchTerms,
    limit: 10,
    page: currentPage,
    timeRange: selectedTime.toUpperCase(),
    country: selectedCountry,
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTime, selectedCountry, debouncedSearchTerms]);

  // Simple approach - create minimal clean data structure for Antd Table
  const contracts = React.useMemo(() => {
    console.log("Processing contracts data:", contractsData);

    if (!contractsData?.data?.data || !Array.isArray(contractsData.data.data)) {
      console.log("No contracts data or not array:", contractsData?.data?.data);
      return [];
    }

    try {
      const processedContracts = contractsData.data.data.map((item, index) => {
        // Create a completely new object with only the fields we need
        const cleanContract = {
          key: item?.id || `row-${index}`,
          id: item?.id || "",
          type: item?.type || "",
          category: item?.category || "N/A",
          totalPrice: Number(item?.totalPrice) || 0,
          bookingStatus: item?.bookingStatus || "",
          createdAt: item?.createdAt || "",
          bookedFromDate: item?.bookedFromDate || "",
          bookedToDate: item?.bookedToDate || "",
          carBookedFromDate: item?.carBookedFromDate || "",
          carBookedToDate: item?.carBookedToDate || "",
          securityBookedFromDate: item?.securityBookedFromDate || "",
          securityBookedToDate: item?.securityBookedToDate || "",
          date: item?.date || "",
        };

        return cleanContract;
      });

      console.log("Processed contracts:", processedContracts);
      return processedContracts;
    } catch (error) {
      console.error("Error processing contracts data:", error);
      return [];
    }
  }, [contractsData]);

  const totalContracts = contractsData?.data?.meta?.total || 0;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get service type display name
  const getServiceTypeDisplay = (type) => {
    const typeMap = {
      hotel: "Hotel",
      car: "Car Rental",
      attraction: "Attraction",
      security: "Security",
    };
    return typeMap[type] || type;
  };

  // Get booking dates based on service type
  const getBookingDates = (contract) => {
    switch (contract.type) {
      case "hotel":
        return {
          start: contract.bookedFromDate,
          end: contract.bookedToDate,
        };
      case "car":
        return {
          start: contract.carBookedFromDate,
          end: contract.carBookedToDate,
        };
      case "security":
        return {
          start: contract.securityBookedFromDate,
          end: contract.securityBookedToDate,
        };
      case "attraction":
        return {
          start: contract.date,
          end: contract.date,
        };
      default:
        return { start: null, end: null };
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => id?.slice(-8) || "N/A",
    },
    {
      title: "Service Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span className="capitalize font-medium">
          {getServiceTypeDisplay(type)}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category || "N/A",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price?.toLocaleString() || "0"}`,
    },
    {
      title: "Start Date",
      key: "startDate",
      render: (_, record) => {
        const dates = getBookingDates(record);
        return formatDate(dates.start);
      },
    },
    {
      title: "End Date",
      key: "endDate",
      render: (_, record) => {
        const dates = getBookingDates(record);
        return formatDate(dates.end);
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => {
        const statusColor =
          status === "CONFIRMED"
            ? "text-green-600 bg-green-100"
            : "text-yellow-600 bg-yellow-100";
        return (
          <span
            className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full ${statusColor}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                status === "CONFIRMED" ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            {status}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button className="text-brandGray hover:text-brandGray">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ),
    },
  ];

  const pageSize = 10;

  return (
    <div className="md:px-6 px-0 bg-grayLightBg min-h-screen font-sans">
      <AdminProfile headingText={`Contracts`}></AdminProfile>
      <div className="min-h-screen bg-grayLightBg p-6 font-sans">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-darkGray">
              Contracts
            </h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
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
              {/* <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <option value="" disabled>
                  Select Country
                </option>
              <option value="">All Countries</option>
            <option value="United_States">United States</option>
            <option value="United_Kingdom">United Kingdom</option>
            <option value="United_Arab_Emirates">United Arab Emirates</option>
            <option value="Portugal">Portugal</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
              </select> */}

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

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* Table */}
            <div className="overflow-scroll w-[20rem] md:w-full mx-auto">
              <Table
                columns={columns}
                dataSource={contracts}
                rowKey={(record) => record.key || record.id || Math.random()}
                loading={isLoading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total: totalContracts,
                  onChange: (page) => {
                    console.log("Pagination onChange - new page:", page);
                    setCurrentPage(page);
                  },
                  showSizeChanger: false,
                  position: ["bottomCenter"],
                }}
                onRow={(record) => ({
                  onClick: () => navigate(`${record.type}/${record.id}`),
                })}
                scroll={{ x: "max-content" }}
              />
              {error && (
                <div className="text-center py-4 text-red-500">
                  Error loading contracts: {error.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
