/* eslint-disable @next/next/no-img-element */
import { Camera } from "lucide-react";

type ProfileHeaderSectionProps = {
  name: string;
  profilePic: string;
  onCameraClick: () => void;
};

export default function ProfileHeaderSection({
  name,
  profilePic,
  onCameraClick,
}: ProfileHeaderSectionProps) {
  return (
    <div className="flex items-start gap-8 mb-10">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={onCameraClick}
          className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <div className="bg-white p-3 rounded-full">
            <Camera className="w-6 h-6 text-gray-800" />
          </div>
        </button>

        <div
          className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={onCameraClick}
        >
          <Camera className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex-1 pt-4">
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        <p className="text-lg text-gray-600 mt-1">Admin</p>
      </div>
    </div>
  );
}
