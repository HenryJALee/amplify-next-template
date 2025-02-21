// components/ResponsiveLayout.tsx
import React from 'react';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import MobileNav from './MobileNav';
import MobileDashboard from './MobileDashboard';
import DomeProfilePicture from './DomeProfilePicture';
import { VideoUploader } from './VideoUploader';

interface ResponsiveLayoutProps {
  isMobile: boolean;
  activeSection: 'home' | 'community' | 'messages' | 'profile' | 'game';
  setActiveSection: (section: 'home' | 'community' | 'messages' | 'profile' | 'game') => void;
  userData: any; // Type this properly based on your User type
  ambassador: any; // Type this properly based on your Ambassador type
  profileImage: string | null;
  imageLoading: boolean;
  handleImageUpload: (file: File) => Promise<void>;
  handleImageRemove: () => Promise<void>;
  handleSignOut: () => void;
  showVideoUploader: boolean;
  setShowVideoUploader: React.Dispatch<React.SetStateAction<boolean>>;
  handleVideoUploadComplete: (key: string, url: string) => void;
  renderContent: () => React.ReactNode;
  communityPosts: any[]; // Type this properly based on your CommunityPost type
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement }>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  isMobile,
  activeSection,
  setActiveSection,
  userData,
  ambassador,
  profileImage,
  imageLoading,
  handleImageUpload,
  handleImageRemove,
  handleSignOut,
  showVideoUploader,
  setShowVideoUploader,
  handleVideoUploadComplete,
  renderContent,
  communityPosts,
  videoRefs,
  currentlyPlaying,
  setCurrentlyPlaying
}) => {
  return (
    <div className="min-h-screen bg-wonder-pink">
      {isMobile ? (
        <>
          <MobileNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            userData={userData}
            ambassador={ambassador}
            profileImageUrl={profileImage}
            handleSignOut={handleSignOut}
            setShowVideoUploader={setShowVideoUploader}
          />
          <main className="pt-16">
            {activeSection === 'home' && (
              <MobileDashboard
                ambassador={ambassador}
                setShowVideoUploader={setShowVideoUploader}
                communityPosts={communityPosts}
                videoRefs={videoRefs}
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
                activeSection={activeSection} 
              />
            )}
            {activeSection !== 'home' && renderContent()}
          </main>
        </>
      ) : (
        <div className="flex min-h-screen bg-wonder-pink">
          {/* Desktop Sidebar */}
          <div className="w-72 bg-[#fff6f9]">
            {/* Your existing sidebar content */}
            <div className="flex flex-col">
              {/* ... rest of your desktop sidebar ... */}
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </div>
      )}

      {showVideoUploader && (
        <VideoUploader
          onUploadComplete={handleVideoUploadComplete}
          onClose={() => setShowVideoUploader(false)}
        />
      )}
    </div>
  );
};

export default ResponsiveLayout;