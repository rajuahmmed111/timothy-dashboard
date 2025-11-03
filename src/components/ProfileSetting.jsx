import React, { useState } from "react";
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";
import AdminProfile from "../pages/dashboard/components/AdminProfile";
import ProfileImgandName from "./ProfileImgandName";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  changePassword,
  getUserProfile,
  updateUserProfile,
} from "../redux/features/auth/authSlice";
import { useEffect } from "react";

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Form state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    address: user?.address || "",
    country: user?.country || "",
  });

  const token = localStorage.getItem("accessToken");

useEffect(() => {
  if (token && !user) {
    dispatch(getUserProfile());
  }
}, [token, user, dispatch]);

// Sync profile form state when user data is loaded
useEffect(() => {
  if (user) {
    setProfileData({
      fullName: user.fullName || "",
      email: user.email || "",
      contactNumber: user.contactNumber || "",
      address: user.address || "",
      country: user.country || "",
    });
  }
}, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("Profile Data to be saved:", profileData);

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save changes to your profile?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Profile update confirmed with data:", profileData);

        dispatch(updateUserProfile(profileData))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Saved!",
              text: "Your profile has been updated.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error("Update failed:", error);
            Swal.fire("Error", error || "Update failed", "error");
          });
      } else {
        console.log("Profile update cancelled");
      }
    });
  };

const handleUpdatePassword = async (e) => {
  e.preventDefault();
  console.log("Password Data to be updated:", passwordData);

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    console.log("Password mismatch error");
    Swal.fire({
      title: "Error!",
      text: "New password and confirm password do not match.",
      icon: "error",
      confirmButtonColor: "#EF4444",
    });
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to update your password?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, update it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#10B981",
    cancelButtonColor: "#EF4444",
  });

  if (result.isConfirmed) {
    try {
      await dispatch(
        changePassword({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        })
      ).unwrap();

      Swal.fire({
        title: "Updated!",
        text: "Your password has been changed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password update failed:", error);
      Swal.fire({
        title: "Failed!",
        text: error || "Something went wrong while updating password.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  } else {
    Swal.fire({
      title: "Cancelled!",
      text: "Password update cancelled",
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};


  const handleProfileImageChange = (newImageUrl) => {
    console.log(newImageUrl);

    dispatch(updateUserProfile({ profileImage: newImageUrl }))
      .unwrap()
      .then(() => {
        Swal.fire({
          title: "Profile Updated",
          text: "Profile image updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        Swal.fire("Error", error || "Image update failed", "error");
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          tip="Fetching user details..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-grayLightBg min-h-screen px-0 md:px-6 mb-10 font-sans">
      <AdminProfile headingText="User Settings" />
      <div className="max-w-2xl mx-auto">
        {/* Profile Header with Image */}
        <ProfileImgandName
          name={user?.fullName}
          img={user?.profileImage}
          role={user?.role}
          onImageUpload={handleProfileImageChange}
        />

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-8">
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium ${
              activeTab === "profile"
                ? "text-darkGray border-b-2 border-orangePrimary"
                : "text-brandGray hover:text-darkGray"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser />
            Edit Profile
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium ${
              activeTab === "password"
                ? "text-darkGray border-b-2 border-orangePrimary"
                : "text-brandGray hover:text-darkGray"
            }`}
            onClick={() => setActiveTab("password")}
          >
            <FiLock />
            Change Password
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Edit Your Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    readOnly
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Contact no
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={profileData.contactNumber}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 font-poppins border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 font-poppins border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Country</option>
                    <option value="Australia">Australia</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center my-8">
                <button
                  type="submit"
                  className="px-6 py-2 bg-orangeAction text-white rounded-md hover:bg-yellow-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handleUpdatePassword}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Change Password
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 font-poppins border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brandGray hover:text-darkGray"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 font-poppins border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brandGray hover:text-darkGray"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-darkGray mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 font-poppins border text-brandGray rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brandGray hover:text-darkGray"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="px-6 py-2 bg-orangeAction text-white rounded-md hover:bg-yellow-500 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
