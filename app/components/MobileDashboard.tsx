import React from 'react';
import { Star, Heart, Share2 } from 'lucide-react';

// Define the types we need
interface Activity {
  type: string;
  platform?: string;
  points: number;
  date: string;
}

interface Ambassador {
  name: string;
  username: string;
  points: number;
  tier: string;
  discountCode: string;
  recentActivity: Activity[];
}

interface CommunityPost {
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
}

interface MobileDashboardProps {
  ambassador: Ambassador;
  setShowVideoUploader: React.Dispatch<React.SetStateAction<boolean>>;
  communityPosts: CommunityPost[];
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement }>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  ambassador,
  setShowVideoUploader,
  communityPosts,
  videoRefs,
  currentlyPlaying,
  setCurrentlyPlaying
}) => {
  return (
    <div className="pt-16 px-4 space-y-6 bg-pink-50 min-h-screen pb-20">
      {/* Welcome Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-xl text-pink-500 mb-2">
          Welcome to our World ✨
        </h3>
        <p className="text-gray-600 text-sm">
          Whimsical Fragrance meets Clinically Effective and Sensory Friendly Bodycare
        </p>
      </div>

      {/* Discount Code Card */}
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
            onClick={() => {
              navigator.clipboard.writeText(ambassador.discountCode);
            }}
            className="p-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Quick Stats */}
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
            className="px-3 py-1 bg-pink-500 text-white text-sm rounded-full hover:bg-pink-600 transition-colors"
          >
            Add +
          </button>
        </div>
        <div className="space-y-3 max-h-40 overflow-y-auto">
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
          <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <video
                ref={el => {
                  if (el && post.id) {
                    videoRefs.current[post.id] = el;
                  }
                }}
                className="w-full aspect-[9/16] object-cover"
                loop
                playsInline
                muted
                onClick={() => {
                  const video = videoRefs.current[post.id!];
                  if (video) {
                    if (video.paused) {
                      video.play();
                      setCurrentlyPlaying(post.id);
                    } else {
                      video.pause();
                      setCurrentlyPlaying(null);
                    }
                  }
                }}
              >
                <source src={post.mediaUrl ?? undefined} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                    <img
                      src={post.creatorProfileImage || "/default-avatar.png"}
                      alt={post.creator ?? "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white text-sm">@{post.creator}</span>
                </div>
              </div>
              
              <div className="absolute right-2 bottom-16 flex flex-col gap-3">
                <button className="bg-pink-500/80 p-2 rounded-full text-white">
                  <Heart size={16} />
                  <span className="text-xs block">{post.likes || 0}</span>
                </button>
                <button className="bg-pink-500/80 p-2 rounded-full text-white">
                  <Star size={16} />
                  <span className="text-xs block">{post.points || 0}</span>
                </button>
                <button className="bg-pink-500/80 p-2 rounded-full text-white">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileDashboard;