import React from 'react';
import { Star, Heart, Share2, Link2 } from 'lucide-react';
import VideoPost from './VideoPost';
import AmbassadorSpotlight from './AmbassadorSpotlight';
import WonderWheel from './WonderWheel';
import MessageDashboard from './MessageDashboard';

type Activity = {
  type: string;
  platform?: string;
  points: number;
  date: string;
};

type Ambassador = {
  name: string;
  username: string;
  points: number;
  tier: string;
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
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  ambassador,
  setShowVideoUploader,
  communityPosts,
  videoRefs,
  currentlyPlaying,
  setCurrentlyPlaying,
  activeSection
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'community':
        return (
          <div className="space-y-4">
            {/* Compact Ambassador Spotlight */}
            <div className="px-4">
              <AmbassadorSpotlight compact />
            </div>

            {/* Community Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <VideoPost
                  key={post.id}
                  post={post}
                  videoRefs={videoRefs}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  isMobile={true}
                />
              ))}
            </div>
          </div>
        );

      case 'messages':
        return <MessageDashboard />;

      case 'game':
        return (
          <div className="px-4">
            <WonderWheel />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-4 px-4">
            {/* Welcome Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-xl text-pink-500 mb-2">
                Welcome to our World ✨
              </h3>
              <p className="text-gray-600 text-sm">
                Whimsical Fragrance meets Clinically Effective and Sensory Friendly Bodycare
              </p>
              
              <div className="mt-4 space-y-1 text-sm">
                <p><span className="font-medium">TikTok:</span> @wonderverselab</p>
                <p><span className="font-medium">Instagram:</span> @wonderverselab, @thewondysociety_</p>
                <p><span className="font-medium">YouTube:</span> @thewonderverselabs</p>
                <p><span className="font-medium">Lemon8:</span> @thewonderverse</p>
              </div>
            </div>

            {/* Discount Code */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Your Discount Code</h3>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-pink-500 text-xl font-bold">{ambassador.points}</div>
                <div className="text-sm text-gray-500">Total Points</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-pink-500 text-xl font-bold">{ambassador.tier}</div>
                <div className="text-sm text-gray-500">Current Tier</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
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
                      <p className="font-medium text-sm">{activity.type}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <span className="text-pink-500 font-semibold">+{activity.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Videos */}
            <div className="space-y-4">
              <h3 className="font-semibold">Recent Videos</h3>
              {communityPosts.map((post) => (
                <VideoPost
                  key={post.id}
                  post={post}
                  videoRefs={videoRefs}
                  currentlyPlaying={currentlyPlaying}
                  setCurrentlyPlaying={setCurrentlyPlaying}
                  isMobile={true}
                />
              ))}
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