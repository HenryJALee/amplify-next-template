import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();


export const listCommunityPosts = async () => {
  const client = generateClient<Schema>();
  
  try {
    const response = await client.models.CommunityPost.list();
    return response;
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw new Error('Failed to fetch community posts');
  }
};

export const createCommunityPost = async (
data: {
  creator: string;
  caption: string;
  mediaUrl: string;
  mediaKey: string;
}): Promise<any> => {  
  try {
    const response = await client.models.CommunityPost.create({
      creator: data.creator,
      caption: data.caption,
      mediaUrl: data.mediaUrl.replace('community-videos', 'compressed-videos'),
      mediaKey: data.mediaKey.replace('community-videos', 'compressed-videos').replace(/\.(mp4|mov)$/, '.mp4')
    });
    return response;
  } catch (error) {
    console.error('Error in createCommunityPost:', error);
    throw new Error('Failed to create community post');
  }
};
