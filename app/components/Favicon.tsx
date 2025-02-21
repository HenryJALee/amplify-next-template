'use client';
import { useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';

const Favicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        // Get the signed URL for the favicon
        const { url } = await getUrl({
          key: 'icons/pink-yacht-club.png',
          options: {
            accessLevel: 'guest',
            validateObjectExistence: true
          }
        });

        // Update favicon links
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach((link: Element) => {
          if (link instanceof HTMLLinkElement) {
            link.href = url.href;
          }
        });

        // If no favicon links exist, create them
        if (links.length === 0) {
          const link = document.createElement('link');
          link.rel = 'icon';
          link.href = url.href;
          document.head.appendChild(link);
        }
      } catch (error) {
        console.error('Error setting favicon:', error);
      }
    };

    updateFavicon();
  }, []);

  return null;
};

export default Favicon;