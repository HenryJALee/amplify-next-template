import React, { useState, ChangeEvent, useEffect } from 'react';
import { User } from 'lucide-react';

interface AmbassadorSpotlightProps {
  compact?: boolean;
}

const AmbassadorSpotlight: React.FC<AmbassadorSpotlightProps> = ({ compact = false }) => {
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

  const spotlightData = [
    { question: "What do you create?", answer: "We Make GRWM and Vlogs" },
    { question: "Signature Scent?", answer: "Sol de Janerio Carioca Crush" },
    { question: "Favorite influencer?", answer: "Katie Fang" },
    { question: "Product that gives you Main Character Energy?", answer: "Glow Recipe Toner" },
    { question: "If you had a scent, what would it be called?", answer: "Tropical Breeze" }
  ];

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold text-pink-500 flex items-center gap-2 mb-3">
          Spotlight <span className="text-yellow-400">✨</span>
        </h2>
        <div className="space-y-3">
          {spotlightData.map((item, index) => (
            <div key={index} className="space-y-1">
              <h4 className="font-medium text-pink-500">{item.question}</h4>
              <p className="text-gray-700 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p- bg-[#FFF6F9]">
      <div className="max-w-6xl min-h-[200px] mx-auto bg-white rounded-3xl shadow-[0_0_50px_rgba(255,0,255,0.3)] p-8">
        <h2 className="text-4xl font-bold text-pink-500 text-center mb-8">
          Ambassador Spotlight ✨
        </h2>
        
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 relative group">
            {preview ? (
              <img 
                src={preview}
                alt="Ambassador"
                className="w-24 h-24 rounded-full border-4 border-[#ff00ff] shadow-[0_0_10px_#ff00ff] object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-[#ff00ff] shadow-[0_0_10px_#ff00ff] bg-gray-200 flex items-center justify-center">
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

          {/* Q&A Section */}
          <div className="flex-1 bg-white/50 rounded-lg p-6 border-2 border-[#ff00ff] shadow-[0_0_10px_#ff00ff]">
            <div className="space-y-4">
              {spotlightData.map((item, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold text-pink-500">{item.question}</h4>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorSpotlight;