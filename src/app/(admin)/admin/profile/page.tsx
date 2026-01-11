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
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto space-y-6">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-start gap-8 mb-10">
              {/* Profile Picture with Camera Icon */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg">
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
                  <div className="bg-white p-3 rounded-full">
                    <Camera className="w-6 h-6 text-gray-800" />
                  </div>
                </button>

                {/* Small Camera Icon at Bottom Right */}
                <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors"
                     onClick={handleCameraClick}>
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Name & Role */}
              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Admin</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    onClick={handleEditClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              {/* View / Edit Mode */}
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                  <InfoRow label="Full Name" value={formData.name} />
                  <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
                  <InfoRow label="Email Address" value={formData.email} />
                  <InfoRow label="Phone Number" value={formData.phoneNumber} />
                  <InfoRow label="Address" value={`${formData.street} ${formData.number}`} />
                  <InfoRow label="City" value={`${formData.zip} ${formData.city}`} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <Input value={tempFormData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input value={tempFormData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input type="email" value={tempFormData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                      <Input value={tempFormData.street} onChange={(e) => handleInputChange('street', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">House Number</label>
                      <Input value={tempFormData.number} onChange={(e) => handleInputChange('number', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <Input value={tempFormData.zip} onChange={(e) => handleInputChange('zip', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <Input value={tempFormData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Change Profile Picture</h3>

            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={tempPhoto || profilePic}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                />
                {tempPhoto && (
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                    <Check className="w-16 h-16 text-white" />
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

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Camera className="w-4 h-4 mr-2" />
                Choose Photo
              </Button>
              <Button
                onClick={handleSavePhoto}
                disabled={!tempPhoto}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Save Photo
              </Button>
            </div>

            <Button variant="ghost" className="w-full mt-4" onClick={handleCancelPhoto}>
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
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium text-gray-900 mt-1">{value}</p>
    </div>
  );
}