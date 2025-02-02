import { useState, useEffect } from 'react';
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// Types
export type ProfileImageType = {
  url: string;
  key: string;
};

export type UseProfileImageProps = {
  userData: {
    id: string;
    profileImageKey?: string | null;
  } | null;
  onUpdateUser?: (data: { id: string; profileImageKey: string | null }) => Promise<void>;
};

export const useProfileImage = ({ userData, onUpdateUser }: UseProfileImageProps) => {
  const [profileImage, setProfileImage] = useState<ProfileImageType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const client = generateClient<Schema>();

  // Load profile image
  useEffect(() => {
    const loadProfileImage = async () => {
        if (!userData?.profileImageKey) return;
        
        try {
            const urlResult = await getUrl({
            key: userData.profileImageKey,
            options: {
                accessLevel: 'guest'
            }
            });
            
            setProfileImage({
                url: urlResult.url.href, // Using .href to get the string URL
                key: userData.profileImageKey
            });
        } catch (error) {
            console.error('Error loading profile image:', error);
        }
    };

    loadProfileImage();
  }, [userData?.profileImageKey]);

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<void> => {
    try {
      setIsLoading(true);

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      const currentUser = await getCurrentUser();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Validate file type
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        throw new Error('Please upload a valid image file (JPG, PNG, or GIF)');
      }

      const timestamp = Date.now();
      const filePath = `profile-pictures/${currentUser.userId}_${timestamp}.${fileExtension}`;

      // Upload the new image
      const result = await uploadData({
        data: file,
        key: filePath,
        options: {
          contentType: file.type,
          accessLevel: 'guest'
        }
      });

      // Get the URL of the uploaded image
      const urlResult = await getUrl({
        key: filePath,
        options: {
          accessLevel: 'guest'
        }
      });

      // Delete the old profile picture if it exists
      if (profileImage?.key) {
        try {
          await remove({
            path: profileImage.key,
          });
        } catch (error) {
          console.error('Error deleting old profile picture:', error);
        }
      }

      // Update state with new profile image
      setProfileImage({
        url: urlResult.url.href, // Using .href to get the string URL
        key: filePath
      });

      // Update user data in the database
      if (userData?.id && onUpdateUser) {
        await onUpdateUser({
          id: userData.id,
          profileImageKey: filePath
        });
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile picture removal
  const handleRemoveProfilePicture = async (): Promise<void> => {
    if (!profileImage?.key) return;

    try {
      setIsLoading(true);

      // Remove the image from storage
      await remove({
        key: profileImage.key,
        options: {
          accessLevel: 'guest'
        }
      });

      // Update user data in the database
      if (userData?.id && onUpdateUser) {
        await onUpdateUser({
          id: userData.id,
          profileImageKey: null
        });
      }

      // Clear the profile image from state
      setProfileImage(null);

    } catch (error) {
      console.error('Error removing profile picture:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profileImage,
    isLoading,
    handleImageUpload,
    handleRemoveProfilePicture
  };
};