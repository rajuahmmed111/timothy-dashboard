import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import { ImSpinner2 } from "react-icons/im"; // for loading spinner

const ProfileImgandName = ({ name = "N/A", img = "N/A", role = "N/A", onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState(img);
  const [isUploading, setIsUploading] = useState(false);

  // Keep preview in sync when parent updates user image
  useEffect(() => {
    setImagePreview(img);
  }, [img]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to change your profile picture?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#EF4444",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            setIsUploading(true);
            // Show local preview instantly
            const localUrl = URL.createObjectURL(file);
            setImagePreview(localUrl);
            // Pass File to parent to upload to backend
            onImageUpload && onImageUpload(file);
            Swal.fire({
              title: "Uploading...",
              text: "We are updating your profile picture.",
              icon: "info",
              timer: 800,
              showConfirmButton: false,
            });
          } finally {
            setTimeout(() => setIsUploading(false), 800);
          }
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative mb-4" {...getRootProps()}>
        <input {...getInputProps()} />
        <img
          src={imagePreview}
          alt="Profile"
          className="w-[140px] h-[140px] rounded-full object-cover border-4 border-white shadow-md"
        />
        <button
          type="button"
          onClick={open}
          disabled={isUploading}
          className={`absolute bottom-0 right-0 p-2 rounded-full transition-colors ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-orangePrimary text-white"
          }`}
        >
          {isUploading ? (
            <ImSpinner2 className="animate-spin text-lg" />
          ) : (
            <FiEdit className="text-lg" />
          )}
        </button>
      </div>
      <h1 className="text-2xl font-bold text-center">{name}{`(${role})`}</h1>
    </div>
  );
};

export default ProfileImgandName;
