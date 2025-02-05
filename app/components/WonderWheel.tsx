import React, { useState, useEffect } from 'react';

type SlotIcon = 'palm' | 'star' | 'burst' | 'green' | 'yellow' | 'circle' | 'heart' | 'sparkle';

const WonderWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [slots, setSlots] = useState<SlotIcon[]>(['palm', 'star', 'burst']);
  const [lastPlayTime, setLastPlayTime] = useState<number | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  
  const icons: Record<SlotIcon, string> = {
    palm: '/icons/Pink-Palm.png',
    star: '/icons/Pink-Star.png',
    burst: '/icons/Blue-Star.png',
    green: '/icons/Green-Star.png',
    yellow: '/icons/Yellow-Star.png',
    circle: '/icons/wonder-circles.png',
    heart: '/icons/heart-icon.png',
    sparkle: '/icons/sparkle.png'
  };

  const notifyAdmin = async (winningCombination: SlotIcon[]) => {
    try {
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          combination: winningCombination,
          userId: 'current-user-id', // Replace with actual user ID
          prize: 'Pink Croptop'
        }),
      });
    } catch (error) {
      console.error('Failed to notify admin:', error);
    }
  };

  const checkWin = (result: SlotIcon[]) => {
    // 1 in 100,000 chance
    return Math.random() < 0.00001;
  };

  useEffect(() => {
    const storedTime = localStorage.getItem('lastPlayTime');
    if (storedTime) {
      const lastPlay = parseInt(storedTime);
      const now = Date.now();
      const hoursSinceLastPlay = (now - lastPlay) / (1000 * 60 * 60);
      setCanPlay(hoursSinceLastPlay >= 23);
      setLastPlayTime(lastPlay);
    }
  }, []);

  const spinWheel = async () => {
    if (isSpinning || !canPlay) return;
    
    setIsSpinning(true);
    const now = Date.now();
    setLastPlayTime(now);
    localStorage.setItem('lastPlayTime', now.toString());
    setCanPlay(false);
    
    const spinInterval = setInterval(() => {
      setSlots(prev => prev.map(() => {
        const iconOptions: SlotIcon[] = ['palm', 'star', 'burst', 'green', 'yellow', 'circle', 'heart', 'sparkle'];
        return iconOptions[Math.floor(Math.random() * iconOptions.length)];
      }));
    }, 100);

    setTimeout(async () => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      
      const finalResult = Array(3).fill(null).map(() => {
        const iconOptions: SlotIcon[] = ['palm', 'star', 'burst', 'green', 'yellow', 'circle', 'heart', 'sparkle'];
        return iconOptions[Math.floor(Math.random() * iconOptions.length)];
      });
      
      setSlots(finalResult);

      if (checkWin(finalResult)) {
        await notifyAdmin(finalResult);
        alert('🎉 Congratulations! You won a Pink Croptop! Our team will contact you soon.');
      }
    }, 3000);
  };

  const getTimeRemaining = () => {
    if (!lastPlayTime) return '';
    const now = Date.now();
    const hoursSinceLastPlay = (now - lastPlayTime) / (1000 * 60 * 60);
    const hoursRemaining = Math.ceil(23 - hoursSinceLastPlay);
    return hoursRemaining > 0 ? `Try again in ${hoursRemaining} hours` : '';
  };

  return (
    <div className="min-h-screen bg-[#fff6f9] p-6">
      <div className="max-w-2xl mx-auto bg-[#fff6f9] rounded-lg shadow-[0_0_10px_#ff00ff] p-8">
        <h1 className="text-4xl font-bold text-pink-500 text-center mb-8">Wonder Wheel</h1>
        
        <div className="flex justify-center gap-4 mb-8">
          {slots.map((icon, index) => (
            <div
              key={index}
              className="w-32 h-32 border-4 border-[#ff00ff] rounded-lg bg-white flex items-center justify-center overflow-hidden"
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
          <p className="mb-4 text-pink-500 text-lg">Rules: Spin the Wheel once a day to win! This weeks winners get a Pink Croptop!</p>
          <button
            onClick={spinWheel}
            disabled={isSpinning || !canPlay}
            className="px-8 py-4 bg-pink-500 text-white rounded-full text-xl font-bold hover:bg-pink-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {isSpinning ? 'Spinning...' : canPlay ? 'SPIN!' : 'Wait 23h'}
          </button>
          {!canPlay && !isSpinning && (
            <p className="mt-2 text-pink-500">{getTimeRemaining()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WonderWheel;