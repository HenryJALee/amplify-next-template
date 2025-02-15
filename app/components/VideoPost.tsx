import React, { useRef, useState, useEffect } from 'react';
import { Heart, Star, Share2 } from 'lucide-react';

type PostType = {
  id: string | null;
  creator: string | null;
  mediaUrl: string | null;
  caption: string | null;
  likes: number | null;
  points: number | null;
};

type VideoPostProps = {
  post: PostType;
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement }>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
  style?: React.CSSProperties;
};

const VideoPost: React.FC<VideoPostProps> = ({ 
  post, 
  videoRefs, 
  currentlyPlaying, 
  setCurrentlyPlaying, 
  style = {} 
}) => {
  useEffect(() => {
    if (!post.id) return;
    
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
            if (currentlyPlaying && currentlyPlaying !== video.id) {
              const previousVideo = videoRefs.current[currentlyPlaying];
              if (previousVideo) {
                previousVideo.pause();
                previousVideo.currentTime = 0;
              }
            }
            
            if (video.paused) {
              await video.play();
              setCurrentlyPlaying(video.id);
            }
          } catch (error) {
            console.error('Error handling video playback:', error);
          }
        } else {
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

    const videoElement = videoRefs.current[post.id];
    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
        videoElement.pause();
      }
      observer.disconnect();
    };
  }, [post.id, currentlyPlaying, setCurrentlyPlaying]);

  return (
    <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg" style={style}>
      <video
  ref={el => {
    if (el && post.id) {
      videoRefs.current[post.id] = el;
    }
  }}
  className="w-full h-auto max-w-md aspect-[9/16] object-contain"
  loop
  playsInline
  muted
  preload="metadata" // ✅ Only loads metadata, not the full video
>
  <source src={post.mediaUrl ?? undefined} type="video/mp4" />
  Your browser does not support the video tag.
</video>


      {/* Overlay for post information */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src="/default-avatar.png"
              alt={post.creator ?? "User content"}
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
  );
};

export default VideoPost;