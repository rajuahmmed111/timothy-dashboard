import AdminProfile from "./components/AdminProfile";
import UsersTable from "./components/UsersTable";

export default function UserInformation() {
  return (
    <div className=" bg-grayLightBg min-h-screen md:px-6 px-0">
      <AdminProfile headingText="Users Management" />
      <UsersTable />
    </div>
  );
}
