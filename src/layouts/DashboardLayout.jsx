import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
// import Logo from "../assets/logo.png";
import { FiMenu, FiX } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { TbUserCog, TbUserHexagon } from "react-icons/tb";
import { MdOutlinePayments, MdOutlineSupportAgent } from "react-icons/md";
import { LiaFileContractSolid } from "react-icons/lia";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { FiFileText, FiPercent } from "react-icons/fi";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import { LuUsers } from "react-icons/lu";
import { CiMail } from "react-icons/ci";
import { TiMessages } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";


export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const submenuRef = useRef(null);
  const isSettingsActive = location.pathname.startsWith("/dashboard/settings");
  const dispatch = useDispatch();


  const { user, logOut } = useContext(AuthContext);

  const logOutUser = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff9000", // "Yes" button
      cancelButtonColor: "red", // Background for "No"
      confirmButtonText: "Yes        ",
      cancelButtonText: "No      ",
      customClass: {
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logOut().then(() => {
          Swal.fire(
            "Logged out!",
            "You have been logged out successfully.",
            "success"
          );
           dispatch(logout()); 
          navigate("/login");
        });
      }
    });
  };
  const sendReport = () => {
   navigate("send-report");
  };

  useEffect(() => {
    if (!isSettingsActive) setShowSettingsSubmenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest(".mobile-menu-container")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const navLinkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all";

  const linkClass = (isActive) =>
    `${navLinkBase} ${
      isActive
        ? "bg-orangePrimary text-darkGray"
        : "text-[#BCA88F] hover:bg-gray-100"
    }`;

  const submenuLinkClass = (isActive) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "bg-orangeLightBg text-darkGray font-medium"
        : "hover:bg-orange-50 text-[#BCA88F]"
    }`;

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
    setShowSettingsSubmenu((prev) => !prev);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const renderNavLinks = () => (
    <>
      <NavLink
        to="/dashboard/statistics"
        className={({ isActive }) =>
          linkClass(isActive || location?.pathname === "/")
        }
      >
        <RxDashboard className="text-lg" />
        Dashboard
      </NavLink>

      <NavLink
        to="/dashboard/user-info"
        className={({ isActive }) => linkClass(isActive)}
      >
        <TbUserHexagon className="text-lg" />
        Users
      </NavLink>

      <NavLink
        to="/dashboard/service-provider"
        className={({ isActive }) => linkClass(isActive)}
      >
        <TbUserCog className="text-lg" />
        Partners
      </NavLink>

      <NavLink
        to="/dashboard/approve-partners"
        className={({ isActive }) => linkClass(isActive)}
      >
        <LuUsers className="text-lg" />
        Approve Partners
      </NavLink>


            <NavLink
        to="/dashboard/all-messages"
        className={({ isActive }) => linkClass(isActive)}
      >
        <TiMessages className="text-lg" />
        All Messages
      </NavLink>

      <NavLink
        to="/dashboard/financialpayments"
        className={({ isActive }) => linkClass(isActive)}
      >
        <MdOutlinePayments className="text-lg" />
        Finances
      </NavLink>

      <NavLink
        to="/dashboard/contracts"
        className={({ isActive }) => linkClass(isActive)}
      >
        <LiaFileContractSolid className="text-lg" />
        Contracts
      </NavLink>

      <NavLink
        to="/dashboard/support"
        className={({ isActive }) => linkClass(isActive)}
      >
        <MdOutlineSupportAgent className="text-lg" />
        User Support
      </NavLink>

      <NavLink
        to="/dashboard/role"
        className={({ isActive }) => linkClass(isActive)}
      >
        <LuUsers className="text-lg" />
        Role
      </NavLink>

      <NavLink
        to="/dashboard/terms-conditions"
        className={({ isActive }) => linkClass(isActive)}
      >
        <FiFileText className="text-lg" />
        Terms & Conditions
      </NavLink>

      <NavLink
        to="/dashboard/privacy-policy"
        className={({ isActive }) => linkClass(isActive)}
      >
        <FiFileText className="text-lg" />
        Privacy Policy
      </NavLink>

      <NavLink
        to="/dashboard/promo-codes"
        className={({ isActive }) => linkClass(isActive)}
      >
        <FiPercent className="text-lg" />
        Promo Codes
      </NavLink>

      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) => linkClass(isActive)}
      >
        <IoSettingsOutline className="text-lg" />
        Settings
      </NavLink>

      <div
        className="px-4 py-2 md:hidden rounded transition  font-medium cursor-pointer hover:text-yellow-500 flex gap-3 text-[#BCA88F]"
        onClick={sendReport}
      >
        <CiMail className="text-xl" />
        Send report
      </div>

      <div
        className="px-4 py-2 rounded transition  font-medium cursor-pointer hover:text-red-400 flex gap-3 text-[#BCA88F]"
        onClick={logOutUser}
      >
        <IoLogOutOutline className="text-xl" />
        Log Out
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-10 left-2 z-50 p-1 bg-white rounded-md shadow-lg"
      >
        {mobileMenuOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-white shadow-lg flex-col justify-between z-40 z-100 overflow-visible overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-center mb-4">
            {/* <Link to="/">
              <img src={Logo} alt="logo" className="w-20" />
            </Link> */}
          </div>
          <nav className="flex flex-col gap-2">{renderNavLinks()}</nav>
        </div>

        <div className="p-4 relative">
          {" "}
          {/* Added relative positioning here */}
          {/* Question mark circle - now outside the main container */}
          <div
            className="w-[56px] h-[56px] rounded-full absolute -top-3 text-2xl 
  left-1/2 -translate-x-1/2 border-4 border-white bg-black text-white font-extrabold 
  flex items-center justify-center z-10 custom-shadow"
          >
            ?
          </div>
          {/* Main container with overflow-hidden */}
          <div className="bg-[#1E1A14]  h-[268px] text-white rounded-[20px] py-6 shadow-xl text-center flex flex-col items-center justify-center overflow-hidden relative">
            {/* Decorative circles - will be clipped by overflow-hidden */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#BCA88F] rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#BCA88F] rounded-full opacity-20 transform translate-x-1/2 translate-y-1/2"></div>

            {/* Content div centered in the card */}
            <div className="flex flex-col items-center justify-center flex-grow">
              {/* Title */}
              <h3 className="text-base font-semibold mb-2">Send Reports</h3>

              {/* Subtitle */}
              <p className="text-sm text-white/80 mb-5 leading-relaxed max-w-52">
                Need to extract and send
                <br />
                daily, weekly or monthly reports?
              </p>
            </div>

            {/* Button fixed at the bottom of the card */}
            <div
              onClick={() => {
                navigate("/dashboard/send-report");
              }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4"
            >
              <button className="bg-white text-darkGray text-sm font-medium px-10 py-3 rounded-xl hover:bg-gray-200 transition w-full mx-auto">
                Send
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-container md:hidden fixed inset-0 z-40">
          <div className="absolute left-0 top-0 w-64 h-full bg-white shadow-lg flex flex-col overflow-y-auto">
            <div className="p-6">
              <div className="text-xl font-bold mb-6">
                <img className="mx-auto w-24 h-auto" src={`https://i.ibb.co/9kdTMjGb/image.png`} alt="logo" />
              </div>
              <nav className="flex flex-col gap-2">{renderNavLinks()}</nav>
            </div>

            <div className="mt-auto border-t border-gray-200">
              {/* <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-darkGray hover:bg-redMutedBg hover:text-red-600 transition-all"
                onClick={() => console.log("Logout clicked")}
              >
                <FiLogOut className="text-xl" />
                <span className="font-bold">Logout</span>
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen relative">
        <div className="bg-[#fafafa] ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
