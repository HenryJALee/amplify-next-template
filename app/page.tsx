'use client';

import { generateClient } from "aws-amplify/data";
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from "@/amplify/data/resource";
import React, { useRef, useState, useEffect } from 'react';
import { Star, Link2, Heart, Share2, User, LogOut } from 'lucide-react';
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
import WONDERLOGO_UPDATED from '../public/icons/Wonderverse-logo-update.png';
import MessageDashboard from './components/MessageDashboard';
import DomeProfilePicture from './components/DomeProfilePicture';
import { useProfileImage } from './hooks/useProfileImage';
import AmbassadorSpotlight from './components/AmbassadorSpotlight';
import WonderWheel from './components/WonderWheel';;
import FAQDropdown from './components/FAQDropdown';
import VideoPost from './components/VideoPost';
import MobileNav from './components/MobileNav';
import MobileDashboard from "./components/MobileDashboard";



Amplify.configure(outputs);

// Types for our data structures
type Activity = {
  type: string;
  platform?: string;
  date: string;
};

// Update User type
type User = {
  id: string;
  cognitoId: string | null;
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
  discountCode: string;
  recentActivity: Activity[];
};

type Nullable<T> = T | null;

type CommunityPostType = {
  id: Nullable<string>;
  creator: Nullable<string>;
  mediaType: "video" | null;
  mediaUrl: Nullable<string>;
  mediaKey: Nullable<string>;
  caption: Nullable<string>;
  likes: Nullable<number>;
  points: Nullable<number>;
  createdAt: Nullable<string>;
  updatedAt: string;
  creatorProfileImage?: string;
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


export default function Page() {
  // Add new states for user data
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [usernameError, setUsernameError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<Partial<AmbassadorUser>>({
    tiktokUsername: '',  // 
});

  const client = generateClient<Schema>();
  const router = useRouter();
  const [communityPosts, setCommunityPosts] = useState<CommunityPostType[]>([]);

    
  const [activeSection, setActiveSection] = useState<'home' | 'community' | 'messages' | 'profile' | 'game'>('home');  
  const [ambassador, setAmbassador] = useState<Ambassador>({
    name: "",
    username: "",
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
      // Get current user info
      const currentUser = await getCurrentUser();
      const username = userData?.username || currentUser.username;

      // Create and submit the post
      const newPost = {
        creator: username,
        caption: 'New video post',
        mediaUrl: url,
        mediaKey: key,
        mediaType: "video" as "video",
        likes: 0,
        points: 0
      };

      const response = await createCommunityPost(newPost);
      
      // Add the new post to the community posts state
      if (response.data) {
        const postWithSignedUrl = {
          id: response.data.id,
          ...newPost,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCommunityPosts(prevPosts => [postWithSignedUrl, ...prevPosts]);
      }
      
      setAmbassador({
        name: response.data[0].firstName || "Ambassador",
        username: response.data[0].username || "",
        discountCode: `WONDER${currentUser.username.toUpperCase()}`,
        recentActivity: [
          { type: "Post", platform: "TikTok", date: "2024-01-25" },
          { type: "Review", date: "2024-01-24" },
          { type: "Referral", date: "2024-01-23" }
        ]
      });

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
        console.log('Current user:', currentUser);

        const response = await client.models.User.list({
          filter: { cognitoId: { eq: currentUser.username } }
        });
        
        console.log('User data response:', response);
        if (response.data && response.data.length > 0) {
          setUserData(response.data[0]);
          setFormData(response.data[0]); // Initialize form data
          setAmbassador({
            name: response.data[0].firstName || "Ambassador",
            username: response.data[0].username || "",
            discountCode: `WONDER${currentUser.username.toUpperCase()}`,  // Changed from affiliateLink
            recentActivity: [
              { type: "Post", platform: "TikTok", date: "2024-01-25" },
              { type: "Review", date: "2024-01-24" },
              { type: "Referral", date: "2024-01-23" }
            ]
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Add refs for video elements
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
        console.log("🔄 fetchPosts() function is running..."); // ✅ Check if function runs

        if (activeSection === 'community') {
            setIsLoading(true);
            setError(null);
            try {
                console.log("📡 Fetching posts from listCommunityPosts()...");

                const response = await listCommunityPosts();

                console.log("✅ listCommunityPosts() response:", response);

                if (!response.data || response.data.length === 0) {
                    console.warn("⚠️ No posts found!");
                }

                const posts = await Promise.all(response.data.map(async (post) => {
                    console.log("🔹 Processing post:", post);

                    let profileImageUrl = "/default-avatar.png"; // Default image

                    if (post.creator) {
                        console.log(`🔍 Fetching profile image for creator: ${post.creator}`);

                        const userResponse = await client.models.User.list({
                            filter: { username: { eq: post.creator } }
                        });

                        console.log("👤 User response:", userResponse);

                        if (userResponse.data.length > 0) {
                            const user = userResponse.data[0];
                            if (user.profileImageKey) {
                                console.log("🔗 Found profileImageKey:", user.profileImageKey);

                                const signedProfileImage = await getUrl({
                                    key: user.profileImageKey,
                                    options: {
                                        accessLevel: 'guest',
                                        validateObjectExistence: true
                                    }
                                });

                                console.log("🖼 Signed profile image URL:", signedProfileImage.url.href);
                                profileImageUrl = signedProfileImage.url.href;
                                
                                // ✅ Extra Debugging Log
                                console.log(`🖼 Profile Image for ${post.creator}:`, profileImageUrl); // ✅ Log profile image
                                
                            } else {
                                console.warn("⚠️ No profile image found for user.");
                            }
                        } else {
                            console.warn(`⚠️ No user found for creator: ${post.creator}`);
                        }
                    }

                    if (post.mediaKey) {
                        const signedURL = await getUrl({
                            key: post.mediaKey,
                            options: {
                                accessLevel: 'guest',
                                validateObjectExistence: true
                            }
                        });

                        post.mediaUrl = signedURL.url.href;
                        console.log("🎥 Video URL:", post.mediaUrl);
                    }

                    return {
                        ...post,
                        creatorProfileImage: profileImageUrl, // ✅ Attach profile image
                    };
                }));

                console.log("✅ Final fetched posts before setting state:", posts);

                setCommunityPosts([...posts]); // ✅ Ensures state updates properly
            } catch (error) {
                console.error("❌ Error fetching posts:", error);
                setError("Failed to load posts");
            } finally {
                setIsLoading(false);
            }
          }
      };
      fetchPosts();
  }, [activeSection]);

  // Add this near your other useEffect hooks
  useEffect(() => {
    if (isMobile) {
      const loadMobileVideos = async () => {
        try {
          // Force reload community posts when switching to mobile
          if (activeSection === 'community' || activeSection === 'home') {
            const response = await listCommunityPosts();
            if (response.data) {
              const posts = await Promise.all(response.data.map(async (post) => {
                if (post.mediaKey) {
                  const signedURL = await getUrl({
                    key: post.mediaKey,
                    options: {
                      accessLevel: 'guest',
                      validateObjectExistence: true
                    }
                  });
                  post.mediaUrl = signedURL.url.href;
                }
                return post;
              }));
              setCommunityPosts(posts);
            }
          }
        } catch (error) {
          console.error('Error loading mobile videos:', error);
        }
      };

      loadMobileVideos();
    }
  }, [isMobile, activeSection]);
  
  // Add intersection observer to handle video playback
  useEffect(() => {
    if (!communityPosts.length) return;
  
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        const video = entry.target as HTMLVideoElement;
        
        if (entry.isIntersecting) {
          try {
            // Pause any currently playing video
            if (currentlyPlaying && currentlyPlaying !== video.id) {
              const previousVideo = videoRefs.current[currentlyPlaying];
              if (previousVideo) {
                previousVideo.pause();
                previousVideo.currentTime = 0;
              }
            }
            
            // Play the new video
            if (video.paused) {
              await video.play().catch(error => {
                // Handle play() promise rejection
                if (error.name !== 'AbortError') {
                  console.error('Video playback error:', error);
                }
              });
              setCurrentlyPlaying(video.id);
            }
          } catch (error) {
            console.error('Error handling video playback:', error);
          }
        } else {
          // If video is leaving viewport
          try {
            video.pause();
            video.currentTime = 0;
            if (currentlyPlaying === video.id) {
              setCurrentlyPlaying(null);
            }
          } catch (error) {
            console.error('Error pausing video:', error);
          }
        }
      });
    }, options);
  
    // Observe all videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });
  
    // Cleanup function
    return () => {
      // Pause all videos and disconnect observer
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          observer.unobserve(video);
        }
      });
      observer.disconnect();
      setCurrentlyPlaying(null);
    };
  }, [communityPosts, currentlyPlaying]); // Add currentlyPlaying to dependencies

  
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
      const currentUser = await getCurrentUser();
      const response = await client.models.User.list({
        filter: { username: { eq: username },
                  cognitoId: { ne: currentUser?.username },
      }});
      
      // If there are no users with this username, or the only user is the current user
      return !response.data?.length || 
              (response.data.length === 1 && response.data[0].id === userData?.cognitoId);
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

      const currentUserData = await client.models.User.list({
        filter: { cognitoId: { eq: currentUser.username } }
      });

      if (!currentUserData.data || currentUserData.data.length === 0) {
        // Create new user
        const newUser = await client.models.User.create({
          cognitoId: currentUser.userId,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          //profileImageKey: currentUserData.data[0].profileImageKey

        });
        setUserData(newUser.data);
      } else {
        
        const updatedUser = await client.models.User.update({
          id: currentUserData.data[0].id, // This is required
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          //profileImageKey: currentUserData.data[0].profileImageKey
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
                  
                  <div className="space-y-2">
                    <p className="text-[#ff47b0]"><span className="font-medium text-[#ff47b0]">TikTok:</span> @wonderverselab</p>
                    <p className="text-[#ff47b0]"><span className="font-medium text-[#ff47b0]">Instagram:</span> @wonderverselab, @thewondysociety_</p>
                    <p className="text-[#ff47b0]"><span className="font-medium text-[#ff47b0]">YouTube:</span> @thewonderverselabs</p>
                    <p className="text-[#ff47b0]"><span className="font-medium text-[#ff47b0]">Lemon8:</span> @thewonderverse</p>
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

                  {/* ✅ Only "Recent Activity" is inside this scrollable div */}
                  <div className="space-y-4 max-h-48 overflow-y-auto">
                    {ambassador.recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>  {/* ✅ Close "Recent Activity" div here */}


                {/* ✅ Video Posts - Now OUTSIDE the restricted div */}
                <div className="mt-6 bg-#fff6f9 p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
                  <h3 className="font-semibold mb-4">Recent Video Uploads</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {communityPosts.map((post) => (
                      <VideoPost 
                        key={post.id}
                        post={post}
                        videoRefs={videoRefs}
                        currentlyPlaying={currentlyPlaying}
                        setCurrentlyPlaying={setCurrentlyPlaying}
                        style={{ maxWidth: '100%', height: 'auto' }} // Ensures responsiveness
                      />
                    ))}
                  </div>
                </div>

                {/* Video Uploader */}
                {showVideoUploader && (
                  <VideoUploader
                    onUploadComplete={(key: string, url: string) => handleVideoUploadComplete(key, url)}
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
              {/* Profile Picture Section - Always visible */}
              <div className="bg-#fff6f9 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)] p-14 mb-4">
                <div className="flex items-center gap-2">
                  <div>
                    <DomeProfilePicture 
                      profileImage={profileImage}
                      isLoading={imageLoading}
                      size="md"
                      onImageUpload={handleImageUpload}
                      onImageRemove={handleRemoveProfilePicture}
                      showUploadButton
                    />
                  </div>
                  <p className="text-pink-500 text-xxl">
                    Not to be dramatic, but your being here literally made our whole day sparkle! ⭐
                  </p>
                </div>
              </div>
        
              {/* Personal Information Section */}
              <div className="bg-#fff6f9 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)] p-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
        
                {isEditing ? (
                  // Edit Mode - Form
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
        
                    {/* Address Fields */}
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
        
                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          handleSaveChanges();
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 
                                flex items-center gap-2"
                      >
                        Save Changes
                        <Link2 size={20} />
                      </button>
                    </div>
                  </form>
                ) : (
                  // View Mode - Display Only
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p className="mt-1">{userData?.username || 'Not set'}</p>
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                        <p className="mt-1">{userData?.firstName || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                        <p className="mt-1">{userData?.lastName || 'Not set'}</p>
                      </div>
                    </div>
        
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1">{userData?.streetAddress || 'Not set'}</p>
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">City</h3>
                        <p className="mt-1">{userData?.city || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">State</h3>
                        <p className="mt-1">{userData?.state || 'Not set'}</p>
                      </div>
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">ZIP Code</h3>
                        <p className="mt-1">{userData?.zipCode || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Country</h3>
                        <p className="mt-1">{userData?.country || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
        
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
          
                <div className="min-h-screen bg-[#FFF6F9] py-8">
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
                      {communityPosts.map((post) => (
                        <div key={post.id} className="mb-16 relative max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
                         <video
                            ref={el => {
                              if (el && post.id) {
                                videoRefs.current[post.id] = el;
                              }
                            }}
                            className="w-full h-auto max-w-md aspect-[9/16] object-contain"
                            loop
                            playsInline
                            muted  // ✅ Keep this so videos start muted
                            preload="auto"
                          >
                            <source src={post.mediaUrl ?? undefined} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                           {/* 🔊 Mute/Unmute Button */}
                          <button
                            onClick={() => {
                              const video = videoRefs.current[String(post.id)]; // ✅ Ensure post.id is a string
                              if (video) {
                                video.muted = !video.muted; // ✅ Toggle mute state
                              }
                            }}
                            className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded-full"
                          >
                            {videoRefs.current[String(post.id)]?.muted ? "🔇" : "🔊"}
                          </button>
                          
          
                         {/* Overlay for post information */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
                                style={{ minHeight: "60px", maxHeight: "auto", paddingBottom: "10px" }} // ✅ Ensures proper height
                            >

                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                              <img
                                src={post.creatorProfileImage || "/default-avatar.png"}  // ✅ Pull from fetched profile image
                                alt={post.creator ?? "User content"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-white font-medium">
                              {post.creator && post.creator !== "unknown" ? `@${post.creator}` : "Unknown User"} 
                            </span>
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
                      ))}
                    </div>
                  )}
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
   <>
    {isMobile ? (
      // Mobile Layout
      <div className="min-h-screen bg-wonder-pink">
        <MobileNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userData={userData}
          ambassador={ambassador}
          profileImageUrl={profileImage?.url ?? null}
          handleSignOut={handleSignOut}
          setShowVideoUploader={setShowVideoUploader}
        />
        
        <main className="pt-16"> {/* Add padding for the fixed header */}
        {activeSection === 'home' && (
          <div className="min-h-screen bg-pink-50">
            <div className="p-4">
              <MobileDashboard
                ambassador={ambassador}
                setShowVideoUploader={setShowVideoUploader}
                communityPosts={communityPosts}
                videoRefs={videoRefs}
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
                activeSection="home"
              />
            </div>
          </div>
        )}

        {activeSection === 'community' && (
          <div className="min-h-screen bg-pink-50">
            <AmbassadorSpotlight />
            <div className="container mx-auto px-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-[70vh]">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
                </div>
              ) : communityPosts.map((post) => (
                <div key={post.id} className="mb-8">
                  <VideoPost
                    post={post}
                    videoRefs={videoRefs}
                    currentlyPlaying={currentlyPlaying}
                    setCurrentlyPlaying={setCurrentlyPlaying}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

          
          {activeSection === 'messages' && (
            <div className="min-h-screen bg-pink-50">
              <MessageDashboard />
            </div>
          )}
          
          {activeSection === 'profile' && (
            <div className="min-h-screen bg-pink-50 p-4">
              <DomeProfilePicture
                profileImage={profileImage}
                isLoading={imageLoading}
                size="md"
                onImageUpload={handleImageUpload}
                onImageRemove={handleRemoveProfilePicture}
                showUploadButton
              />
              <p className="text-pink-500 text-xxl">
                Not to be dramatic, but your being here literally made our whole day sparkle! ⭐
              </p>
              {/* Personal Information Section */}
              <div className="bg-#fff6f9 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)] p-6 relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
        
                {isEditing ? (
                  // Edit Mode - Form
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
        
                    {/* Address Fields */}
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
        
                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          handleSaveChanges();
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 
                                flex items-center gap-2"
                      >
                        Save Changes
                        <Link2 size={20} />
                      </button>
                    </div>
                  </form>
                ) : (
                  // View Mode - Display Only
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p className="mt-1">{userData?.username || 'Not set'}</p>
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                        <p className="mt-1">{userData?.firstName || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                        <p className="mt-1">{userData?.lastName || 'Not set'}</p>
                      </div>
                    </div>
        
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1">{userData?.streetAddress || 'Not set'}</p>
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">City</h3>
                        <p className="mt-1">{userData?.city || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">State</h3>
                        <p className="mt-1">{userData?.state || 'Not set'}</p>
                      </div>
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">ZIP Code</h3>
                        <p className="mt-1">{userData?.zipCode || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Country</h3>
                        <p className="mt-1">{userData?.country || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
        
              {/* FAQ Dropdown Section */}
              <div className="mt-8">
                <FAQDropdown />
              </div>
            </div>
          )}
          
          {activeSection === 'game' && (
            <div className="min-h-screen bg-pink-50 p-4">
              <WonderWheel />
            </div>
          )}
        </main>
      </div>
    ) : (
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
    )}
    {/* Video Uploader Modal - Available in both layouts */}
    {showVideoUploader && (
      <VideoUploader
        onUploadComplete={handleVideoUploadComplete}
        onClose={() => setShowVideoUploader(false)}
      />
    )}
  </>

  );
}