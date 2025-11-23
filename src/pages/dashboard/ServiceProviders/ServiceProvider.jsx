import { useState, useEffect } from "react";
import { Info, MoreHorizontal, ArrowUp } from "lucide-react";
import AdminProfile from "../components/AdminProfile";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getAllPartners } from "../../../redux/features/user/getPartnersSlice";
import { useDebounce } from "../../../hooks/useDebounce";

const ServiceProvider = ({ hideHeader = false, embedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term with 500ms delay
  const debouncedSearchTerms = useDebounce(searchTerms, 500);

  const { users, total, loading } = useSelector((state) => state.getAllPartners);

  const usersPerPage = 10;

  // Fetch partners
  useEffect(() => {
    dispatch(
      getAllPartners({
        page: currentPage,
        limit: usersPerPage,
        searchTerm: debouncedSearchTerms,
        timeRange: selectedTime,
        country: selectedCountry,
      })
    );
  }, [currentPage, selectedTime, selectedCountry, debouncedSearchTerms]);

  // Trigger re-fetch on filters
  useEffect(() => {
    setCurrentPage(1); // Reset page
  }, [selectedTime, selectedCountry, debouncedSearchTerms]);

  // Transform API data to table-friendly format
  const tableData = Array.isArray(users?.data)
    ? users.data.map((user) => ({
        id: user.id,
        name: user.fullName || "N/A",
        image: user.profileImage || "https://i.ibb.co/Ps9gZ8DD/Profile-image.png",
        country: user.country || "-",
        joined: new Date(user.createdAt).toISOString().split("T")[0],
        status: user.status,
      }))
    : [];

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.image}
            alt={text}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span>{text}</span>
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
    { title: "Joined", dataIndex: "joined", key: "joined" },
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
            {isActive ? "Active" : (status || "-")}
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
          onClick={() =>
            navigate(`/dashboard/service-provider/details/${record.id}`)
          }
          className="text-brandGray hover:text-darkGray"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className={embedded ? "px-0" : "px-0 sm:px-6"}>
      {!hideHeader && <AdminProfile headingText="Manage Partners" />}
      <div className={`${embedded ? "p-0" : "p-4 sm:p-6"} bg-grayLightBg font-sans ${embedded ? "" : "min-h-screen"}`}>
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Our Partners</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center w-full md:w-auto">
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

            <input
              type="text"
              placeholder="Search"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg bg-white max-w-[20rem] mx-auto md:max-w-full">
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: usersPerPage,
              total: users?.meta?.total, // Use total from API response
              onChange: setCurrentPage,
              showSizeChanger: false,
            }}
            scroll={{ x: 900 }}
          />

          <style jsx>{`
            .ant-table-pagination {
              display: flex;
              justify-content: center !important;
              padding: 16px;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default ServiceProvider;
