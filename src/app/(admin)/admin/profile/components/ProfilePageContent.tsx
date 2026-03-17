/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import ProfileHeaderSection from "./ProfileHeaderSection";
import ProfilePersonalInfoSection from "./ProfilePersonalInfoSection";
import ProfilePhotoModal from "./ProfilePhotoModal";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profilePic, setProfilePic] = useState<string>(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  );
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "David Chen",
    dateOfBirth: "26.11.2003",
    email: "schafertutoring@gmail.com",
    phoneNumber: "+839571238",
    street: "Goethe Street",
    number: "51",
    zip: "8751",
    city: "Munich",
  });

  const [tempFormData, setTempFormData] = useState({ ...formData });

  const handleEditClick = () => {
    setIsEditing(true);
    setTempFormData({ ...formData });
  };

  const handleSave = () => {
    setFormData({ ...tempFormData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof typeof tempFormData,
    value: string,
  ) => {
    setTempFormData({ ...tempFormData, [field]: value });
  };

  // Photo Upload Handlers
  const handleCameraClick = () => {
    setShowPhotoModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (tempPhoto) {
      setProfilePic(tempPhoto);
    }
    setShowPhotoModal(false);
    setTempPhoto(null);
  };

  const handleCancelPhoto = () => {
    setShowPhotoModal(false);
    setTempPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <ProfileHeaderSection
              name={formData.name}
              profilePic={profilePic}
              onCameraClick={handleCameraClick}
            />
            <ProfilePersonalInfoSection
              isEditing={isEditing}
              formData={formData}
              tempFormData={tempFormData}
              onEdit={handleEditClick}
              onCancel={handleCancel}
              onSave={handleSave}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {showPhotoModal && (
        <ProfilePhotoModal
          profilePic={profilePic}
          tempPhoto={tempPhoto}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onSavePhoto={handleSavePhoto}
          onCancelPhoto={handleCancelPhoto}
        />
      )}
    </>
  );
}
