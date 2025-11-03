// components/SettingsModal.jsx
import { NavLink, useLocation } from "react-router-dom";

export default function SettingsModal({ onClose }) {
  const location = useLocation();

  // Only show the modal for these paths
  const isModalOpen = [
    "/dashboard/settings",
    "/dashboard/settings/terms",
    "/dashboard/settings/privacy",
  ].some((path) => location.pathname === path);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <div className="flex flex-col gap-2">
          <NavLink
            to="/dashboard/settings"
            className="px-4 py-2 bg-green-700 text-white rounded"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/settings/terms"
            className="px-4 py-2 hover:bg-greenMutedBg rounded"
          >
            Terms & Condition
          </NavLink>
          <NavLink
            to="/dashboard/settings/privacy"
            className="px-4 py-2 hover:bg-greenMutedBg rounded"
          >
            Privacy Policy
          </NavLink>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-red-600 hover:underline block mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}
