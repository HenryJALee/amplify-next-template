'use client';

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import React, { useRef, useState, useEffect } from 'react';
import { Star, Link2, Heart, Share2, User, Play, LogOut } from 'lucide-react';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { VideoUploader } from './components/VideoUploader';
import { createCommunityPost, listCommunityPosts } from './utils/community';
import Image from 'next/image'
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import PinkStar from '../public/icons/Pink-Star.png';
import BlueStar from '../public/icons/Blue-Star.png';
import GreenStar from '../public/icons/Green-Star.png';
import YellowStar from '../public/icons/Yellow-Star.png';
import PinkPalm from '../public/icons/Pink-Palm.png';
// Add these imports at the top of page.tsx

import { useProfileImage } from './hooks/useProfileImage';
import { ProfileImage  } from './components/ProfileImage';


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
  const [userData, setUserData] = useState<User | null>(null);
  const [usernameError, setUsernameError] = useState<string>('');
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const client = generateClient<Schema>();
  const router = useRouter();
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);

    
  const [activeSection, setActiveSection] = useState<'home' | 'community' | 'messages' | 'profile'>('home');  
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

  const handleVideoUploadComplete = async (key: string, url: string) => {
    try {

      await createCommunityPost({
        creator: 'unknown', 
        caption: 'Hello World',
        mediaUrl: url, // Use the actual S3 URL from upload
        mediaKey: key // Add the S3 key if needed in your schema
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
  });

  // Add refs for video elements
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      if (activeSection === 'community') {
        setIsLoading(true);
        setError(null);
        try {
          const posts = await listCommunityPosts();
          console.log('Posts in component:', posts); // Add this log
          setCommunityPosts(posts);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setError('Failed to load posts');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
  }, [activeSection]);
  
  // Add intersection observer to handle video playback
  useEffect(() => {
    if (!communityPosts.length) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, options);

    // Observe all videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [communityPosts]);

  // Handle input changes
  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear username error when user types
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
                onUploadComplete={(key: string, url: string) => handleVideoUploadComplete(key, url)}
                onClose={() => setShowVideoUploader(false)}
              />
            )}
          </div>
        );

        case 'profile':
          return (
            <div className="p-6 max-w-4xl mx-auto">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                  <ProfileImage 
                    profileImage={profileImage}
                    isLoading={imageLoading}
                    size="lg"
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleRemoveProfilePicture}
                    showUploadButton
                  />
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

                {/* Fist and Last Names */}
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
            </div>
          );

        case 'community':
          return (
            <div className="min-h-screen bg-gray-100 py-8">
              {isLoading && (
                <div className="flex items-center justify-center h-[70vh]">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
                </div>
              )}
        
              {error && (
                <div className="flex items-center justify-center h-[70vh]">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
        
              {!isLoading && !error && communityPosts.length === 0 && (
                <div className="flex items-center justify-center h-[70vh]">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
        
              {!isLoading && !error && communityPosts.length > 0 && (
                <div className="container mx-auto px-4">
                  {communityPosts.map((post, index) => (
                    <div key={post.id} className="mb-16">
                      <div className="phone-frame">
                        <div className="phone-screen">
                          <video
                            ref={el => {
                              if (el) videoRefs.current[post.id] = el;
                            }}
                            className="w-full h-full object-cover"
                            loop
                            playsInline
                            muted
                            preload="auto"
                          >
                            <source src={post.mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
        
                          {/* Overlay for post information */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                                <img
                                  src="/default-avatar.png"
                                  alt={post.creator}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-white font-medium">@{post.creator}</span>
                            </div>
                            <p className="text-white text-sm">{post.caption}</p>
                          </div>
        
                          {/* Interaction buttons */}
                          <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                            <button className="bg-pink-500/80 p-3 rounded-full text-white hover:bg-pink-600 transition-colors">
                              <Heart size={20} />
                              <span className="text-xs block mt-1">{post.likes || 0}</span>
                            </button>
                            
                            <button className="bg-pink-500/80 p-3 rounded-full text-white hover:bg-pink-600 transition-colors">
                              <Star size={20} />
                              <span className="text-xs block mt-1">{post.points || 0}</span>
                            </button>
        
                            <button className="bg-pink-500/80 p-3 rounded-full text-white hover:bg-pink-600 transition-colors">
                              <Share2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          <ProfileImage 
            profileImage={profileImage}
            isLoading={imageLoading}
            size="md"
          />

            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-sm text-gray-600">
                {formData.username ? `@${formData.username}` : 'No username set'}
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