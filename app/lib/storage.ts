import { uploadData } from 'aws-amplify/storage';

interface StoreVideoParams {
  file: File;
  videoKey: string;
  cookieKey: string;
  onProgress?: (progress: number) => void;
}

export async function storeVideo({
  file,
  videoKey,
  cookieKey,
  onProgress
}: StoreVideoParams) {
  try {
    const result = await uploadData({
      data: file,
      key: videoKey,
      options: {
        contentType: file.type,
        accessLevel: 'guest',
        metadata: {
          cookieKey // Store the cookie key in metadata
        },
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes && totalBytes > 0) {
            const progress = (transferredBytes / totalBytes) * 100;
            onProgress?.(progress);
          } else {
            onProgress?.(0);
          }
        },
      }
    }).result;

    return result;
  } catch (error) {
    console.error('Error storing video:', error);
    throw error;
  }
}
