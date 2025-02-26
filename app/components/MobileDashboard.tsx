import React from 'react';
import { Link2 } from 'lucide-react';
import AmbassadorSpotlight from './AmbassadorSpotlight';
import WonderWheel from './WonderWheel';
import DomeProfilePicture from './DomeProfilePicture';
import ComingSoonBlock from './Coming-soon';
import PackageDesigner from './PackageDesigner'; 
import ChallengesSection from './ChallengeSection';
import PinkYachtClubBanner from '../components/PinkYachtClubBanner';
import { Instagram, Youtube, MessageCircle, Github } from 'lucide-react';
import { ProfileImageType } from '../hooks/useProfileImage';


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
  profileImage: ProfileImageType | null;
  onImageUpload?: (file: File) => Promise<void>; // Change from void to Promise<void>
  onImageRemove?: () => Promise<void>;
  isLoadingProfile?: boolean; // A
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  ambassador,
  setShowVideoUploader,
  activeSection,
  profileImage ,
  onImageUpload,
  onImageRemove  
}) => {
  // Add console.log here, before renderContent
  console.log('Current activeSection:', activeSection);

  const renderContent = () => {
    // Add console.log here, inside renderContent
    console.log('Rendering section:', activeSection);

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
        console.log('Entering messages case'); // Add this debug log
        return (
          <div className="min-h-screen bg-[#fff6f9]">
            <div className="p-4">
              {/* Add a temporary debug heading */}
              <h1 className="text-pink-500 mb-4">Debug: Messages Section</h1>
              
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-xl font-semibold text-pink-500 mb-4">Challenges</h2>
                {/* Add conditional rendering with debug info */}
                {typeof ChallengesSection === 'undefined' ? (
                  <p className="text-red-500">Error: ChallengesSection is undefined</p>
                ) : (
                  <ChallengesSection />
                )}
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

      // Add this code to your renderContent function in MobileDashboard.tsx
      // This should be added as a new case before the default case


case 'profile':
  return (
    <div className="space-y-4 px-4 py-4">
      {/* Profile Image and Welcome Message */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <DomeProfilePicture 
              profileImage={profileImage}
              isLoading={false}
              size="md"
              showUploadButton={true}
              // Add the required callbacks
              onImageUpload={onImageUpload}  // Add this
              onImageRemove={onImageRemove}  // Add this
/>
          </div>
          <p className="text-pink-500 text-lg">
            Not to be dramatic, but your being here literally made our whole day sparkle! ⭐
          </p>
        </div>
      </div>
            
            {/* Personal Information Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <button
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Edit
                </button>
              </div>
              
              {/* Information Fields - Text Aligned Right */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Username</h3>
                  <p className="mt-1 text-right">henners</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                    <p className="mt-1 text-right">Henry</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                    <p className="mt-1 text-right">Lee</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-right">2753 Caminito Eldorado</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">City</h3>
                    <p className="mt-1 text-right">LONDON</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">State</h3>
                    <p className="mt-1 text-right">London</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ZIP Code</h3>
                    <p className="mt-1 text-right">SW161A7</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Country</h3>
                    <p className="mt-1 text-right">United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* FAQ Section - Optional */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
              {/* You can add your FAQ component here if needed */}
            </div>
          </div>
        ); 
        case 'home':
          return (
                <div className="space-y-4 px-4">
                  {/* Welcome Card */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0 flex flex-col items-center">                        
                        <DomeProfilePicture 
                          profileImage={profileImage}
                          isLoading={false}
                          size="sm"
                          showUploadButton={false}
                          onImageUpload={onImageUpload}
                          onImageRemove={onImageRemove}
                        />
                     <p className="text-[#ff47b0] mt-2">{ambassador.username}</p>
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
                  <div className="space-y-2">
                    <div className="flex flex-col space-y-3 items-end"> {/* Added items-end */}
                      {/* TikTok */}
                      <div className="flex items-center gap-2 justify-end w-full"> {/* Added justify-end and w-full */}
                        <span className="font-medium text-[#ff47b0]">TikTok</span>
                        <a 
                          href="https://www.tiktok.com/@wonderverselab" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity text-[#ff47b0]"
                        >
                          <MessageCircle size={20} />
                        </a>
                      </div>
                      
                      {/* Instagram */}
                      <div className="flex items-center gap-2 justify-end w-full">
                        <span className="font-medium text-[#ff47b0]">Instagram</span>
                        <a 
                          href="https://www.instagram.com/wonderverselabs/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity text-[#ff47b0]"
                        >
                          <Instagram size={20} />
                        </a>
                      </div>
                      
                      {/* YouTube */}
                      <div className="flex items-center gap-2 justify-end w-full">
                        <span className="font-medium text-[#ff47b0]">YouTube</span>
                        <a 
                          href="https://www.youtube.com/@TheWonderverseLabs/shorts" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity text-[#ff47b0]"
                        >
                          <Youtube size={20} />
                        </a>
                      </div>
                      
                      {/* Lemon8 */}
                      <div className="flex items-center gap-2 justify-end w-full">
                        <span className="font-medium text-[#ff47b0]">Lemon8</span>
                        <a 
                          href="https://www.lemon8-app.com/@wonderverselab?region=us" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:opacity-80 transition-opacity text-[#ff47b0]"
                        >
                          <Github size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
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
            <PinkYachtClubBanner />
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