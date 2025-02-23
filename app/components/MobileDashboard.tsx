import React from 'react';
import { Link2 } from 'lucide-react';
import AmbassadorSpotlight from './AmbassadorSpotlight';
import WonderWheel from './WonderWheel';
import DomeProfilePicture from './DomeProfilePicture';
import ComingSoonBlock from './Coming-soon';
import PackageDesigner from './PackageDesigner'; 
import ChallengesSection from './ChallengeSection';


type Activity = {
  type: string;
  platform?: string;
  date: string;
};

type Ambassador = {
  name: string;
  username: string;
  discountCode: string;
  recentActivity: Activity[];
};

type CommunityPost = {
  id: string | null;
  creator: string | null;
  mediaType: "video" | null;
  mediaUrl: string | null;
  mediaKey: string | null;
  caption: string | null;
  likes: number | null;
  points: number | null;
  createdAt: string | null;
  updatedAt: string;
  creatorProfileImage?: string;
};

interface MobileDashboardProps {
  ambassador: Ambassador;
  setShowVideoUploader: (show: boolean) => void;
  communityPosts: CommunityPost[];
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement }>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
  activeSection: 'home' | 'community' | 'messages' | 'profile' | 'game';
  profileImage?: { url: string } | null;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  ambassador,
  setShowVideoUploader,
  activeSection,
  profileImage
  
  
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'community':
        return (
          <div className="space-y-4">
            {/* Compact Ambassador Spotlight */}
            <div className="px-4">
            <div className="aspect-square w-full max-w-[350px] mx-auto"> {/* This makes it square */}
              <AmbassadorSpotlight compact />
            </div>
            </div>
            {/* Community Posts */}
            <div className="space-y-4">
              {/*communityPosts.map((post) => (
                <VideoPost
                  key={post.id}
                  post={post}
                  videoRefs={videoRefs}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  isMobile={true}
                />
              ))*/}
            </div>
          </div>
        );

      // In MobileDashboard.tsx, update the renderContent function

      case 'messages':
        return (
          <div className="min-h-screen bg-[#fff6f9]">
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold text-pink-500 mb-4">Challenges</h2>
                <ChallengesSection />
              </div>
            </div>
          </div>
        );
      

       case 'game':
        return (
          <div className="min-h-screen pt-20 px-4">
            {/* WonderWheel Section */}
            <div className="w-full mx-auto overflow-x-hidden flex justify-center items-center mb-8">
              <div className="w-full object-contain">
                <WonderWheel />
              </div>
            </div>

            {/* PackageDesigner Section */}
            <div className="w-full">
              <div className="aspect-square w-full max-w-[300px] mx-auto">
                <PackageDesigner />
              </div>
            </div>

            {/* Icons and Controls Section */}
            <div className="w-full px-4 space-y-4">
              {/* Icons and controls will automatically flow here from PackageDesigner */}
            </div>
          </div>
        );

            
        case 'home':
        default:
          return (
                <div className="space-y-4 px-4">
                  {/* Welcome Card */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        <DomeProfilePicture 
                          profileImage={profileImage?.url || null}
                          isLoading={false}
                          size="sm"
                          showUploadButton={false}
                        />
                      </div>
                      
                      {/* Welcome Text */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-[#ff47b0] mb-2">
                          Welcome to our World ✨
                        </h3>
                        <p className="text-[#ff47b0]">
                          Whimsical Fragrance meets Clinically Effective and Sensory Friendly Bodycare
                        </p>
                      </div>
                    </div>
                    
                    {/* Social Links - Below profile picture and welcome text */}
                    <div className="space-y-1 text-sm">
                      <p className="text-[#ff47b0]"><span className="font-medium">TikTok:</span> @wonderverselab</p>
                      <p className="text-[#ff47b0]"><span className="font-medium">Instagram:</span> @wonderverselab, @thewondysociety_</p>
                      <p className="text-[#ff47b0]"><span className="font-medium">YouTube:</span> @thewonderverselabs</p>
                      <p className="text-[#ff47b0]"><span className="font-medium">Lemon8:</span> @thewonderverse</p>
                    </div>
                  </div>

            {/* Discount Code */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2 text-[#ff47b0]">Your Discount Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ambassador.discountCode}
                  readOnly
                  className="flex-1 p-2 border rounded bg-gray-50"
                />
                <button 
                    onClick={() => navigator.clipboard.writeText(ambassador.discountCode)}
                    className="p-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                    >
                  <Link2 size={20} />
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <a 
                  href="https://www.thewonderverselabs.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all text-sm flex items-center gap-2"
                >
                  ✨ Wonderverse
                </a>
              </div>
            </div>
             {/* Coming Soon Section */}
             <div className="bg-white p-4 rounded-lg shadow-sm">
              <ComingSoonBlock />
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#ff47b0]">Recent Activity</h3>
                <button 
                  onClick={() => setShowVideoUploader(true)}
                  className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 flex items-center gap-1"
                >
                  Add Content <span className="text-lg">+</span>
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {ambassador.recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                    <p className="font-medium text-[#ff47b0]">{activity.type}</p>
                    <p className="text-sm text-[#ff47b0]/70">{activity.date}</p>
                    </div>

                </div>
                ))}
              </div>
            </div>

            {/* Recent Videos */}
            <div className="space-y-4">
              <h3 className="font-semibold">Recent Videos</h3>
              {/*communityPosts.map((post) => (
                <VideoPost
                  key={post.id}
                  post={post}
                  videoRefs={videoRefs}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  isMobile={true}
                />
              ))*/}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {renderContent()}
    </div>
  );
};

export default MobileDashboard;