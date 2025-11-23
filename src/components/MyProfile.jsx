import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome, {user?.displayName || "User"}!
      </h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={user?.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 ring ring-green-300 text-center"
          />
          <h2 className="text-2xl font-semibold">{user?.displayName}</h2>
          <p className="text-brandGray">{user?.email}</p>
        </div>
        <button
          onClick={() => navigate("/update-profile")}
          className="btn w-full my-2 bg-green-50 px-10 hover:bg-green-800 hover:text-white font-medium border border-green-500"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
