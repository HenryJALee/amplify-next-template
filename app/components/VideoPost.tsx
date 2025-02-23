'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface VideoPostProps {
  post: {
    id: string | null;
    mediaUrl: string | null;
    caption?: string | null;
    likes?: number | null;
  };
  onLike?: (postId: string) => void;
}

export default function VideoPost({ post, onLike }: VideoPostProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  //const [isVisible, setIsVisible] = useState(false);
  //const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

      {/* Caption */}
      {post.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm">{post.caption}</p>
        </div>
      )}
    </div>
  );
}
