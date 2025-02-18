import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [preview, setPreview] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const InitialsAvatar = () => (
    <div 
      className={`
        flex items-center justify-center rounded-full
        ${compact ? 'w-12 h-12' : 'w-24 h-24'}
        bg-gradient-to-r from-pink-200 to-purple-200
      `}
    >
      <span 
        className={`
          font-semibold text-pink-600
          ${compact ? 'text-lg' : 'text-3xl'}
        `}
      >
        V
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-[0_0_10px_#ff00ff] border border-[#ff00ff] p-4">
      {/* Header section - always visible */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="border-2 border-pink-400 rounded-full">
            <InitialsAvatar />
          </div>
          <span className="font-medium text-pink-500">@{userName}</span>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-pink-500">
            Ambassador Spotlight <span className="text-yellow-400">✨</span>
          </h2>
          <button 
            className="text-pink-500 hover:text-pink-600 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>
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
