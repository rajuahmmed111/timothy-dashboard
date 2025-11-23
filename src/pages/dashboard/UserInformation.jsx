import { useState } from "react";
import AdminProfile from "./components/AdminProfile";
import UsersTable from "./components/UsersTable";
import ServiceProvider from "./ServiceProviders/ServiceProvider";

export default function UserInformation() {
  const [activeTab, setActiveTab] = useState("PARTNER"); // PARTNER | USERS

  return (
    <div className=" bg-grayLightBg min-h-screen md:px-6 px-0">
      <AdminProfile headingText="Users Management" />

      {/* Tabs */}
      <div className="rounded-t-md ">
        <div className="flex gap-8 px-4 pt-4">
          <button
            className={`text-lg font-semibold ${
              activeTab === "PARTNER" ? "text-orangePrimary" : "text-brandGray"
            }`}
            onClick={() => setActiveTab("PARTNER")}
          >
            Partner
          </button>
          <button
            className={`text-lg font-semibold ${
              activeTab === "USERS" ? "text-orangePrimary" : "text-brandGray"
            }`}
            onClick={() => setActiveTab("USERS")}
          >
            Users
          </button>
        </div>
        {/* Underline indicator */}
        <div className="relative h-6 mt-1">
          <div className="absolute left-4 right-4 top-5 h-[2px] w-1/2 max-w-[12rem] bg-[#edd8bf]" />
          <div
            className={`absolute top-5 h-[3px] bg-orangePrimary rounded transition-all duration-300 ${
              activeTab === "PARTNER" ? "left-4 w-24" : "left-32 w-20"
            }`}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "PARTNER" ? (
          <ServiceProvider hideHeader embedded />
        ) : (
          <UsersTable />
        )}
      </div>
    </div>
  );
}
