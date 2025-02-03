import React, { useState } from 'react';
import { Video, X } from 'lucide-react';
import { FileUploader } from './FileUploader';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';

interface VideoUploaderProps {
  onUploadComplete: (videoData: {
    url: string;
    key: string;
    thumbnail?: string;
  }) => void;
  onClose: () => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [caption, setCaption] = useState('');
  
  const handleVideoUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Validate file type and size
      const fileType = file.type;
      if (!fileType.startsWith('video/')) {
        throw new Error('Please upload a valid video file');
      }

      // 100MB limit
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('Video must be less than 100MB');
      }

      console.log('Starting upload of file:', {
        size: file.size,
        type: fileType,
        name: file.name
      });

      const currentUser = await getCurrentUser();
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const videoKey = `community-videos/${currentUser.userId}_${timestamp}.${fileExtension}`;

      // Upload video
      await uploadData({
        data: file,
        key: videoKey,
        options: {
          contentType: fileType,
          accessLevel: 'guest',
          onProgress: ({ transferredBytes, totalBytes }) => {
            console.log('Progress:', { transferredBytes, totalBytes }); // Debug log
            if (totalBytes && totalBytes > 0) {
              const progress = (transferredBytes / totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            } else {
              // If totalBytes is not available, show indeterminate progress
              setUploadProgress(0);
            }
          },
        }
      }).result;

      // Add small delay to ensure file is available
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get video URL
      const urlResult = await getUrl({
        key: videoKey,
        options: {
          accessLevel: 'guest',
          validateObjectExistence: true
        }
      });

      onUploadComplete({
        url: urlResult.url.href,
        key: videoKey,
        thumbnail: '/api/placeholder/1080/1920' // You can implement actual thumbnail generation here
      });

    } catch (error) {
      console.error('Error uploading video:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Content</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Video Upload Area */}
          <FileUploader
            onFileSelect={handleVideoUpload}
            accept="video/*"
            maxSize={100 * 1024 * 1024}
          >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
              <Video className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Drag and drop or click to upload your video
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: 100MB
              </p>
              {isLoading && (
                <div className="w-full mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>
          </FileUploader>

          {/* Caption Input */}
          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Caption
            </label>
            <textarea
              id="caption"
              rows={3}
              className="w-full border rounded-lg p-2 text-sm"
              placeholder="Write a caption for your video..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};