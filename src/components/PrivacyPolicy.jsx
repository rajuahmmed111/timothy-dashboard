import React, { useState } from "react";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "../redux/api/privacyPolicy/privacyPolicyApi";
import {
  FiShield,
  FiMail,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import {
  BiShield,
  BiUser,
  BiData,
  BiCopyright,
  BiError,
  BiRefresh,
  BiLock,
  BiGlobe,
} from "react-icons/bi";
import { MdSecurity, MdChildCare, MdNotifications } from "react-icons/md";
import Swal from "sweetalert2";

const PrivacyPolicy = () => {
  const { data: apiData, isLoading, error } = useGetPrivacyPolicyQuery();
  const [updatePolicy, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicyMutation();

  const policyData = apiData?.data;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Initialize form data when policyData is available
  React.useEffect(() => {
    if (policyData && !isEditing) {
      setFormData({
        title: policyData.title || "",
        introduction: policyData.introduction || "",
        information_collect: policyData.information_collect || [],
        how_useYour_data: policyData.how_useYour_data || [],
        data_security: policyData.data_security || "",
        third_party_services: policyData.third_party_services || "",
        user_control: policyData.user_control || [],
        children_privacy: policyData.children_privacy || "",
        changes_to_policy: policyData.changes_to_policy || "",
        contact_info: policyData.contact_info || "",
      });
    }
  }, [policyData, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      await updatePolicy({
        id: policyData.id,
        data: formData,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Privacy policy updated successfully",
        icon: "success",
        confirmButtonColor: "#ff9000",
      });

      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update privacy policy",
        icon: "error",
        confirmButtonColor: "#ff9000",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (policyData) {
      setFormData({
        title: policyData.title || "",
        introduction: policyData.introduction || "",
        information_collect: policyData.information_collect || [],
        how_useYour_data: policyData.how_useYour_data || [],
        data_security: policyData.data_security || "",
        third_party_services: policyData.third_party_services || "",
        user_control: policyData.user_control || [],
        children_privacy: policyData.children_privacy || "",
        changes_to_policy: policyData.changes_to_policy || "",
        contact_info: policyData.contact_info || "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grayLightBg p-6">
        <div className=" mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6 w-1/3"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="h-6 bg-gray-300 rounded mb-4 w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-grayLightBg p-6">
        <div className=" mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <BiError className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Error Loading Privacy Policy
            </h2>
            <p className="text-gray-600">
              Unable to load privacy policy. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sections = [
    {
      icon: BiShield,
      title: "Introduction",
      field: "introduction",
      content: isEditing ? formData.introduction : policyData?.introduction,
      color: "text-blue-600",
      type: "text",
    },
    {
      icon: BiData,
      title: "Information We Collect",
      field: "information_collect",
      content: isEditing
        ? formData.information_collect
        : policyData?.information_collect,
      color: "text-green-600",
      type: "array",
    },
    {
      icon: BiUser,
      title: "How We Use Your Data",
      field: "how_useYour_data",
      content: isEditing
        ? formData.how_useYour_data
        : policyData?.how_useYour_data,
      color: "text-purple-600",
      type: "array",
    },
    {
      icon: MdSecurity,
      title: "Data Security",
      field: "data_security",
      content: isEditing ? formData.data_security : policyData?.data_security,
      color: "text-orange-600",
      type: "text",
    },
    {
      icon: BiGlobe,
      title: "Third Party Services",
      field: "third_party_services",
      content: isEditing
        ? formData.third_party_services
        : policyData?.third_party_services,
      color: "text-red-600",
      type: "text",
    },
    {
      icon: BiLock,
      title: "User Control",
      field: "user_control",
      content: isEditing ? formData.user_control : policyData?.user_control,
      color: "text-indigo-600",
      type: "array",
    },
    {
      icon: MdChildCare,
      title: "Children's Privacy",
      field: "children_privacy",
      content: isEditing
        ? formData.children_privacy
        : policyData?.children_privacy,
      color: "text-pink-600",
      type: "text",
    },
    {
      icon: MdNotifications,
      title: "Changes to Policy",
      field: "changes_to_policy",
      content: isEditing
        ? formData.changes_to_policy
        : policyData?.changes_to_policy,
      color: "text-teal-600",
      type: "text",
    },
  ];

  const renderArrayField = (section) => {
    if (!isEditing) {
      return (
        <ul className="text-gray-600 leading-relaxed space-y-2">
          {(section.content || []).map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-2 h-2 bg-orangePrimary rounded-full mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-3">
        {(section.content || []).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(section.field, index, e.target.value)
              }
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orangePrimary focus:border-transparent"
              placeholder={`Enter ${section.title.toLowerCase()} item...`}
            />
            <button
              onClick={() => removeArrayItem(section.field, index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => addArrayItem(section.field)}
          className="flex items-center gap-2 text-orangePrimary hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Item
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-grayLightBg p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
          <div className="text-center">
            <FiShield className="w-16 h-16 text-orangePrimary mx-auto mb-4" />
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-3xl font-bold text-gray-800 mb-2 text-center bg-transparent border-b-2 border-orangePrimary focus:outline-none w-full max-w-md"
                placeholder="Privacy Policy Title"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {policyData?.title || "Privacy Policy"}
              </h1>
            )}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span>
                  Created:{" "}
                  {policyData?.createdAt
                    ? formatDate(policyData.createdAt)
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BiRefresh className="w-4 h-4" />
                <span>
                  Updated:{" "}
                  {policyData?.updatedAt
                    ? formatDate(policyData.updatedAt)
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Edit/Save/Cancel Buttons */}
            <div className="flex items-center justify-center gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-orangePrimary text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Policy
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full bg-gray-50 ${section.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {section.title}
                    </h3>
                    {section.type === "array" ? (
                      renderArrayField(section)
                    ) : isEditing ? (
                      <textarea
                        value={section.content || ""}
                        onChange={(e) =>
                          handleInputChange(section.field, e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orangePrimary focus:border-transparent resize-none"
                        rows={4}
                        placeholder={`Enter ${section.title.toLowerCase()}...`}
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {section.content || "Content not available"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orangePrimary to-orange-400 p-8 rounded-2xl shadow-sm mt-8 text-white">
          <div className="text-center">
            <FiMail className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Questions About Privacy?
            </h3>
            <p className="mb-4 opacity-90">
              If you have any questions about this privacy policy, please
              contact us.
            </p>
            {isEditing ? (
              <input
                type="email"
                value={formData.contact_info}
                onChange={(e) =>
                  handleInputChange("contact_info", e.target.value)
                }
                className="bg-white text-gray-800 px-6 py-3 rounded-full font-medium border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Contact email"
              />
            ) : (
              <div className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-medium">
                <FiMail className="w-4 h-4" />
                <span>{policyData?.contact_info || "support@example.com"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 TimberLens Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
