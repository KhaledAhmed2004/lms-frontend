/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Camera, Check } from "lucide-react";
import React from "react";

type ProfilePhotoModalProps = {
  profilePic: string;
  tempPhoto: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSavePhoto: () => void;
  onCancelPhoto: () => void;
};

export default function ProfilePhotoModal({
  profilePic,
  tempPhoto,
  fileInputRef,
  onFileChange,
  onSavePhoto,
  onCancelPhoto,
}: ProfilePhotoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Change Profile Picture
        </h3>

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
          onChange={onFileChange}
          className="hidden"
          id="photo-upload"
        />

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => document.getElementById("photo-upload")?.click()}
          >
            <Camera className="w-4 h-4 mr-2" />
            Choose Photo
          </Button>
          <Button
            onClick={onSavePhoto}
            disabled={!tempPhoto}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Save Photo
          </Button>
        </div>

        <Button variant="ghost" className="w-full mt-4" onClick={onCancelPhoto}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
