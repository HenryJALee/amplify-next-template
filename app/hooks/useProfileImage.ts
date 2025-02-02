import { useState, useEffect } from 'react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';

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

  useEffect(() => {
    const loadProfileImage = async () => {
      if (!userData?.profileImageKey) {
        console.log('No profile image key found');
        return;
      }
      
      try {
        console.log('Attempting to load profile image with key:', userData.profileImageKey);
        
        const urlResult = await getUrl({
          key: userData.profileImageKey,
          options: {
            accessLevel: 'guest',
            validateObjectExistence: true
          }
        });
        
        console.log('Successfully generated URL for profile image:', urlResult);
        
        setProfileImage({
          url: urlResult.url.href,
          key: userData.profileImageKey
        });
      } catch (error) {
        console.error('Error loading profile image:', error);
        // If the image doesn't exist in storage but we have a key, clean up the database
        if (userData?.id && onUpdateUser) {
          try {
            await onUpdateUser({
              id: userData.id,
              profileImageKey: null
            });
          } catch (cleanupError) {
            console.error('Error cleaning up invalid profile image reference:', cleanupError);
          }
        }
      }
    };

    loadProfileImage();
  }, [userData?.profileImageKey, userData?.id, onUpdateUser]);

  const handleImageUpload = async (file: File): Promise<void> => {
    try {
      setIsLoading(true);

      const currentUser = await getCurrentUser();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      // Validate file type
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        throw new Error('Please upload a valid image file (JPG, PNG, or GIF)');
      }

      const timestamp = Date.now();
      const filePath = `profile-pictures/${currentUser.userId}_${timestamp}.${fileExtension}`;

      console.log('Uploading new profile image with key:', filePath);

      // Upload the new image
      await uploadData({
        data: file,
        key: filePath,
        options: {
          contentType: file.type,
          accessLevel: 'guest'
        }
      }).result;

      console.log('Successfully uploaded file to S3');

      // Add a small delay to ensure file is available
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get the URL of the uploaded image
      const urlResult = await getUrl({
        key: filePath,
        options: {
          accessLevel: 'guest',
          validateObjectExistence: true
        }
      });

      console.log('Generated URL for uploaded image:', urlResult);

      // Delete the old profile picture if it exists
      if (profileImage?.key) {
        try {
          console.log('Attempting to delete old profile image:', profileImage.key);
          await remove({
            key: profileImage.key,
            options: {
              accessLevel: 'guest'
            }
          });
          console.log('Successfully deleted old profile image');
        } catch (error) {
          console.error('Error deleting old profile picture:', error);
        }
      }

      // Update state with new profile image
      const newProfileImage = {
        url: urlResult.url.href,
        key: filePath
      };
      console.log('Setting new profile image:', newProfileImage);
      setProfileImage(newProfileImage);

      // Update user data in the database
      if (userData?.id && onUpdateUser) {
        console.log('Updating user record with new profile image key:', filePath);
        await onUpdateUser({
          id: userData.id,
          profileImageKey: filePath
        });
        console.log('Successfully updated user record');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProfilePicture = async (): Promise<void> => {
    if (!profileImage?.key) return;

    try {
      setIsLoading(true);
      console.log('Attempting to remove profile picture:', profileImage.key);

      // Remove the image from storage
      await remove({
        key: profileImage.key,
        options: {
          accessLevel: 'guest'
        }
      });

      console.log('Successfully removed image from storage');

      // Update user data in the database
      if (userData?.id && onUpdateUser) {
        console.log('Updating user record to remove profile image reference');
        await onUpdateUser({
          id: userData.id,
          profileImageKey: null
        });
        console.log('Successfully updated user record');
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