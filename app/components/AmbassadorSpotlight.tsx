import React, { useState, ChangeEvent, useEffect } from 'react';
import { User } from 'lucide-react';

const AmbassadorSpotlight = () => {
  const [image, setImage] = useState<File | null>(() => {
    const savedImage = localStorage.getItem('ambassadorImage');
    return savedImage ? new File([savedImage], 'image') : null;
  });
  
  const [preview, setPreview] = useState<string | null>(() => {
    return localStorage.getItem('ambassadorPreview') || null;
  });

  useEffect(() => {
    if (image) {
      localStorage.setItem('ambassadorImage', image.toString());
    }
    if (preview) {
      localStorage.setItem('ambassadorPreview', preview);
    }
  }, [image, preview]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = window.URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  return (
    <div className="bg-[#ffsdec] p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[#f9a4e1] text-xl font-bold mb-4 flex items-center gap-2">
          Ambassador Spotlight
          <img src="/icons/sparkle.png" alt="sparkle" className="w-6 h-6" />
        </h2>
        
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 relative group">
            {preview ? (
              <img 
                src={preview}
                alt="Ambassador"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            )}
            
            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer bg-black/30 rounded-full transition-opacity">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-white text-sm">Change</span>
            </label>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-[#f9a4e1] text-2xl font-semibold">@vlogs.w.s.c</h3>
              <span className="bg-pink-100/20 px-3 py-1 rounded-full text-sm text-[#f9a4e1]">
                Instagram 
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-[#f9a4e1]">
              </div>
            </div>
            
            <p className="text-[#f9a4e1]/90 text-sm">
              We Make GRWM and Vlogs
              Signature Scent: Sol de Janerio Carioca Crush
              Fav influencer: Katie Fang
              Product that gives me Main Character Energy: Glow Recipe Toner.
              If you had a scent what would it be called: Tropical Breeze
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorSpotlight;