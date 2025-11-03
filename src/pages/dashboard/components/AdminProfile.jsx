import { useState } from "react";
import { PiBell } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile } from "../../../redux/features/auth/authSlice";
import { Skeleton } from "antd";

const AdminProfile = ({ headingText = "Users Management" }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      dispatch(getUserProfile());
    }
  }, [token, user, dispatch]);

  const handleNotification = () => {
    navigate("/dashboard/notification");
  };

  return (
    <div className="flex items-center justify-between sticky top-0 md:top-0 w-full md:w-full px-0 md:px-6 py-8 md:py-4 gap-2 bg-white font-sans rounded-md shadow z-20">
      {/* Left dynamic text */}
      <h1 className="text-xs md:text-2xl ml-12 md:ml-0 font-bold text-darkGray">
        {headingText}
      </h1>

      {/* Right-side controls */}
      <div className="flex items-center gap-2">
        {/* Search box */}
        <div className="flex items-center md:min-w-[20rem] justify-between min-h-12 gap-2 bg-white rounded-md px-4 py-2 border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="Search"
            className="outline-none text-sm text-[#88755A] bg-transparent placeholder:text-[#88755A] w-full"
          />
          <CiSearch className="text-[#88755A] text-3xl" />
        </div>

        {/* Bell Icon with notification */}
        <div className="relative md:block">
          <div
            onClick={handleNotification}
            className="relative cursor-pointer md:w-[50px] md:h-[50px] w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center shadow-sm border border-lightGrayBorders"
          >
            <PiBell className="text-[#88755A] text-2xl" />
            <span className="absolute -top-[2px] md:top-[8px] -right-[0px] w-[10px] h-[10px] bg-brandRed rounded-full" />
          </div>
        </div>

        {/* Profile Section with Loading State */}
        {loading ? (
          <div className="flex gap-4 items-center">
            <Skeleton.Avatar active size="large" />
            <div className="hidden md:block">
            
              <Skeleton.Input active size="small" />
            </div>
          </div>
        ) : (
          <div className="relative group flex items-center">
            <div className="flex gap-2">
              <div
                onClick={() => navigate("/dashboard/update-profile")}
                className="md:w-[50px] md:h-[50px] w-[40px] h-[40px] rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
              >
                <img
                  src={user?.profileImage || "/default-avatar.png"}
                  alt="Admin"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
              <div className="text-brandGray font-semibold hidden md:block">
                <p>{user?.fullName || "Admin User"}</p>
                <p>{user?.role || "Admin"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;