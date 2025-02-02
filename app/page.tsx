'use client';

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import React, { useState, useEffect } from 'react';
import { uploadData, getUrl, list } from 'aws-amplify/storage';
import { Star, Link2, Heart, Share2, User, Play, LogOut } from 'lucide-react';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import PinkStar from '../public/icons/Pink-Star.png';
import BlueStar from '../public/icons/Blue-Star.png';
import GreenStar from '../public/icons/Green-Star.png';
import YellowStar from '../public/icons/Yellow-Star.png';
import PinkPalm from '../public/icons/Pink-Palm.png';


Amplify.configure(outputs);

// Types for our data structures
type Activity = {
  type: string;
  platform?: string;
  points: number;
  date: string;
};

// Simplified User type
type User = {
  id: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
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
  // Add new state for user data
  const [userData, setUserData] = useState<User | null>(null);
  const client = generateClient<Schema>();
  const router = useRouter();
    
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'community' | 'messages' | 'profile'>('home');  
  const [ambassador, setAmbassador] = useState<Ambassador>({
    name: "",
    username: "",
    points: 0,
    tier: "",
    discountCode: "",
    recentActivity: []
  });

  // Add the handleSignOut function
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // or wherever you want to redirect after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Add this function to handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    try {
      setImageLoading(true);
      const file = event.target.files[0];
      const currentUser = await getCurrentUser();
      const fileExtension = file.name.split('.').pop();
      const filePath = `profile-pictures/${currentUser.username}.${fileExtension}`;

      // Updated uploadData usage with path
      await uploadData({
        path: filePath, // Using path instead of key
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            console.log(`Uploaded: ${transferredBytes}/${totalBytes}`);
          },
        }
      });

      const { url } = await getUrl({
        path: filePath,
      });
      
      setProfileImage({ 
        url: url.toString(),
        key: filePath 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setImageLoading(false);
    }
  };

  // Add this effect to load the profile picture on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const currentUser = await getCurrentUser();
        const prefix = `profile-pictures/${currentUser.username}`;
        
        const results = await list({
          prefix
        });
        
        if (results.items.length > 0) {
          const { url } = await getUrl({
            path: results.items[0].key,
          });
          
          setProfileImage({ 
            url: url.toString(),
            key: results.items[0].key 
          });
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };

    loadProfileImage();
  }, []);

  // Add this effect to load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        const response = await client.models.User.list({
          filter: { username: { eq: currentUser.username } }
        });
        
        if (response.data && response.data.length > 0) {
          setUserData(response.data[0]);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);   

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Add function to update user data
  const updateField = async (field: keyof User, value: string) => {
    try {
      const currentUser = await getCurrentUser();
      const updateData = { [field]: value || null };
      
      if (!userData?.id) {
        // Create new user if doesn't exist
        const newUser = await client.models.User.create({
          username: currentUser.username,
          ...updateData
        });
        setUserData(newUser.data);
      } else {
        // Update existing user
        const updatedUser = await client.models.User.update({
          id: userData.id,
          ...updateData
        });
        setUserData(updatedUser.data);
      }
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };


  // Handle username update
  const handleUsernameChange = (newUsername: string) => {
    setAmbassador(prev => ({
      ...prev,
      username: newUsername
    }));
    // Here you would typically also update this in your backend
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Message */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow" style={{ backgroundColor: '#FFF6F9' }}>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-2xl text-pink-500">Welcome to our World</h3>
            <img 
              src="/icons/wonder-circles.png" 
              alt="Wonderverse Icon" 
              className="h-8 w-8"
            />
          </div>
          <p className="text-lg mb-4">Whimsical Fragrance meets Clinically Effective and Sensory Friendly Bodycare...And this is where you come in!</p>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">TikTok:</span> @wonderverselab</p>
            <p><span className="font-medium">Instagram:</span> @wonderverselab, @thewondysociety_</p>
            <p><span className="font-medium">YouTube:</span> @thewonderverselabs</p>
            <p><span className="font-medium">Lemon8:</span> @thewonderverse</p>
          </div>
        </div>

              <div className="bg-white p-6 rounded-lg shadow">
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
              </div>
            </div>
 
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Recent Activity</h3>
                <button 
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-1"
                  onClick={() => {
                    console.log('Add content clicked')
                  }}
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
          </div>
        );

        case 'profile':
          return (
            <div className="p-6 max-w-4xl mx-auto">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {imageLoading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                        ) : profileImage ? (
                          <Image
                            src={profileImage.url}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <User size={48} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block">
                        <span className="sr-only">Choose profile photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-pink-50 file:text-pink-700
                            hover:file:bg-pink-100"
                        />
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        JPG, PNG or GIF up to 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="space-y-6">
                    {/* Username field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={ambassador.username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="Enter your username"
                      />
                    </div>   
                  </div>
                </div>

                {/* Name fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={userData?.firstName || ''}
                      onChange={(e) => updateField('firstName', e.target.value)}
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
                      value={userData?.lastName || ''}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Social Media Handles Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Social Media Handles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TikTok Handle
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="@yourtiktok"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="@yourinstagram"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lemon8 Handle
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="@yourlemon8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube Handle
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="@youryoutube"
                      />
                    </div>
                  </div>
                </div>
 
                {/* Address Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Address Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={userData?.streetAddress || ''}
                        onChange={(e) => updateField('streetAddress', e.target.value)}
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
                          value={userData?.city || ''}
                          onChange={(e) => updateField('city', e.target.value)}
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
                          value={userData?.state || ''}
                          onChange={(e) => updateField('state', e.target.value)}
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
                          value={userData?.zipCode || ''}
                          onChange={(e) => updateField('zipCode', e.target.value)}
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
                          value={userData?.country || ''}
                          onChange={(e) => updateField('country', e.target.value)}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </div>
                </div>        
        
                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 
                             flex items-center gap-2"
                  >
                    Save Changes
                    <Link2 size={20} />
                  </button>
                </div>
              </form>
            </div>
          );

        case 'community':
          return (
            <div className="h-screen flex flex-col bg-pink-50">
              {/* Ambassador Spotlight (Collapsed Version) */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src="/api/placeholder/300/300"
                    alt="vlogs.w.s.c"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">@vlogs.w.s.c</h3>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs text-white">Featured Creator</span>
                    </div>
                  </div>
                </div>
              </div>

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
                            <Heart size={24} className="text-white" />
                          </div>
                          <span className="text-white text-sm mt-1 group-hover:scale-110 transition-transform">
                            {post.likes}
                          </span>
                        </button>

                        <button className="flex flex-col items-center group transition-all">
                          <div className="w-12 h-12 bg-pink-500/80 hover:bg-pink-500 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Star size={24} className="text-white" />
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
        

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#fff6f9' }}>
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
              <User size={64} className="text-pink-500" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-sm text-gray-600">
                {ambassador.username ? `@${ambassador.username}` : 'No username set'}
              </p>
              <Image 
                src={PinkPalm} 
                alt="Palm Tree" 
                width={16} 
                height={16}
              />
            </div>
              <h2 className="font-bold text-lg">{ambassador.name}</h2>
              <p className="text-sm text-gray-500">{ambassador.tier}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
              {[
                { icon: <Image src={PinkStar} alt="Dashboard" width={20} height={20} />, label: 'Dashboard', key: 'home' },
                { icon: <Image src={BlueStar} alt="Community" width={20} height={20} />, label: 'Community', key: 'community' },
                { icon: <Image src={GreenStar} alt="Messages" width={20} height={20} />, label: 'Messages', key: 'messages' },
                { icon: <Image src={YellowStar} alt="Profile" width={20} height={20} />, label: 'Profile', key: 'profile' }
              ].map((item) => (
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