import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import { ImSpinner2 } from "react-icons/im"; // for loading spinner

const CLOUDINARY_UPLOAD_PRESET = "DashboardImage";
const CLOUDINARY_CLOUD_NAME = "didsuo0le"; // 🔁 Replace this with your actual Cloudinary cloud name

const ProfileImgandName = ({ name = "N/A", img = "N/A", role = "N/A",onImageUpload  }) => {
  const [imagePreview, setImagePreview] = useState(img);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setImagePreview(data.secure_url); // ⬅️ Set uploaded image
         
          onImageUpload(data.secure_url);
        

        Swal.fire({
          title: "Uploaded!",
          text: "Your profile picture has been changed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to upload the image.",
        icon: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
          uploadToCloudinary(file);
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
