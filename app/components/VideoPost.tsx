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
  creatorProfileImage?: string;
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
  const [isBuffering, setIsBuffering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const setupHls = (el: HTMLVideoElement, url: string): Hls | null => {
    if (Hls.isSupported() && url?.endsWith('.m3u8')) {
      const hls = new Hls({
        startLevel: -1,
        abrEwmaDefaultEstimate: 500000,
        abrMaxWithRealBitrate: true,
      });

      hls.loadSource(url);
      hls.attachMedia(el);

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        console.log(`Quality Level: ${data.level}`);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return hls;
    }
    return null;
  };

  const handleSoundToggle = (postId: string | null) => {
    if (!postId) return;
    const video = videoRefs.current[postId];
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLikeClick = (postId: string | null) => {
    if (!postId) return;
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  useEffect(() => {
    const videoElement = post.id ? videoRefs.current[post.id] : null;
    if (videoElement) {
      videoElement.addEventListener('canplay', () => {
        if (!isPlaying) {
          videoElement.play().catch(console.error);
        }
      });

      videoElement.addEventListener('playing', () => {
        setIsPlaying(true);
      });
    }
  }, [post.id, isPlaying]);

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
            if (post.mediaUrl) {
              setupHls(el, post.mediaUrl);
            }
          }

          if (el) {
            el.addEventListener('waiting', () => setIsBuffering(true));
            el.addEventListener('playing', () => setIsBuffering(false));
            
            el.addEventListener('timeupdate', () => {
              if (el.duration - el.currentTime < 10) {
                // Preload next video logic here
              }
            });
          }

          if (!Hls.isSupported() && el?.canPlayType('application/vnd.apple.mpegurl')) {
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
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        Your browser does not support the video tag.
      </video>

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        </div>
      )}

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

      <div className={`absolute right-4 ${isMobile ? 'bottom-16' : 'bottom-20'} flex flex-col gap-4`}>
        <button 
          className="relative p-3 rounded-full bg-transparent transition-transform transform hover:scale-110"
          onClick={() => handleLikeClick(post.id)}
        >
          <Image 
            src={customHeart} 
            alt="Heart" 
            className="w-8 h-8"
            style={{ filter: isLiked ? 'grayscale(0)' : 'grayscale(1)' }}
          />
          <span className="text-xs block mt-1 text-white">{likes}</span>
        </button>

        <button 
          className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"
          onClick={() => handleSoundToggle(post.id)}
        >
          {isMuted ? '🔇' : '🔊'}
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
