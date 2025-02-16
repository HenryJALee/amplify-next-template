type Nullable<T> = T | null;

export interface CommunityPostType {
    id: Nullable<string>;
    creator: Nullable<string>;
    mediaType: "video" | null;
    mediaUrl: Nullable<string>;
    mediaKey: Nullable<string>;
    caption: Nullable<string>;
    likes: Nullable<number>;
    points: Nullable<number>;
    createdAt: Nullable<string>;
    updatedAt: string;
    creatorProfileImage?: string;
  };