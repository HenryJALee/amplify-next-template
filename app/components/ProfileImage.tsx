import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { ProfileImageType } from '../hooks/useProfileImage';
import { FileUploader } from './FileUploader';

type ProfileImageProps = {
  profileImage: ProfileImageType | null;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onImageUpload?: (file: File) => Promise<void>;
  onImageRemove?: () => Promise<void>;
  showUploadButton?: boolean;
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-32 h-32'
};

const iconSizes = {
  sm: 24,
  md: 64,
  lg: 48
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  profileImage,
  isLoading = false,
  size = 'md',
  onImageUpload,
  onImageRemove,
  showUploadButton = false
}) => {
  const handleFileSelect = async (file: File) => {
    if (onImageUpload) {
      await onImageUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-pink-100`}>
          {isLoading ? (
            <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
            </div>
          ) : profileImage ? (
            <Image
              src={profileImage.url}
              alt="Profile"
              width={size === 'sm' ? 48 : size === 'md' ? 96 : 128}
              height={size === 'sm' ? 48 : size === 'md' ? 96 : 128}
              className="object-cover w-full h-full"
              priority
            />
          ) : (
            <User size={iconSizes[size]} className="text-gray-400" />
          )}
        </div>
      </div>

      {showUploadButton && onImageUpload && (
        <div className="flex-1">
          <FileUploader
            onFileSelect={handleFileSelect}
            accept="image/*"
            maxSize={10 * 1024 * 1024}
          >
            <div className="flex flex-col">
              <button
                type="button"
                className="px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 
                          transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Upload new photo
              </button>
              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or GIF up to 10MB
              </p>
              {profileImage && onImageRemove && (
                <button
                  onClick={onImageRemove}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 
                            focus:outline-none focus:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
          </FileUploader>
        </div>
      )}
    </div>
  );
};