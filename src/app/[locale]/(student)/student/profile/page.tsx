/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef } from 'react';
import { Edit, Check, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profilePic, setProfilePic] = useState<string>(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop"
  );
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: 'David Chen',
    dateOfBirth: '26.11.2003',
    email: 'schafertutoring@gmail.com',
    phoneNumber: '+839571238',
    street: 'Goethe Street',
    number: '51',
    zip: '8751',
    city: 'Munich',
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

  const handleInputChange = (field: string, value: string) => {
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
            {/* Profile Picture with Camera Icon */}
            <div className="relative group mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 shadow-lg">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Camera Icon Overlay */}
              <button
                onClick={handleCameraClick}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="bg-white p-2 sm:p-2.5 lg:p-3 rounded-full">
                  <Camera className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-800" />
                </div>
              </button>

              {/* Small Camera Icon at Bottom Right */}
              <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-blue-600 p-1.5 sm:p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors"
                   onClick={handleCameraClick}>
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white" />
              </div>
            </div>

            {/* Name & Role */}
            <div className="flex-1 text-center sm:text-left sm:pt-2 lg:pt-4">
              <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{formData.name}</h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">Student</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-t border-gray-200 pt-6 sm:pt-7 lg:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-7 lg:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Personal Information</h2>
              {!isEditing ? (
                <Button
                  onClick={handleEditClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium h-9 sm:h-10 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button variant="outline" onClick={handleCancel} className="h-9 sm:h-10 text-sm sm:text-base order-2 sm:order-1">
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 h-9 sm:h-10 text-sm sm:text-base order-1 sm:order-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {/* View / Edit Mode */}
            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 text-gray-700">
                <InfoRow label="Full Name" value={formData.name} />
                <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
                <InfoRow label="Email Address" value={formData.email} />
                <InfoRow label="Phone Number" value={formData.phoneNumber} />
                <InfoRow label="Address" value={`${formData.street} ${formData.number}`} />
                <InfoRow label="City" value={`${formData.zip} ${formData.city}`} />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Date of Birth</label>
                    <Input className="h-9 sm:h-10 text-sm sm:text-base" value={tempFormData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Phone Number</label>
                    <Input className="h-9 sm:h-10 text-sm sm:text-base" value={tempFormData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Email Address</label>
                  <Input className="h-9 sm:h-10 text-sm sm:text-base" type="email" value={tempFormData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Street</label>
                    <Input className="h-9 sm:h-10 text-sm sm:text-base" value={tempFormData.street} onChange={(e) => handleInputChange('street', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">House Number</label>
                    <Input className="h-9 sm:h-10 text-sm sm:text-base" value={tempFormData.number} onChange={(e) => handleInputChange('number', e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">ZIP Code</label>
                    <Input className="h-9 sm:h-10 text-sm sm:text-base" value={tempFormData.zip} onChange={(e) => handleInputChange('zip', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">City</label>
                    <Input className="h-9 sm:h-10 text-sm sm:text-base" value={tempFormData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Change Profile Picture</h3>

            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <img
                  src={tempPhoto || profilePic}
                  alt="Preview"
                  className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-gray-200"
                />
                {tempPhoto && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <Check className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="flex-1 h-9 sm:h-10 text-sm sm:text-base"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Choose Photo
              </Button>
              <Button
                onClick={handleSavePhoto}
                disabled={!tempPhoto}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 h-9 sm:h-10 text-sm sm:text-base"
              >
                Save Photo
              </Button>
            </div>

            <Button variant="ghost" className="w-full mt-3 sm:mt-4 h-9 sm:h-10 text-sm sm:text-base" onClick={handleCancelPhoto}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// Helper Component for View Mode
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mt-0.5 sm:mt-1 break-words">{value}</p>
    </div>
  );
}