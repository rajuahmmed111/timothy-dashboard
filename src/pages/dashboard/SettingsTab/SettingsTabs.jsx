import { useEffect, useState } from "react";
import { FiSettings, FiBell } from "react-icons/fi";
import Swal from "sweetalert2";
import AdminProfile from "../components/AdminProfile";
import LanguageSelect from "../../../components/dashboard/LanguageSelect";
import { SlArrowDown } from "react-icons/sl";
import api from "../../../redux/api";

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState("general");

   const isSelected = (value) => generalSettings.timeFormat === value;


  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    currency: "English (Default)",
    language: "English (Default)",
    timezone: "English (Default)",
    timeFormat: "24 Hours",
  });

  // Notification settings state (UI keys)
  const [notificationSettings, setNotificationSettings] = useState({
    messageNotifications: false, // maps to supportNotification
    transactionNotifications: false, // maps to paymentNotification
    emailNotifications: false, // maps to emailNotification
  });
  const [notifLoading, setNotifLoading] = useState(false);

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch current notification settings when tab becomes active
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      setNotifLoading(true);
      try {
        // PATCH with empty body as per API contract to get current/last values
        const res = await api.patch("/settings/notification-settings", {});
        const server = res?.data?.data || {};
        setNotificationSettings({
          messageNotifications: !!server.supportNotification,
          transactionNotifications: !!server.paymentNotification,
          emailNotifications: !!server.emailNotification,
        });
      } catch (error) {
        console.error("Load notification settings failed", error);
        // Keep defaults but inform user
        Swal.fire("Error", error?.response?.data?.message || "Failed to load notification settings", "error");
      } finally {
        setNotifLoading(false);
      }
    };
    if (activeTab === "notification") {
      fetchNotificationSettings();
    }
  }, [activeTab]);

  const handleSaveNotificationSettings = async () => {
    setNotifLoading(true);
    try {
      // Map UI state to API keys
      const payload = {
        supportNotification: notificationSettings.messageNotifications,
        paymentNotification: notificationSettings.transactionNotifications,
        emailNotification: notificationSettings.emailNotifications,
      };
      const res = await api.patch("/settings/notification-settings", payload);
      const server = res?.data?.data || {};
      // Normalize back to UI state
      setNotificationSettings({
        messageNotifications: !!server.supportNotification,
        transactionNotifications: !!server.paymentNotification,
        emailNotifications: !!server.emailNotification,
      });
      Swal.fire({
        title: "Saved!",
        text: "Notification settings updated.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.message || "Failed to update notification settings", "error");
    } finally {
      setNotifLoading(false);
    }
  };

  const handleNotificationToggle = (settingName) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [settingName]: !prev[settingName],
    }));

    // Console log when message notifications are toggled
    if (settingName === "messageNotifications") {
      console.log(
        `Message notifications: ${
          !notificationSettings.messageNotifications ? "ON" : "OFF"
        }`
      );
    }

    // Console log when transaction notifications are toggled
    if (settingName === "transactionNotifications") {
      console.log(
        `Transaction notifications: ${
          !notificationSettings.transactionNotifications ? "ON" : "OFF"
        }`
      );
    }

    // Console log when email notifications are toggled
    if (settingName === "emailNotifications") {
      console.log(
        `Email notifications: ${
          !notificationSettings.emailNotifications ? "ON" : "OFF"
        }`
      );
    }
  };

  const handleSaveGeneralSettings = () => {
    console.log(generalSettings)
    Swal.fire({
      title: "Settings Updated!",
      text: "Your general settings have been saved.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const ToggleSwitch = ({ isOn, onToggle, label }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-darkGray">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isOn ? "bg-yellow-500" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <>
      <div className="space-y-6 bg-grayLightBg min-h-screen px-0 md:px-6 font-sans">
        <AdminProfile headingText="User Settings" />
        <div className="bg-white rounded p-6">
          <div className="max-w-md   ">
            {/* Tabs */}
            <div className="flex justify-start border-b border-gray-200 mb-8 font-poppins">
              <button
                className={`flex items-center gap-2 px-6 py-3 font-medium ${
                  activeTab === "general"
                    ? "text-darkGray border-b-2 border-orangePrimary"
                    : "text-brandGray hover:text-darkGray"
                }`}
                onClick={() => setActiveTab("general")}
              >
                <FiSettings />
                General
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 font-medium ${
                  activeTab === "notification"
                    ? "text-darkGray border-b-2 border-orangePrimary"
                    : "text-brandGray hover:text-darkGray"
                }`}
                onClick={() => setActiveTab("notification")}
              >
                <FiBell />
                Notification
              </button>
            </div>

            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                {/* <h2 className="text-2xl font-semibold text-center mb-6">General Settings</h2> */}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-darkGray mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value="USD (Default)"
                     disabled
                      className="w-full px-4 py-2 border text-brandGray rounded-md   cursor-not-allowed"
                    />
                  </div>

                  <LanguageSelect />

                  {/* currency select  */}
                  {/* <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">Currencies</label>
                  <select
                    name="currency"
                    value={generalSettings.currency}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-4 py-2 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="English (Default)">English (Default)</option>
                     <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AUD">AUD</option> 
                  </select>
                </div> */}

                  {/* language select  */}
                  {/* <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">Language</label>
                  <select
                    name="language"
                    value={generalSettings.language}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-4 py-2 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="English (Default)">English (Default)</option>
                     <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div> */}
{/* timezone  */}
<div>
  <label className="block text-sm font-medium text-darkGray mb-1">
    Timezone
  </label>

  <div className="relative w-full">
    <select
      name="timezone"
      value={generalSettings.timezone}
      onChange={handleGeneralSettingsChange}
      className="w-full appearance-none px-4 py-2 pr-10 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBB040]"
    >
      <option value="English (Default)">English (Default)</option>
      <option value="UTC-12">UTC-12</option>
      <option value="UTC-11">UTC-11</option>
      <option value="UTC-10">UTC-10</option>
      <option value="UTC-9">UTC-9</option>
      <option value="UTC-8">UTC-8</option>
      <option value="UTC-7">UTC-7</option>
      <option value="UTC-6">UTC-6</option>
      <option value="UTC-5">UTC-5</option>
      <option value="UTC-4">UTC-4</option>
      <option value="UTC-3">UTC-3</option>
      <option value="UTC-2">UTC-2</option>
      <option value="UTC-1">UTC-1</option>
      <option value="UTC+0">UTC+0</option>
      <option value="UTC+1">UTC+1</option>
      <option value="UTC+2">UTC+2</option>
      <option value="UTC+3">UTC+3</option>
      <option value="UTC+4">UTC+4</option>
      <option value="UTC+5">UTC+5</option>
      <option value="UTC+6">UTC+6</option>
      <option value="UTC+7">UTC+7</option>
      <option value="UTC+8">UTC+8</option>
      <option value="UTC+9">UTC+9</option>
      <option value="UTC+10">UTC+10</option>
      <option value="UTC+11">UTC+11</option>
      <option value="UTC+12">UTC+12</option>
    </select>

    {/* Arrow Icon */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-brandGray">
      <SlArrowDown className="text-sm" />
    </div>
  </div>
</div>

                  <div>
                    <label className="block text-sm font-medium text-darkGray mb-1">
                      Time Format
                    </label>



 <div className="flex gap-4 mt-2">
      {["24 Hours", "12 Hours"].map((label) => (
        <label
          key={label}
          className={`flex items-center justify-between w-[160px] px-4 py-3 rounded-xl cursor-pointer border transition-all
            ${isSelected(label) ? "border-[#FBB040]" : "border-[#f0f0f0]"}`}
        >
          <span className="text-base font-medium text-darkGray">{label}</span>

          {/* Custom hollow circle */}
          <span
            className={`w-5 h-5 rounded-full border-[4px] transition-all
              ${isSelected(label) ? "border-[#FBB040] " : "border-[#f0f0f0]"}`}
          ></span>

          {/* Hidden native radio */}
          <input
            type="radio"
            name="timeFormat"
            value={label}
            checked={isSelected(label)}
            onChange={handleGeneralSettingsChange}
            className="hidden"
          />
        </label>
      ))}
    </div>




                  </div>
                </div>

                <div className="flex justify-start mt-8">
                  <button
                    onClick={handleSaveGeneralSettings}
                    className="px-6 py-2 bg-orangeAction text-white  rounded-md hover:bg-yellow-600 font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notification Tab */}
            {activeTab === "notification" && (
              <div className="space-y-6">
                {/* <h2 className="text-2xl font-semibold text-center mb-6">Notification Settings</h2> */}

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <ToggleSwitch
                    isOn={notificationSettings.messageNotifications}
                    onToggle={() =>
                      handleNotificationToggle("messageNotifications")
                    }
                    label="Support Notification"
                  />
                  <div className="border-t border-gray-200 my-1"></div>

                  <ToggleSwitch
                    isOn={notificationSettings.transactionNotifications}
                    onToggle={() =>
                      handleNotificationToggle("transactionNotifications")
                    }
                    label="Payment Notification"
                  />
                  <div className="border-t border-gray-200 my-1"></div>

                  <ToggleSwitch
                    isOn={notificationSettings.emailNotifications}
                    onToggle={() =>
                      handleNotificationToggle("emailNotifications")
                    }
                    label="Email Notification"
                  />
                  <div className="flex justify-start mt-6">
                    <button
                      type="button"
                      onClick={handleSaveNotificationSettings}
                      disabled={notifLoading}
                      className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${
                        notifLoading ? "bg-gray-300 cursor-not-allowed" : "bg-orangeAction hover:bg-yellow-600"
                      }`}
                    >
                      {notifLoading ? "Loading..." : "Save Notification Settings"}
                   
                    </button>
                  </div>
                </div>

                {/* <div className="text-center text-sm text-brandGray mt-4">
                Toggle switches to enable or disable specific notification types
              </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsTab;
