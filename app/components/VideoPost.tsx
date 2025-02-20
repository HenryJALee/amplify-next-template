import React, { useEffect, useState } from 'react';
import { Star, Share2 } from 'lucide-react';
import Hls from 'hls.js';
const customHeart = require('/public/icons/customheart.png');


type PostType = {
  id: string | null;
  creator: string | null;
  mediaUrl: string | null;
  caption: string | null;
  likes: number | null;
  points: number | null;
  creatorProfileImage?: string; // Added this for profile image support
};

type VideoPostProps = {
  post: PostType;
  videoRefs: React.MutableRefObject<{ [key: string]: HTMLVideoElement }>;
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
  style?: React.CSSProperties;
  isMobile?: boolean;
};

const VideoPost: React.FC<VideoPostProps> = ({ 
  post, 
  videoRefs, 
  currentlyPlaying, 
  setCurrentlyPlaying, 
  style = {},
  isMobile = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
// Like Counter State
const [likes, setLikes] = useState(post.likes || 0);
const [isLiked, setIsLiked] = useState(false);

// Like Button Click Handler
const handleLikeClick = (postId: string | null) => {
  if (!postId) return;

  if (isLiked) {
    // Unlike the post
    setLikes(prev => prev - 1);
    setIsLiked(false);
    // TODO: Update backend to decrease like count
  } else {
    // Like the post
    setLikes(prev => prev + 1);
    setIsLiked(true);
    // TODO: Update backend to increase like count
  }
};

  useEffect(() => {
    if (!post.id) return;
    
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.5,
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
            
            // Only play if video is loaded
            if (video.readyState >= 3) {
              await video.play();
              setCurrentlyPlaying(video.id);
            }
          } catch (error) {
            console.error('Error handling video playback:', error);
            setHasError(true);
          }
        } else {
          try {
            video.pause();
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

  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = (e: any) => {
    console.error('Video loading error:', e);
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className={`relative ${isMobile ? 'mb-4' : 'mb-8'} rounded-lg overflow-hidden shadow-lg`} 
      style={style}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-red-500 text-center p-4">
            Failed to load video
            <button 
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
                const video = videoRefs.current[post.id!];
                if (video) video.load();
              }}
              className="block mt-2 text-pink-500 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

<video
  ref={el => {
    if (el && post.id) {
      videoRefs.current[post.id] = el;
    }

    // HLS Integration
    if (Hls.isSupported() && post.mediaUrl?.endsWith('.m3u8')) {
      const hls = new Hls();
      hls.loadSource(post.mediaUrl);
      if (el instanceof HTMLMediaElement) {
        hls.attachMedia(el);
      }      

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        el?.play();
      });
    } else if (el?.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari (iOS & macOS) which supports HLS natively
      el.src = post.mediaUrl ?? '';
      el.addEventListener('loadedmetadata', () => {
        el.play();
      });
    }
  }}
  className="w-full h-auto max-w-md aspect-[9/16] object-contain bg-black"
  loop
  playsInline
  muted
  preload="metadata"
  onLoadedData={handleVideoLoad}
  onError={handleVideoError}
  style={{ opacity: isLoading ? 0 : 1 }}
>
  Your browser does not support the video tag.
</video>


      {/* Overlay for post information */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={post.creatorProfileImage || "/default-avatar.png"}
              alt={post.creator ?? "User content"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <span className="text-white font-medium">
            {post.creator ? `@${post.creator}` : 'Anonymous'}
          </span>
        </div>
        <p className="text-white text-sm">{post.caption}</p>
      </div>

      {/* Interaction buttons */}
      <div className={`absolute right-4 ${isMobile ? 'bottom-16' : 'bottom-20'} flex flex-col gap-4`}>
      <button 
  className="relative p-3 rounded-full bg-transparent transition-transform transform hover:scale-110"
  onClick={() => handleLikeClick(post.id)}
>
  <img 
    src={customHeart} 
    alt="Heart" 
    className="w-8 h-8"
    style={{ filter: isLiked ? 'grayscale(0)' : 'grayscale(1)' }} // Colorful if liked, grayscale if not
  />
  <span className="text-xs block mt-1 text-white">{likes}</span>
</button>

        
        <button className="bg-pink-500/80 p-3 rounded-full text-white hover:bg-pink-600 transition-colors">
          <Star size={isMobile ? 16 : 20} />
          <span className="text-xs block mt-1">{post.points || 0}</span>
        </button>

        <button className="bg-pink-500/80 p-3 rounded-full text-white hover:bg-pink-600 transition-colors">
          <Share2 size={isMobile ? 16 : 20} />
        </button>
      </div>
    </div>
  );
};

export default VideoPost;
