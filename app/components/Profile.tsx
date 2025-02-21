import React, { useState, useEffect } from 'react';
import { getUrl } from '@aws-amplify/storage';
import { User } from '../types/user';
import { CommunityPostType } from '../types/communitypost';
import VideoPost from './VideoPost';

interface ProfileProps {
  ambassador: User | null;
  setShowVideoUploader: (show: boolean) => void;
  communityPosts: CommunityPostType[];
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement }>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
  isLoading: boolean;
}

const Profile: React.FC<ProfileProps> = ({
  ambassador,
  setShowVideoUploader,
  communityPosts,
  videoRefs,
  currentlyPlaying,
  setCurrentlyPlaying,
  isLoading
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (ambassador?.profileImageKey) {
        try {
          const signedURL = await getUrl({
            key: ambassador.profileImageKey,
            options: {
              accessLevel: 'guest',
              validateObjectExistence: true
            }
          });
          setProfileImage(signedURL.url.href);
        } catch (error) {
          console.error('Error loading profile image:', error);
        }
      }
    };

    loadProfileImage();
  }, [ambassador?.profileImageKey]);

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <img
                src={profileImage || "/default-avatar.png"}
                alt={ambassador?.username || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {ambassador?.username || "Loading..."}
              </h1>
              <p className="text-gray-600">{ambassador?.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowVideoUploader(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Upload New Video
          </button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
            </div>
          ) : communityPosts.length > 0 ? (
            communityPosts.map((post) => (
              <div key={post.id} className="relative">
                <VideoPost
                  post={post}
                  videoRefs={videoRefs}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  style={{ maxWidth: '100%', margin: '0 auto' }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No videos uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
