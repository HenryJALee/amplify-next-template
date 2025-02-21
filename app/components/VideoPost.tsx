import React, { useEffect, useState } from 'react';
import { Star, Share2 } from 'lucide-react';
import Hls from 'hls.js';
import Image from 'next/image';
import customHeart from '/public/icons/customheart.png';

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
const [isBuffering, setIsBuffering] = useState(false);
const [isPlaying, setIsPlaying] = useState(false);

// Add HLS configuration options
const hlsConfig = {
      maxBufferLength: 30, // seconds
      maxMaxBufferLength: 60, // seconds
      manifestLoadingTimeOut: 10000, // milliseconds
      manifestLoadingMaxRetry: 3,
      levelLoadingTimeOut: 10000,
      fragLoadingTimeOut: 20000,
      enableWorker: true // Enable web workers for better performance
};

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

const setupHls = (el: HTMLVideoElement, url: string) => {
  if (Hls.isSupported() && url?.endsWith('.m3u8')) {
    const hls = new Hls({
      ...hlsConfig,
      startLevel: -1, // Auto-select initial quality
      abrEwmaDefaultEstimate: 500000, // Default bandwidth estimate
      abrMaxWithRealBitrate: true, // Use real bitrate for ABR
    });

    hls.loadSource(url);
    hls.attachMedia(el);

    hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
      console.log(`Quality Level: ${data.level}`);
    });

    // Handle errors
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad(); // Try to recover on network errors
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError(); // Try to recover on media errors
            break;
          default:
            // Cannot recover
            hls.destroy();
            break;
        }
      }
    });
  }
};

  useEffect(() => {
    const videoElement = post.id ? videoRefs.current[post.id] : null;
    if (videoElement) {
      // Set initial low quality
      videoElement.addEventListener('canplay', () => {
        if (!isPlaying) {
          videoElement.play().catch(console.error);
        }
      });

      // Gradually increase quality
      videoElement.addEventListener('playing', () => {
        setIsPlaying(true);
      });
    }
  }, [post.id]);


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

  const handleVideoError = async (e: any) => {
    console.error('Video loading error:', e);
    setIsLoading(false);
    setHasError(true);
  
    // Implement retry logic with exponential backoff
    let retryCount = 0;
    const maxRetries = 3;
    const retryVideo = async () => {
      if (retryCount < maxRetries) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        const video = videoRefs.current[post.id!];
        if (video) {
          video.load();
          setIsLoading(true);
          setHasError(false);
        }
      }
    };
    
    await retryVideo();
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

        if (el) {
          el.addEventListener('waiting', () => setIsBuffering(true));
          el.addEventListener('playing', () => setIsBuffering(false));
          
          // Preload next video when current one is almost finished
          el.addEventListener('timeupdate', () => {
            if (el.duration - el.currentTime < 10) { // 10 seconds before end
              // Preload next video logic here
            }
          });
        }

        // HLS Integration
        if (Hls.isSupported() && post.mediaUrl?.endsWith('.m3u8')) {
          const hls = new Hls(hlsConfig);
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
      preload="auto"
      onLoadedData={handleVideoLoad}
      onError={handleVideoError}
      style={{ 
        opacity: isLoading ? 0 : 1,
        willChange: 'transform', // Optimize for animations
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
    >
      Your browser does not support the video tag.
    </video>
    {isBuffering && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    )}


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
<Image 
    src={customHeart} 
    alt="Heart" 
    className="w-8 h-8"
    style={{ filter: isLiked ? 'grayscale(0)' : 'grayscale(1)' }} // Colorful if liked, grayscale if not
    width={32} // w-8 = 2rem = 32px
    height={32} // h-8 = 2rem = 32px
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
