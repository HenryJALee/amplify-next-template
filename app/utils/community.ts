import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();


export const listCommunityPosts = async () => {
  const client = generateClient<Schema>();
  
  try { 
    const response = await client.models.CommunityPost.listCommunityPostByMediaTypeAndSortOrder(
      {
          mediaType: "video",
      },
      {
          limit: 5,
          sortDirection: 'DESC'
      }
  );
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
  mediaType: string;
  mediaUrl: string;
  mediaKey: string;
}): Promise<any> => {  
  try {
    const maxDate = new Date('9999-12-31T23:59:59Z').getTime();
    const now = new Date().getTime();
    const sortnumber = parseInt((maxDate - now).toString());
  
    const response = await client.models.CommunityPost.create({
      creator: data.creator,
      caption: data.caption,
      mediaType: 'video',
      mediaUrl: data.mediaUrl.replace('community-videos', 'compressed-videos'),
      mediaKey: data.mediaKey.replace('community-videos', 'compressed-videos').replace(/\.(mp4|mov)$/, '.mp4'),
      sortOrder: sortnumber
    });
    return response;
  } catch (error) {
    console.error('Error in createCommunityPost:', error);
    throw new Error('Failed to create community post');
  }
};
