import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { Plus, Edit, InfoIcon, Trash2, CheckCircle, Ban } from "lucide-react";
  import { Table, Input, Button, Pagination, Modal, Spin, Alert, message } from "antd";
  import { useDispatch, useSelector } from "react-redux";
  import { getAdmins } from "../../../redux/features/admin/adminSlice";
  import AddAdminModal from "./AddAdminModal";
  import AdminProfile from "../components/AdminProfile";
  import { deleteSingleUser } from "../../../redux/features/user/getSIngleUserSlice";
  import { useDebounce } from "../../../hooks/useDebounce";
  import { useUpdateSuperAdminAccessMutation } from "../../../redux/api/admin/adminApi";

const Role = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 400);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateAccess, { isLoading: updatingAccess }] = useUpdateSuperAdminAccessMutation();

  const { admins, loading, meta, error } = useSelector((state) => ({
    admins: state.admin.admins?.data || [],
    meta: state.admin.admins?.meta || { total: 0 },
    loading: state.admin.loading,
    error: state.admin.error,
  }));

  useEffect(() => {
    dispatch(
      getAdmins({
        page: currentPage,
        limit: 10,
        status: selectedTime || "",
        searchTerm: debouncedSearch || "",
      })
    );
  }, [dispatch, currentPage, selectedTime, debouncedSearch]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTime, debouncedSearch]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this admin?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        console.log("Deleted Admin ID:", id);

        dispatch(deleteSingleUser(id))
          .unwrap()
          .then(() => {
            message.success("User deleted successfully");
            dispatch(
              getAdmins({
                page: currentPage,
                limit: 10,
                status: selectedTime || "",
                searchTerm: debouncedSearch || "",
              })
            );
          })
          .catch((err) => {
            message.error("Failed to delete user");
            console.error(err);
          });

        // TODO: Add delete logic (e.g., dispatch(deleteAdmin(id)))
      },
    });
  };

  const handleToggleStatus = (admin) => {
    const targetStatus = admin.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    Modal.confirm({
      title: `Confirm to set ${admin.fullName}'s status to ${targetStatus}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await updateAccess({ id: admin.id, data: { status: targetStatus } }).unwrap();
          message.success(`Status updated to ${targetStatus}`);
          dispatch(
            getAdmins({
              page: currentPage,
              limit: 10,
              status: selectedTime || "",
              searchTerm: debouncedSearch || "",
            })
          );
        } catch (e) {
          message.error(e?.data?.message || "Failed to update status");
        }
      },
    });
  };

  const columns = [
    {
      title: "S.ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            role === "ADMIN"
              ? "text-green-700 bg-green-100"
              : "text-blue-700 bg-blue-100"
          }`}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "ACTIVE"
              ? "text-green-700 bg-green-100"
              : status === "INACTIVE"
              ? "text-yellow-700 bg-yellow-100"
              : status === "REJECTED"
              ? "text-red-700 bg-red-100"
              : "text-gray-700 bg-gray-100"
          }`}
        >
          {status === "ACTIVE" ? "Active" : status === "INACTIVE" ? "Pending" : status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, admin) => (
        <div className="flex gap-4 items-center">
          {admin.status === "INACTIVE" ? (
            <button
              title="Activate"
              onClick={() => handleToggleStatus(admin)}
              disabled={updatingAccess}
            >
              <CheckCircle className={` ${updatingAccess ? 'opacity-50' : ''} text-green-600`} />
            </button>
          ) : (
            <button
              title="Set Inactive"
              onClick={() => handleToggleStatus(admin)}
              disabled={updatingAccess}
            >
              <Ban className={` ${updatingAccess ? 'opacity-50' : ''} text-yellow-600`} />
            </button>
          )}
          <button onClick={() => handleDelete(admin.id)}>
            <Trash2 className="text-red-500" />
          </button>
          <button onClick={() => navigate(`details/${admin.id}`)}>
            <Edit className="text-gray-700" />
          </button>
          <button onClick={() => navigate(`view/${admin.id}`)}>
            <InfoIcon className="text-gray-700" />
          </button>
        </div>
      ),
    },
  ];

  const handleRefetchAdmins = () => {
    dispatch(
      getAdmins({
        page: currentPage,
        limit: 10,
        status: selectedTime || "",
        searchTerm: debouncedSearch || "",
      })
    );
  };

  return (
    <div className="px-0 md:px-6 mx-auto font-sans">
      <AdminProfile headingText="Manage Roles" />
      

      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6 mt-6">
        <h2 className="text-2xl font-semibold text-darkGray">Manage Admins</h2>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[200px] !py-2"
          />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All</option>
            <option value="ACTIVE">Approved</option>
            <option value="INACTIVE">Pending</option>
          </select>
          <Button
            type="primary"
            icon={<Plus />}
            className="bg-orangePrimary text-black !h-full !py-2"
            onClick={() => setShowModal(true)}
          >
            Add New Admin
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      <div className="w-[20rem] mx-auto md:!w-full overflow-x-auto border rounded-lg bg-white">
        <Table
          columns={columns}
          dataSource={admins}
          loading={loading}
          scroll={{ x: true }}
          pagination={false}
          rowKey="id"
        />
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={meta.total}
          pageSize={10}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <AddAdminModal
        refetchAdmins={handleRefetchAdmins}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Role;
