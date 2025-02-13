import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { ProfileImageType } from '../../hooks/useProfileImage';
import { FileUploader } from '../FileUploader';


interface DomeProfilePictureProps {
  profileImage: ProfileImageType | null;
  className?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onImageUpload?: (file: File) => Promise<void>;
  onImageRemove?: () => Promise<void>;
  showUploadButton?: boolean;
}

const DomeProfilePicture: React.FC<DomeProfilePictureProps> = ({
  profileImage,
  className='',
  isLoading = false,
  size = 'md',
  onImageUpload,
  onImageRemove,
  showUploadButton = false
}) => {
  
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  }

  const handleFileSelect = async (file: File) => {
    if (onImageUpload) {
      await onImageUpload(file);
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} border-none outline-none`}>
      <div className="relative"></div>
        <svg 
            className="w-full h-full" 
            viewBox="0 0 400 500" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <mask id="domeMask">
                <path 
                  fill="white" 
                  d="M20,200 A180,180 0 0,1 380,200 L380,450 L20,450 Z"
                />
              </mask>
              <pattern 
                id="imagePattern" 
                patternUnits="userSpaceOnUse" 
                width="400" 
                height="500"
              >
                {profileImage?.url ? (
                  <image
                    href={profileImage.url}
                    width="400"
                    height="500"
                    x="0"
                    y="0"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  // Default Profile Picture
                  <svg 
                    width="400"
                    height="500"
                    viewBox="0 0 400 500"
                  >
                    <rect 
                      width="400" 
                      height="500" 
                      fill="#fce7f3"  // pink-100
                    />
                    <circle 
                      cx="200" 
                      cy="280" 
                      r="135" 
                      fill="#ff47b0"  // new pink color
                    />
                    <g transform="translate(80, 165) scale(10)">
                      <path 
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                        fill="#fbcfe8"  // lighter pink (pink-200)
                      />
                    </g>
                  </svg>
                )}
              </pattern>
            </defs>

            {/* Background rect with pattern */}
            <rect 
              width="400" 
              height="500" 
              fill="url(#imagePattern)" 
              mask="url(#domeMask)"
            />
          </svg>
        <div>
          {showUploadButton && onImageUpload && (
            <div className="flex-1">
              <FileUploader
                onFileSelect={handleFileSelect}
                accept="image/*"
                maxSize={2 * 1024 * 1024}
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 
                              transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Upload new photo
                  </button>
                 {/* <p className="mt-2 text-sm text-gray-500">
                    JPG, PNG or GIF up to 2MB
                  </p> } 
                  {profileImage && onImageRemove && (
                    <button
                      onClick={onImageRemove}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 
                                focus:outline-none focus:underline"
                    >
                      Remove photo
                    </button>
                  )*/}
                </div>
              </FileUploader>
            </div>
          )} 
      </div>
    </div>
  )
};

export default DomeProfilePicture;



