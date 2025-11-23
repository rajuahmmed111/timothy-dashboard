import AdminProfile from "./components/AdminProfile";
import Dashboard from "../../components/Dashboard";

export default function DashboardHome() {
  return (
    <div className="space-y-6 bg-grayLightBg min-h-screen md:px-6 ">
      <AdminProfile headingText="Dashboard" />

      <Dashboard></Dashboard>
    </div>
  );
}
