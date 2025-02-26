'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { generateClient } from '@aws-amplify/api';
import { Schema } from '@/amplify/data/resource';
import { getUrl } from 'aws-amplify/storage';

interface VideoPostProps {
  post: {
    id: string | null;
    mediaUrl: string | null;
    caption?: string | null;
    likes?: number | null;
    creator: string | null; // The username from the post
  };
  onLike?: (postId: string) => void;
}

export default function VideoPost({ post, onLike }: VideoPostProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  //const [isVisible, setIsVisible] = useState(false);
  //const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    profileImageKey?: string | null,
    username?: string | null, 
    userProfileImageUrl?: string | null
  } | null>(null);

  const client = generateClient<Schema>();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        //setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          // Video is in view
          videoRef.current?.play().catch(error => {
            console.log('Autoplay prevented:', error);
          });
         // setIsPlaying(true);
        } else {
          // Video is out of view
          videoRef.current?.pause();
          //setIsPlaying(false);
        }
      },
      {
        threshold: 0.7 // 70% of the video must be visible
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLike = () => {
    if (post.id && onLike) {
      setIsLiked(!isLiked);
      onLike(post.id);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!post.creator) return;
      
      try {
        const userResponse = await client.models.User.list({
          filter: {
            username: {
              eq: post.creator
            }
          }
        });
        
        if (userResponse.data && userResponse.data[0]) {
          const user = userResponse.data[0];
          setUserProfile({
            profileImageKey: user.profileImageKey,
            username: user.username, 
            userProfileImageUrl: null
          });
  
          // Generate presigned URL if profileImageKey exists
          if (user.profileImageKey) {
            try {
              const { url } = await getUrl({
                key: user.profileImageKey,
                options: {
                  expiresIn: 3600 // URL expires in 1 hour
                }
              });
              // Update the profile with the URL
              setUserProfile(prev => prev ? {
                ...prev,
                userProfileImageUrl: url.toString()
              } : null);
            } catch (error) {
              console.error('Error generating presigned URL:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
  }, [post.creator]);

  const handleShare = async () => {
    if (post.mediaUrl) {
      try {
        await navigator.share({
          title: post.caption || 'Check out this video',
          url: post.mediaUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative max-w-md mx-auto rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        className="w-full aspect-[9/16] object-cover"
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
      >
        <source src={post.mediaUrl ?? undefined} type="video/mp4" />
      </video>

      {/* Overlay controls */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          {isLiked ? (
            <HeartSolid className="w-8 h-8 text-red-500" />
          ) : (
            <HeartOutline className="w-8 h-8 text-white" />
          )}
          {post.likes && (
            <span className="text-white text-sm">{post.likes}</span>
          )}
        </button>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <ShareIcon className="w-8 h-8 text-white" />
        </button>

        {/* Mute Button */}
        <button 
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="w-8 h-8 text-white" />
          ) : (
            <SpeakerWaveIcon className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* User info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center space-x-2">
          {userProfile?.profileImageKey ? (
            <img 
              src={userProfile?.userProfileImageUrl || undefined}  // You might need to construct the full URL depending on your setup
              alt={userProfile?.username || undefined} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600" /> // Placeholder if no image
          )}
          <span className="text-white font-medium">
            {userProfile?.username || 'Anonymous'}
          </span>
        </div>
        {/*post.caption && (
          <p className="text-white text-sm mt-2">{post.caption}</p>
        )*/}
      </div>
    </div>
  );
}
