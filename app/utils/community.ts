import { generateClient } from 'aws-amplify/api';
import { type Schema } from '@/amplify/data/resource';
import { type CommunityPost } from '../types/community';

type CreateCommunityPostInput = {
  creator: string;
  caption: string;
  mediaUrl: string;
};

export const createCommunityPost = async (
  client: ReturnType<typeof generateClient<Schema>>,
  data: CreateCommunityPostInput
): Promise<any> => {  // Changed return type to any temporarily
  try {
    console.log('Dummy function - would create post with:', {
      creator: data.creator,
      caption: data.caption,
      videoFileName: data.mediaUrl
    });
    
    // Return dummy data
    return {
      id: 'dummy-id',
      creator: data.creator,
      caption: data.caption,
      mediaUrl: 'dummy-url',
      mediaKey: 'dummy-key',
      mediaType: 'video',
      likes: 0,
      points: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in dummy createCommunityPost:', error);
    throw error;
  }
};
