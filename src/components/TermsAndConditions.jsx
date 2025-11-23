import React, { useState } from 'react';
import { useGetTermsConditionsQuery, useUpdateTermsConditionsMutation } from '../redux/api/termsConditions/termsConditionsApi';
import { FiFileText, FiMail, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { BiShield, BiUser, BiData, BiCopyright, BiError, BiRefresh } from 'react-icons/bi';
import Swal from 'sweetalert2';

const TermsAndConditions = () => {
  const { data: apiData, isLoading, error } = useGetTermsConditionsQuery();
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsConditionsMutation();
  
  const termsData = apiData?.data;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Initialize form data when termsData is available
  React.useEffect(() => {
    if (termsData && !isEditing) {
      setFormData({
        title: termsData.title || '',
        acceptance_terms: termsData.acceptance_terms || '',
        app_purpose: termsData.app_purpose || '',
        user_responsibilities: termsData.user_responsibilities || '',
        data_usage: termsData.data_usage || '',
        intellectual_property: termsData.intellectual_property || '',
        limitation: termsData.limitation || '',
        updates: termsData.updates || '',
        contactUS: termsData.contactUS || ''
      });
    }
  }, [termsData, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateTerms({
        id: termsData.id,
        data: formData
      }).unwrap();
      
      Swal.fire({
        title: 'Success!',
        text: 'Terms and conditions updated successfully',
        icon: 'success',
        confirmButtonColor: '#ff9000'
      });
      
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update terms and conditions',
        icon: 'error',
        confirmButtonColor: '#ff9000'
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (termsData) {
      setFormData({
        title: termsData.title || '',
        acceptance_terms: termsData.acceptance_terms || '',
        app_purpose: termsData.app_purpose || '',
        user_responsibilities: termsData.user_responsibilities || '',
        data_usage: termsData.data_usage || '',
        intellectual_property: termsData.intellectual_property || '',
        limitation: termsData.limitation || '',
        updates: termsData.updates || '',
        contactUS: termsData.contactUS || ''
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
              {[...Array(6)].map((_, i) => (
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <BiError className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Terms</h2>
            <p className="text-gray-600">Unable to load terms and conditions. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sections = [
    {
      icon: BiShield,
      title: "Acceptance of Terms",
      field: "acceptance_terms",
      content: isEditing ? formData.acceptance_terms : termsData?.acceptance_terms,
      color: "text-blue-600"
    },
    {
      icon: FiFileText,
      title: "App Purpose",
      field: "app_purpose",
      content: isEditing ? formData.app_purpose : termsData?.app_purpose,
      color: "text-green-600"
    },
    {
      icon: BiUser,
      title: "User Responsibilities",
      field: "user_responsibilities",
      content: isEditing ? formData.user_responsibilities : termsData?.user_responsibilities,
      color: "text-purple-600"
    },
    {
      icon: BiData,
      title: "Data Usage",
      field: "data_usage",
      content: isEditing ? formData.data_usage : termsData?.data_usage,
      color: "text-orange-600"
    },
    {
      icon: BiCopyright,
      title: "Intellectual Property",
      field: "intellectual_property",
      content: isEditing ? formData.intellectual_property : termsData?.intellectual_property,
      color: "text-red-600"
    },
    {
      icon: BiError,
      title: "Limitations",
      field: "limitation",
      content: isEditing ? formData.limitation : termsData?.limitation,
      color: "text-yellow-600"
    },
    {
      icon: BiRefresh,
      title: "Updates",
      field: "updates",
      content: isEditing ? formData.updates : termsData?.updates,
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-grayLightBg p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
          <div className="text-center">
            <FiFileText className="w-16 h-16 text-orangePrimary mx-auto mb-4" />
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-3xl font-bold text-gray-800 mb-2 text-center bg-transparent border-b-2 border-orangePrimary focus:outline-none w-full max-w-md"
                placeholder="Terms and Conditions Title"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {termsData?.title || 'Terms and Conditions'}
              </h1>
            )}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <span>Created: {termsData?.createdAt ? formatDate(termsData.createdAt) : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BiRefresh className="w-4 h-4" />
                <span>Updated: {termsData?.updatedAt ? formatDate(termsData.updatedAt) : 'N/A'}</span>
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
                  Edit Terms
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    {isUpdating ? 'Saving...' : 'Save Changes'}
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

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full bg-gray-50 ${section.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {section.title}
                    </h3>
                    {isEditing ? (
                      <textarea
                        value={section.content || ''}
                        onChange={(e) => handleInputChange(section.field, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orangePrimary focus:border-transparent resize-none"
                        rows={4}
                        placeholder={`Enter ${section.title.toLowerCase()}...`}
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {section.content || 'Content not available'}
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
            <h3 className="text-2xl font-semibold mb-2">Need Help?</h3>
            <p className="mb-4 opacity-90">
              If you have any questions about these terms and conditions, please contact us.
            </p>
            {isEditing ? (
              <input
                type="email"
                value={formData.contactUS}
                onChange={(e) => handleInputChange('contactUS', e.target.value)}
                className="bg-white text-gray-800 px-6 py-3 rounded-full font-medium border-2 border-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Contact email"
              />
            ) : (
              <div className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-full font-medium">
                <FiMail className="w-4 h-4" />
                <span>{termsData?.contactUS || 'support@asdf.com'}</span>
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

export default TermsAndConditions;
