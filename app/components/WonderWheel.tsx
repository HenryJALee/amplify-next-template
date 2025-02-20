import React, { useState, useEffect } from 'react';
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";
import { DailyScentFortune } from './DailyScentFortune';
import { getCurrentUser } from 'aws-amplify/auth';

type SlotIcon = 'palm' | 'star' | 'burst' | 'green' | 'yellow' | 'circle' | 'heart' | 'sparkle';

interface ScentRecommendation {
  fragrance: string;
  description: string;
  personality: string;
}

const questions = [
    {
      question: "What's your age range?",
      options: ["18 and under", "18-30", "31-44", "45+"]
    },
    {
      question: "How would you describe your personal style?",
      options: ["Classic & Elegant", "Boho & Free-spirited", "Edgy & Bold", "Minimalist & Chic", "Playful & Fun"]
    },
    {
      question: "How would you describe yourself?",
      options: ["Outgoing & Social", "Calm & Introverted", "Adventurous & Spontaneous", "Dreamy & Romantic", "Mysterious & Enigmatic", "Feminine & Flirty", "Bold & Daring", "Fresh & Sporty", "Earthy & Grounded", "Timeless & Understated"]
    },
    {
      question: "How do you want people to feel when they smell your fragrance?",
      options: ["Intrigued", "Comforted", "Energized", "Relaxed", "Impressed", "Playful"]
    },
    {
      question: "Which season do you enjoy the most?",
      options: ["Spring", "Summer", "Autumn", "Winter"]
    },
    {
      question: "How do you typically spend a Friday night?",
      options: ["Out with friends", "Relaxing at home", "On an adventure", "Enjoying a romantic evening", "Diving into a creative project"]
    }
];

const scentRecommendations: Record<string, ScentRecommendation> = {
  "Outgoing & Social": {
    fragrance: "Pink Yacht Club",
    description: "A sensorial blend of hibiscus, peach, bergamot, and a twist of sweet vanilla musk.",
    personality: "Your vibrant energy and natural charisma call for a fragrance that makes a statement! Pink Yacht Club perfectly matches your social butterfly nature with its bright, inviting notes that draw people in and spark conversation."
  },
  "Calm & Introverted": {
    fragrance: "Cake for Breakfast",
    description: "A floral gourmand dream with almond, orchid, caramel, white flowers, vanilla, and musk.",
    personality: "Your thoughtful and serene nature deserves a comforting scent that feels like a warm hug. This sweet and sophisticated blend creates a gentle personal sanctuary that helps you feel centered and peaceful."
  },
  "Adventurous & Spontaneous": {
    fragrance: "Carrousel",
    description: "Notes of almond, cherry, raspberry, marshmallow, vanilla, and caramel.",
    personality: "Your free spirit needs a fragrance that can keep up with your spontaneous lifestyle! This playful and unique blend mirrors your adventurous nature while remaining utterly captivating."
  },
  "Dreamy & Romantic": {
    fragrance: "Phlur Missing Person",
    description: "Soft musk, jasmine, and subtle skin-like warmth.",
    personality: "Your romantic soul calls for a fragrance that captures the essence of intimate moments. This delicate scent wraps you in a dreamy cloud that feels both personal and enchanting."
  },
  "Mysterious & Enigmatic": {
    fragrance: "Le Labo Santal 33",
    description: "Smoky cardamom, iris, and sandalwood.",
    personality: "Your enigmatic aura deserves an equally intriguing scent. This sophisticated blend adds to your mystique with its complex layers that keep people guessing and wanting to know more."
  },
  "Feminine & Flirty": {
    fragrance: "Sol de Janeiro Cheirosa 68",
    description: "Brazilian jasmine, pink dragonfruit, and sheer vanilla.",
    personality: "Your playful and flirtatious nature shines through in this irresistible scent. It's the perfect balance of sweet and sophisticated that makes heads turn and hearts flutter."
  },
  "Bold & Daring": {
    fragrance: "Maison Francis Kurkdjian Baccarat Rouge 540",
    description: "Saffron, amberwood, and jasmine.",
    personality: "Your confident and fearless spirit demands a fragrance that's as bold as you are. This powerful scent makes an unforgettable statement, just like its wearer."
  },
  "Fresh & Sporty": {
    fragrance: "Dolce & Gabbana Light Blue",
    description: "Zesty lemon, crisp apple, and clean cedarwood.",
    personality: "Your active and energetic lifestyle pairs perfectly with this refreshing scent. It's as invigorating as your spirit and keeps you feeling fresh through all your adventures."
  },
  "Earthy & Grounded": {
    fragrance: "Diptyque Tam Dao",
    description: "Creamy sandalwood, cypress, and warm spices.",
    personality: "Your connection to nature and authentic presence calls for a grounding fragrance. This earthy blend centers you while emanating quiet confidence."
  },
  "Timeless & Understated": {
    fragrance: "Chanel No. 5 L'Eau",
    description: "Classic aldehydes, ylang-ylang, and soft cedar.",
    personality: "Your elegant and timeless taste deserves an equally sophisticated scent. This refined fragrance perfectly captures your appreciation for enduring beauty and subtle luxury."
  }
};

// Utility function to get current week identifier
const getCurrentWeekId = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((now.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
};
  
// Check if there's already a winner this week
const checkWeeklyWinner = async () => {
  
  const client = generateClient<Schema>();

  try {
    const currentWeekId = getCurrentWeekId();
    
    const { data } = await client.models.PrizeRecord.list({
      filter: {
        weekId: {
          eq: currentWeekId
        }
      }
    });

    return data.length > 0;
  } catch (error) {
    console.error('Error checking weekly winner:', error);
    return true; // Fail safe - if we can't check, assume there's a winner
  }
};

const generateSpinResult = async (): Promise<SlotIcon[]>  => {
  // Check if there's already a winner this week
  const hasWinnerThisWeek = await checkWeeklyWinner();
  
  const iconOptions: SlotIcon[] = ['palm', 'star', 'burst', 'green', 'yellow', 'circle', 'heart', 'sparkle'];
  
  if (hasWinnerThisWeek) {
    // Force different icons when there's already a winner
    const finalResult: SlotIcon[] = [];
    const usedIcons = new Set<SlotIcon>();
    
    for (let i = 0; i < 3; i++) {
      // Filter out already used icons
      const availableIcons = iconOptions.filter(icon => !usedIcons.has(icon));
      // Get random icon from remaining options
      const randomIndex = Math.floor(Math.random() * availableIcons.length);
      const selectedIcon = availableIcons[randomIndex];
      // Add to result and mark as used
      finalResult.push(selectedIcon);
      usedIcons.add(selectedIcon);
    }
    
    return finalResult;
  } else {
    // Original random logic when no winner yet
    return Array(3).fill(null).map(() => {
      return iconOptions[Math.floor(Math.random() * iconOptions.length)];
    });
  }
};

const WonderWheel = () => {
  const SPINS_ALLOWED = 3;
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState<SlotIcon[]>(['palm', 'star', 'burst']);
  const [lastPlayTime, setLastPlayTime] = useState<number | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  const [spinsRemaining, setSpinsRemaining] = useState(SPINS_ALLOWED);
  
  const icons: Record<SlotIcon, string> = {
    palm: '/icons/Pink-Palm.png',
    star: '/icons/Pink-Star.png',
    burst: '/icons/Blue-Star.png',
    green: '/icons/Green-Star.png',
    yellow: '/icons/Yellow-Star.png',
    circle: '/icons/wonder-circles.png',
    heart: '/icons/customheart.png',
    sparkle: '/icons/sparkle.png'
  }

  const notifyWinner = async (userId: string) => {
    const client = generateClient<Schema>();
    try {
      
      const response = await client.queries.notifyWinQuery({
        userName: userId
      })

      if (!response || !response) {
        throw new Error('Invalid response from notifyWinnerQuery');
      }
      console.log('Notification sent:', response);
      return response;
    } catch (error) {
      console.error('Error notifying winner:', error);
      throw error;
    }
  };

  const checkWin = (result: SlotIcon[]) => {
    // Check for three matching icons
    //return true;
    return result[0] === result[1] && result[1] === result[2];
    
  };

  useEffect(() => {
    const storedTime = localStorage.getItem('lastPlayTime');
    const storedSpins = localStorage.getItem('spinCount');
    
    if (storedTime) {
        const lastPlay = parseInt(storedTime);
        const now = Date.now();
        const hoursSinceLastPlay = (now - lastPlay) / (1000 * 60 * 60);
        
        if (hoursSinceLastPlay >= 23) {
            // Reset after 23 hours
            setCanPlay(true);
            setSpinsRemaining(SPINS_ALLOWED);
            localStorage.setItem('spinCount', '0');
        } else {
            // Within 23 hour window
            const remainingSpins = SPINS_ALLOWED - parseInt(storedSpins || '0');
            setSpinsRemaining(remainingSpins);
            setCanPlay(remainingSpins > 0);
        }
        setLastPlayTime(lastPlay);
    }
  }, []);

  const spinWheel = async () => {
    if (isSpinning || !canPlay) return;
    
    setIsSpinning(true);
    
    // Update spin count
    const currentSpins = parseInt(localStorage.getItem('spinCount') || '0');
    const newSpinCount = currentSpins + 1;
    localStorage.setItem('spinCount', newSpinCount.toString());
    
    // Update last play time if this is the first spin
    if (currentSpins === 0) {
        const now = Date.now();
        setLastPlayTime(now);
        localStorage.setItem('lastPlayTime', now.toString());
    }
    
    setSpinsRemaining(SPINS_ALLOWED - newSpinCount);
    if (newSpinCount >= SPINS_ALLOWED) {
        setCanPlay(false);
    }
    
    const spinInterval = setInterval(() => {
      setSlots(prev => prev.map(() => {
        const iconOptions: SlotIcon[] = ['palm', 'star', 'burst', 'green', 'yellow', 'circle', 'heart', 'sparkle'];
        return iconOptions[Math.floor(Math.random() * iconOptions.length)];
      }));
    }, 100);

    const finalResult = await generateSpinResult();

    setTimeout(async () => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      setSlots(finalResult);

      if (checkWin(finalResult)) {
        // Store winning combination in PrizeRecord with username
        const currentUser = await getCurrentUser();
        console.log('Current user:', currentUser);
        
        const currentWeekId = getCurrentWeekId();
        const client = generateClient<Schema>();
        await client.models.PrizeRecord.create({
          weekId: currentWeekId,
          winningTime: new Date().toISOString(),
          userId: currentUser.username // Replace with actual user ID
        });
        await notifyWinner(currentUser.username);
        alert('🎉 Congratulations! You won a Pink Croptop! Our team will contact you soon.');
      }
    }, 3000);
  };

  const getTimeRemaining = () => {
    if (!lastPlayTime) return '';
    const now = Date.now();
    const hoursSinceLastPlay = (now - lastPlayTime) / (1000 * 60 * 60);
    const hoursRemaining = Math.ceil(23 - hoursSinceLastPlay);
    return hoursRemaining > 0 
        ? `Reset in ${hoursRemaining} hours. Spins remaining: ${spinsRemaining}`
        : '';
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#FFF6F9]">
      <div className="max-w-2xl mx-auto bg-[#fff6f9] rounded-lg shadow-[0_0_10px_#ff00ff] p-8 mb-8">
        <h1 className="text-4xl font-bold text-pink-500 text-center mb-8">Wonder Wheel</h1>
        
        <div className="flex justify-center gap-4 mb-8">
          {slots.map((icon, index) => (
            <div
              key={index}
              className="w-32 h-32 border-4 border-[#ff00ff] rounded-lg bg-[#fff6f9] flex items-center justify-center overflow-hidden"
              style={{ 
                animation: isSpinning ? 'pulse 0.5s infinite' : 'none',
                boxShadow: '0 0 10px #ff00ff'
              }}
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <img
                  src={icons[icon]}
                  alt={icon}
                  className={`w-full h-full object-contain ${isSpinning ? 'animate-spin' : ''}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="mb-4 text-pink-500 text-lg">Rules: Spin the Wheel up to 3 times every 23 hours to win! This weeks winners get a Pink Croptop!</p>
          <button
            onClick={spinWheel}
            disabled={isSpinning || !canPlay}
            className="px-8 py-4 bg-pink-500 text-white rounded-full text-xl font-bold hover:bg-pink-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {isSpinning ? 'Spinning...' : canPlay ? `SPIN! (${spinsRemaining} left)` : 'Wait 23h'}
          </button>
          {!canPlay && !isSpinning && (
            <p className="mt-2 text-pink-500">{getTimeRemaining()}</p>
          )}
        </div>
      </div>

      {/* Add DailyScentFortune component here */}
      <DailyScentFortune />
      
      <FindYourScentPersonality />
    </div>
  );
};

function FindYourScentPersonality() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const personality: string = answers[2] ?? "Timeless & Understated"; // Ensure a default value
    const recommendation = scentRecommendations[personality];
    setResult(recommendation ? 
      `✨ ${recommendation.fragrance} ✨\n\n${recommendation.personality}\n\nNotes: ${recommendation.description}` 
      : "A unique blend made just for you!");
};

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <h1 className="text-4xl font-bold text-[#ff47b0] text-center mb-4">
        ✨Find Your Scent Personality✨
      </h1>
  
{result ? (
  <div className="text-center p-8 bg-white shadow-lg rounded-lg">
    {result.split('\n').map((text, index) => {
      if (index === 0) {
        return <h2 key={index} className="text-2xl font-bold text-[#ff47b0] mb-4">{text}</h2>;
      } else if (index === 1) {
        return <p key={index} className="text-lg text-gray-700 mb-4">{text}</p>;
      } else {
        return <p key={index} className="text-gray-600 italic">{text}</p>;
      }
    })}
    <p className="text-gray-600 mt-4">Your scent personality is as unique as you are! 🌸✨</p>
  </div>
) : (
        <div className="p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-[#ff47b0] mb-4">{questions[currentQuestion].question}</h2>
          <div className="flex flex-col gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(option)} 
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WonderWheel;