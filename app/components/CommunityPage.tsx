'use client';

import { generateClient } from "aws-amplify/api";
import { getUrl } from 'aws-amplify/storage';
import type { Schema } from "@/amplify/data/resource";
import React, { useRef, useState, useEffect } from 'react';
import AmbassadorSpotlight from './AmbassadorSpotlight';
import VideoPost from './VideoPost';

type CommunityPostType = {
  id: string | null;
  creator: string | null;
  mediaType: "video" | null;
  mediaUrl: string | null;
  mediaKey: string | null;
  caption: string | null;
  likes: number | null;
  points: number | null;
  createdAt: string | null;
  updatedAt: string;
  creatorProfileImage?: string;
};

interface CommunityPageProps {
  isMobile: boolean;
}

export default function CommunityPage({ isMobile }: CommunityPageProps) {
  const [visiblePosts, setVisiblePosts] = useState<CommunityPostType[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const client = generateClient<Schema>();

  // Initial load effect
  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        setIsLoading(true);
        const response = await client.models.CommunityPost.listCommunityPostByMediaTypeAndSortOrder(
          {
              mediaType: "video",
          },
          {
              limit: 5,
              sortDirection: 'ASC',
          }
      );
        
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000); // 30 seconds ago

        const filteredPosts = response.data
        .filter(post => {
            if (!post.createdAt) {
                return false;
            }
            const postDate = new Date(post.createdAt);
            return postDate <= thirtySecondsAgo;
        })

        if (filteredPosts) {
          const processedPosts = await Promise.all(
            filteredPosts.map(async (post) => {
              if (post.mediaKey) {
                const signedURL = await getUrl({
                  key: post.mediaKey,
                  options: { accessLevel: 'guest', validateObjectExistence: true }
                });
                return { ...post, mediaUrl: signedURL.url.href };
              }
              return post;
            })
          );

          setVisiblePosts(processedPosts);
          setLastKey(response.nextToken || null);
          setHasMore(!!response.nextToken);
        }
      } catch (error) {
        console.error('Error loading initial posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPosts();
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const loadPosts = async () => {
      if (!hasMore || !lastKey) return;

      try {
        const response = await client.models.CommunityPost.listCommunityPostByMediaTypeAndSortOrder(
          {
              mediaType: "video",
          },
          {
              limit: 5,
              sortDirection: 'ASC',
              nextToken: lastKey
          }
      );

        if (response.data) {
          const processedPosts = await Promise.all(
            response.data.map(async (post) => {
              if (post.mediaKey) {
                const signedURL = await getUrl({
                  key: post.mediaKey,
                  options: { accessLevel: 'guest', validateObjectExistence: true }
                });
                return { ...post, mediaUrl: signedURL.url.href };
              }
              return post;
            })
          );

          setVisiblePosts(prev => [...prev, ...processedPosts]);
          setLastKey(response.nextToken || null);
          setHasMore(!!response.nextToken);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [lastKey, hasMore]);

  const handleLike = async (postId: string) => {
    // Implement your like functionality here
    console.log('Liked post:', postId);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4">
        {visiblePosts.map((post) => (
          <div 
            key={post.id} 
            className={`mb-16 ${isMobile ? 'w-full' : 'max-w-md mx-auto'}`}
          >
            <VideoPost 
              post={post}
              onLike={handleLike}
            />
          </div>
        ))}
        
        <div ref={loadingRef} className="flex justify-center p-4">
          {hasMore && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-pink-50">
      <div className="min-h-screen flex flex-col">
        <AmbassadorSpotlight />
        <div className="flex-1 bg-[#FFF6F9] py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}