import { type Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/api';

// Define the input type
type CreateCommunityPostInput = {
  creator: string;
  caption: string;
  mediaUrl?: string;
};

// Define the return type
type CommunityPostResponse = {
  id: string;
  creator: string;
  caption: string;
  mediaUrl: string;
  mediaKey: string;
  mediaType: string;
  likes: number;
  points: number;
  createdAt: string;
  updatedAt: string;
};

export const createCommunityPost = async (
  client: ReturnType<typeof generateClient<Schema>>,
  data: CreateCommunityPostInput
): Promise<CommunityPostResponse> => {  
  try {
    // Log the incoming data
    console.log('Creating community post with:', {
      creator: data.creator,
      caption: data.caption,
      mediaUrl: data.mediaUrl || 'no-media'
    });
    
    // Return mock data with the correct type
    const mockResponse: CommunityPostResponse = {
      id: `post-${Date.now()}`,
      creator: data.creator,
      caption: data.caption,
      mediaUrl: data.mediaUrl || 'dummy-url',
      mediaKey: 'dummy-key',
      mediaType: 'video',
      likes: 0,
      points: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return mockResponse;
  } catch (error) {
    console.error('Error in createCommunityPost:', error);
    throw new Error('Failed to create community post');
  }
};
