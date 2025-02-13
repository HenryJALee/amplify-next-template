      'use client';

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import React, { useState, useEffect } from 'react';
import { Star, Link2, Heart, Share2, User, Play, LogOut } from 'lucide-react';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { VideoUploader } from './components/VideoUploader';
import { createCommunityPost } from './utils/community';
import Image from 'next/image'
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import PinkStar from '../public/icons/Pink-Star.png';
import BlueStar from '../public/icons/Blue-Star.png';
import GreenStar from '../public/icons/Green-Star.png';
import YellowStar from '../public/icons/Yellow-Star.png';
import PinkPalm from '../public/icons/Pink-Palm.png';
import WONDERLOGO from '../public/icons/Wonderverse-logo-new.png';
import WONDERLOGO_UPDATED from '../public/icons/Wonderverse-logo-update.png';
import MessageDashboard from './components/MessageDashboard';
import DomeProfilePicture from './components/DomeProfilePicture';
import { useProfileImage } from './hooks/useProfileImage';
import { ProfileImageType } from './hooks/useProfileImage';
import AmbassadorSpotlight from './components/AmbassadorSpotlight';
import WonderWheel from './components/WonderWheel';;
import customheart from '../public/icons/custonheart.png';  // Note: fixing typo in filename if needed
import customstar from '../public/icons/customstar.png';
import type { ImageProps } from 'next/image';
import { Menu, X } from 'lucide-react';
import cursorIcon from '../public/icons/customstar.png'; 
import FAQDropdown from './components/FAQDropdown';




Amplify.configure(outputs);

// Types for our data structures
type Activity = {
  type: string;
  platform?: string;
  points: number;
  date: string;
};

// Update User type
type User = {
  id: string;
  username?: string | null;  // Make username optional
  firstName?: string | null;
  lastName?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  profileImageKey?: string | null;
};

type Ambassador = {
  name: string;
  username: string;
  points: number;
  tier: string;
  discountCode: string;
  recentActivity: Activity[];
};

type Post = {
  creator: string;
  platform: 'tiktok' | 'instagram';
  mediaType: 'video' | 'image';
  mediaUrl: string;
  likes: number;
  points: number;
  content: string;
  thumbnail?: string;
};
type AmbassadorUser = {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  profileImageKey?: string | null;
  tiktokUsername?: string | null;
};

// Add this type for profile image
type ProfileImage = {
  url: string;
  key: string;
};

// Demo data
const DemoFeed: Post[] = [
  {
    creator: "Sarah W.",
    platform: "tiktok",
    mediaType: "video",
    mediaUrl: "https://example.com/video1.mp4", // Replace with actual video URL
    thumbnail: "/api/placeholder/1080/1920",
    likes: 1200,
    points: 50,
    content: "Trying out the new Pink Yacht Club scent! 🌸✨ #WonderVerse #PinkYachtClub"
  },
  {
    creator: "Maya K.",
    platform: "instagram",
    mediaType: "video",
    mediaUrl: "https://example.com/video2.mp4", // Replace with actual video URL
    thumbnail: "/api/placeholder/1080/1920",
    likes: 890,
    points: 30,
    content: "Love my Wonderverse collection! GRWM with my favorite scents 💕 #WonderMaker"
  }
];

export default function Page() {
  // Add new states for user data
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [userData, setUserData] = useState<User | null>(null);
  const [usernameError, setUsernameError] = useState<string>('');
  const [formData, setFormData] = useState<Partial<AmbassadorUser>>({
    tiktokUsername: '',  // 
});
  const client = generateClient<Schema>();
  const router = useRouter();
    
  const [activeSection, setActiveSection] = useState<'home' | 'community' | 'messages' | 'profile' | 'game'>('home');  
  const [ambassador, setAmbassador] = useState<Ambassador>({
    name: "",
    username: "",
    points: 0,
    tier: "",
    discountCode: "",
    recentActivity: []
  });

  // Add the profile image hook
  const { 
    profileImage, 
    isLoading: imageLoading, 
    handleImageUpload, 
    handleRemoveProfilePicture 
  } = useProfileImage({ 
    userData,
    onUpdateUser: async (data) => {
      const updatedUser = await client.models.User.update(data);
      setUserData(updatedUser.data);
    }
  });

  // Add this function to handle the upload completion
  const handleVideoUploadComplete = async () => {
    try {
      await createCommunityPost(client, {
        creator:  'unknown',
        caption: 'Hello WOrld',
        mediaUrl: 's3link' // get from uploader
      });

      // Add points for uploading content
      const points = 50; // Adjust point value as needed
      setAmbassador(prev => ({
        ...prev,
        points: prev.points + points,
        recentActivity: [
          {
            type: 'Post',
            platform: 'TikTok',
            points: points,
            date: new Date().toISOString().split('T')[0]
          },
          ...prev.recentActivity
        ]
      }));

      setShowVideoUploader(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };


  // Add the handleSignOut function
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // or wherever you want to redirect after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        const response = await client.models.User.list({
          filter: { username: { eq: currentUser.username } }
        });
        
        if (response.data && response.data.length > 0) {
          setUserData(response.data[0]);
          setFormData(response.data[0]); // Initialize form data
          setAmbassador({
            name: currentUser.username || "Ambassador",
            username: currentUser.username || "",
            points: 750,
            tier: "Wonder Advocate",
            discountCode: `WONDER${currentUser.username.toUpperCase()}`,  // Changed from affiliateLink
            recentActivity: [
              { type: "Post", platform: "TikTok", points: 50, date: "2024-01-25" },
              { type: "Review", points: 25, date: "2024-01-24" },
              { type: "Referral", points: 100, date: "2024-01-23" }
            ]
          });
        }
            } catch (error) {
              console.error('Error loading user data:', error);
            }
          };

          loadUserData();
        }, []); 

        // Handle input changes
        const handleInputChange = (field: keyof AmbassadorUser, value: string) => {
          setFormData(prev => ({
              ...prev,
              [field]: value
          }));
          
          // Keep the username error reset for username input
          if (field === 'username') {
              setUsernameError('');
          }
      };

        // Check if username is unique
        const isUsernameUnique = async (username: string): Promise<boolean> => {
          try {
            const response = await client.models.User.list({
              filter: { username: { eq: username } }
            });
            
            // If there are no users with this username, or the only user is the current user
            return !response.data?.length || 
                    (response.data.length === 1 && response.data[0].id === userData?.id);
          } catch (error) {
            console.error('Error checking username:', error);
            return false;
          }
        };

        // Save changes with username validation
        const handleSaveChanges = async () => {
          try {
            // Check if username is provided
            if (!formData.username) {
              setUsernameError('Username is required');
              return;
            }

        // Check username uniqueness
        const isUnique = await isUsernameUnique(formData.username);
        if (!isUnique) {
          setUsernameError('This username is already taken');
          return;
        }

      const currentUser = await getCurrentUser();
      
      if (!userData?.id) {
        // Create new user
        const newUser = await client.models.User.create({
          cognitoId: currentUser.userId, // Store Cognito ID for reference
          ...formData
        });
        setUserData(newUser.data);
      } else {
        // Update existing user
        const updatedUser = await client.models.User.update({
          id: userData.id,
          ...formData
        });
        setUserData(updatedUser.data);
      }
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };
  
          const renderContent = () => {
            switch (activeSection) {
              case 'home':
          return (
            <div className="p-6 space-y-6">
              {/* Welcome Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-#fff6f9 p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]" style={{ backgroundColor: '#FFF6F9' }}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-2xl text-[#ff47b0]">Welcome to our World</h3>
                    <img 
                      src="/icons/wonder-circles.png" 
                      alt="Wonderverse Icon" 
                      className="h-8 w-8"
                    />
                  </div>
                  <p className="text-[#ff47b0]">Whimsical Fragrance meets Clinically Effective and Sensory Friendly Bodycare...And this is where you come in!</p>
                  <div className="space-y-2 text-'#ff47b0'">
                    <p><span className="font-medium">TikTok:</span> @wonderverselab</p>
                    <p><span className="font-medium">Instagram:</span> @wonderverselab, @thewondysociety_</p>
                    <p><span className="font-medium">YouTube:</span> @thewonderverselabs</p>
                    <p><span className="font-medium">Lemon8:</span> @thewonderverse</p>
                  </div>
                </div>

              <div className="bg-#fff6f9 p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
                <h3 className="font-semibold mb-2">Discount Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ambassador.discountCode}
                    readOnly
                    className="flex-1 p-2 border rounded"
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
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all text-sm flex items-center gap-2 shadow-md"
                  >
                      ✨ Wonderverse
                  </a>
                </div>      
              </div>
            </div>
            {/* TikTok Submission Section */}
            <div className="bg-#fff6f9 p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
                <h3 className="font-semibold text-lg mb-2 text-[#ff47b0]">Submit Your TikTok Content</h3>
                
            {/* TikTok Username Input */}
            <div className="flex gap-2 mb-4">
            <input
            type="text"
            placeholder="Enter your TikTok username"
            value={formData?.tiktokUsername || ''}
            onChange={(e) => handleInputChange('tiktokUsername', e.target.value)}
            className="flex-1 p-2 border rounded"
        />
        <button 
            onClick={() => alert('TikTok Username Saved!')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all text-sm shadow-md"
        >
            Save
        </button>
    </div>

    {/* Video Upload Button */}
    <div className="flex justify-end">
        <button 
            onClick={() => setShowVideoUploader(true)}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all text-sm shadow-md flex items-center gap-2"
        >
            📹 Upload TikTok Post
        </button>
    </div>
</div>

            {/* Recent Activity */}
            <div className="bg-#fff6f9 p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
                <button 
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-1"
                  onClick={() => setShowVideoUploader(true)}
                >
                  Add Content <span className="text-lg">+</span>
                </button>
              </div>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {ambassador.recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <span className="text-pink-500 font-semibold">+{activity.points} points</span>
                  </div>
                ))}
              </div>
            </div>
          {showVideoUploader && (
            <VideoUploader
              onUploadComplete={handleVideoUploadComplete}
              onClose={() => setShowVideoUploader(false)}
            />
          )}
          </div>
        );
        case 'messages':  // Add this new case
        return (
          <div className="h-screen bg-[#fff6f9]">
            <MessageDashboard />
          </div>
        );
      
        case 'profile':
          return (
            <div className="p-6 max-w-4xl mx-auto">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                   {/* Profile Picture Section */}
                <div className="bg-#fff6f9 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)] p-14 mb-4">
                  <div className="flex items-center gap-2"> {/* Added flex container */}
                    <div> {/* Profile picture container */}
                      <DomeProfilePicture 
                        profileImage={profileImage}
                        isLoading={imageLoading}
                        size="md"
                        onImageUpload={handleImageUpload}
                        onImageRemove={handleRemoveProfilePicture}
                        showUploadButton
                      /> 
                    </div>
                    <p className="text-pink-500 text-xxl"> {/* Increased text size */}
                      Not to be dramatic, but your being here literally made our whole day sparkle! ⭐
                    </p>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-#fff6f9 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)] p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="space-y-6">
                    {/* Username field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2 border rounded ${
                          usernameError ? 'border-red-500' : ''
                        }`}
                        value={formData?.username || ''}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Choose a unique username"
                      />
                      {usernameError && (
                        <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                      )}
                    </div>  
                  </div>
                </div>

                {/* First and Last Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData?.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData?.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* And update the Address Section inputs*/}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData?.streetAddress || ''}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData?.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData?.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData?.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData?.country || ''}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>      
        
                {/* Save Changes Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 
                            flex items-center gap-2"
                  >
                    Save Changes
                    <Link2 size={20} />
                  </button>
                </div>
              </form>
              {/* FAQ Dropdown Section */}
            <div className="mt-8">
              <FAQDropdown />
            </div>
            </div>
          );

          case 'community':
          return (
            <div className="h-screen flex flex-col bg-pink-50">
              <AmbassadorSpotlight />


              {/* Vertical Scrolling Feed */}
              <div className="flex-1 overflow-y-auto snap-y snap-mandatory">
                {DemoFeed.map((post, index) => (
                  <div 
                    key={index} 
                    className="h-[calc(100vh-80px)] snap-start flex flex-col bg-pink-100 relative"
                  >
                    {/* Post Media Content */}
                    <div className="relative flex-1 bg-pink-200">
                      {post.mediaType === 'video' ? (
                        <div className="w-full h-full relative">
                          <video
                            className="w-full h-full object-cover"
                            loop
                            playsInline
                            controls={false}
                            muted // Remove this if you want sound enabled by default
                            poster={post.thumbnail}
                          >
                            <source src={post.mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          {/* Play/Pause Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button className="p-4 rounded-full bg-black/30 text-white">
                              <Play size={24} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={post.mediaUrl}
                          alt="Post content"
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-900/60" />

                      {/* Post Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src="/api/placeholder/40/40"
                            alt={post.creator}
                            className="w-10 h-10 rounded-full border-2 border-white"
                          />
                          <span className="font-semibold">@{post.creator}</span>
                        </div>
                        <p className="mb-2 text-shadow-sm">{post.content}</p>
                      </div>

                      {/* Interaction Buttons */}
                  <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
                    <button className="flex flex-col items-center group transition-all">
                      <div className="w-12 h-12 bg-pink-500/80 hover:bg-pink-500 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Image 
                          src={customheart}
                          alt="Like"
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      </div>
                      <span className="text-white text-sm mt-1 group-hover:scale-110 transition-transform">
                        {post.likes}
                      </span>
                    </button>

                    <button className="flex flex-col items-center group transition-all">
                      <div className="w-12 h-12 bg-pink-500/80 hover:bg-pink-500 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Image 
                          src={customstar}
                          alt="Points"
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      </div>
                      <span className="text-white text-sm mt-1 group-hover:scale-110 transition-transform">
                        +{post.points}
                      </span>
                    </button>

                    <div className="w-12 h-12 bg-pink-500/80 hover:bg-pink-500 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Share2 
                        className="text-white"
                        size={24}
                      />
                    </div>
                  </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Hint */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-pink-500/80 px-4 py-2 rounded-full backdrop-blur-sm">
                Scroll for more
              </div>

              </div>
          );
        
          case 'game':
        return (
          <div className="w-full flex flex-col items-center bg-[#FFF6F9] p-4">
      {/* Wonder Wheel */}
        <WonderWheel />

      {/* Scent Quiz Below */}
    </div>
  );       
        default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-wonder-pink">
      {/* Sidebar */}
      <div className="w-72 bg-[#fff6f9]">  
        <div className="flex flex-col">
          {/* Logo Container */}
          <div className="flex justify-center py-18 px-10"> 
            <Image 
              src={WONDERLOGO_UPDATED}
              alt="Wonder Logo Updated"
              width={200}  // Reduced from 200
              height={54}
              priority
            />
          </div>
  
          {/* Profile Section */}
          <div className="text-center mb-6 pl-4"> 
            <DomeProfilePicture 
                    profileImage={profileImage}
                    isLoading={imageLoading}
                    size="lg"
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleRemoveProfilePicture}
            />
            <h2 className="font-bold text-lg">{userData?.username || ambassador.name}</h2>
            <p className="text-sm text-gray-500">{ambassador.tier}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 pl-4">
              {[
                 { icon: <Image src={PinkStar} alt="Dashboard" width={20} height={20} />, label: 'Dashboard', key: 'home' },
                 { icon: <Image src={BlueStar} alt="Community" width={20} height={20} />, label: 'Community', key: 'community' },
                 { icon: <Image src={GreenStar} alt="Community Updates" width={20} height={20} />, label: 'Community Updates', key: 'messages' },
                 { icon: <Image src={YellowStar} alt="Profile" width={20} height={20} />, label: 'Profile', key: 'profile' },
                 { icon: <Image src={PinkStar} alt="Game" width={20} height={20} />, label: 'Game', key: 'game' }
               ]
             .map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key as typeof activeSection)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition
                    ${activeSection === item.key 
                      ? 'bg-pink-500 text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              {/* Add Content Button */}
              <button
                onClick={() => setShowVideoUploader(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition
                bg-[#fff6f9] hover:bg-pink-500 text-pink-500 hover:text-white"
              >
                <span className="text-xl">+</span>
                <span>Add Content</span>
              </button>
              
            {/* Add Sign Out button at the bottom */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition
                text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  

  );
}