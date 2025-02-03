export type CommunityPost = {
    id: string;
    creator: string;
    platform: 'tiktok' | 'instagram';
    mediaType: 'video';
    mediaUrl: string;
    mediaKey: string;
    thumbnail?: string;
    caption: string;
    likes: number;
    points: number;
    createdAt: string;
  };