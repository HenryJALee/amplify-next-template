import React, { useState } from 'react'; 
import { ChevronDown, ChevronUp, Heart } from 'lucide-react'; 
import Image from 'next/image';

interface AmbassadorSpotlightProps {
  compact?: boolean;
  userName?: string;
}

const spotlightData = [
  { question: "What do you create?", answer: "We Make GRWM and Vlogs" },
  { question: "Signature Scent?", answer: "Sol de Janerio Carioca Crush" },
  { question: "Favorite influencer?", answer: "Katie Fang" },
  { question: "Product that gives you Main Character Energy?", answer: "Glow Recipe Toner" },
  { question: "If you had a scent, what would it be called?", answer: "Tropical Breeze" }
];

const AmbassadorSpotlight: React.FC<AmbassadorSpotlightProps> = ({
  compact = false,
  userName = "vlogs.w.s.c" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-[0_0_10px_#ff00ff] border border-[#ff00ff] p-4">
      {/* Header section - always visible */}
      <div
        className={`flex ${compact ? 'flex-col items-center' : 'items-center justify-between'} cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left side with avatar - in mobile view, this is centered at the top */}
        <div className={`${compact ? 'mb-2' : ''} flex items-center ${compact ? 'justify-center' : ''}`}>
          {/* Replace InitialsAvatar with actual image */}
          <div className={`border-2 border-pink-400 rounded-full overflow-hidden
            ${compact ? 'w-14 h-14' : 'w-24 h-24'}`}>
            <Image 
              src="/icons/sienna-chiara.png" 
              alt="Ambassador vlogs.w.s.c"
              width={compact ? 56 : 96} 
              height={compact ? 56 : 96}
              className="object-cover"
            />
          </div>
          {!compact && (
            <span className="font-medium text-pink-500 ml-3">@{userName}</span>
          )}
        </div>
        
        {/* Right side with title - in mobile view, this is below the avatar */}
        <div className={`flex ${compact ? 'flex-col items-center' : 'items-center'} gap-2`}>
          <h2 className="text-xl font-bold text-pink-500">
            Ambassador Spotlight <span className="text-yellow-400">✨</span>
          </h2>
          
          {/* Username in mobile view appears under the title */}
          {compact && (
            <span className="font-medium text-pink-500">@{userName}</span>
          )}
          
          <button
            className="text-pink-500 hover:text-pink-600 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
      </div>
      
      {/* "Why we love them" section */}
      <div className={`flex ${compact ? 'flex-col items-center' : 'items-center'} gap-2 text-pink-600 mt-3`}>
        <div className="flex items-center">
          <Heart className="w-4 h-4 mr-1" />
          <span className="font-medium">Why we love them:</span>
        </div>
        <p className={`${compact ? 'text-center text-sm' : ''}`}>
          Vlogs.w.s.c has great style and well shot videos that you will watch till the end. A Must Follow
        </p>
      </div>
      
      {/* Dropdown content */}
      {isExpanded && (
        <div className="mt-4 space-y-4 transition-all duration-300 ease-in-out">
          <div className="border-t pt-4">
            {spotlightData.map((item, index) => (
              <div
                key={index}
                className="mb-4 p-3 bg-pink-50 rounded-lg"
              >
                <h4 className="font-medium text-pink-500">{item.question}</h4>
                <p className="text-gray-700 text-sm mt-1">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorSpotlight;