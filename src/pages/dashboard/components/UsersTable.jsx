import React, { useState } from "react";
import { Info, MoreHorizontal, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllUsers } from "../../../redux/features/user/getAllUsersSlice";
import { useDebounce } from "../../../hooks/useDebounce";

const UsersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading } = useSelector((state) => state.getAllUsers);
  const dispatch = useDispatch();
  const usersPerPage = 10;

  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");

  // Debounce search term with 500ms delay
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  // Auto filter trigger
  useEffect(() => {
    handleSelect();
  }, [selectedTime, selectedCountry, debouncedSearchTerms]);

  // Fetch users when page changes or component mounts
  useEffect(() => {
    dispatch(
      getAllUsers({
        page: currentPage,
        limit: usersPerPage,
        searchTerm: debouncedSearchTerms,
        timeRange: selectedTime,
        country: selectedCountry,
      })
    );
  }, [currentPage, selectedTime, selectedCountry, debouncedSearchTerms]);

  const handleSelect = () => {
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.profileImage}
            alt={text}
            className="w-6 h-6 rounded-full object-cover"
          />
          {text}
        </div>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country || "-",
    },
    {
      title: "Title",
      key: "title",
      render: () => "Not available",
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toISOString().split("T")[0],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isActive = String(status).toUpperCase() === "ACTIVE";
        return (
          <span
            className={
              `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ` +
              (isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700")
            }
          >
            {isActive && <ArrowUp className="w-4 h-4" />}
            {isActive ? "Active" : status || "-"}
          </span>
        );
      },
    },
    {
      title: "Level",
      key: "level",
      render: () => "New",
    },
    {
      title: "Earnings",
      key: "earnings",
      render: () => 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <button
          onClick={() => navigate(`/dashboard/user-info/details/${record.id}`)}
          className="text-brandGray hover:text-darkGray"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full md:min-h-screen font-sans bg-grayLightBg">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Manage Users</h2>

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

      {/* Table */}
      <div className="w-[20rem] md:w-full mx-auto sm:overflow-scroll md:overflow-auto">
        <div className="w-full flex justify-center">
          <div className="w-full overflow-x-auto border rounded-lg bg-white">
            <div className="">
              <Table
                columns={columns}
                dataSource={Array.isArray(users.data) ? users.data : []}
                rowKey="id"
                loading={loading}
                scroll={{ x: true }}
                pagination={{
                  position: ["bottomCenter"], // This centers the pagination
                  current: currentPage,
                  pageSize: usersPerPage,
                  total: users?.meta?.total, // Use total from API response
                  onChange: (page) => setCurrentPage(page),
                  showSizeChanger: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
