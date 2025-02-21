import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface Fortune {
  message: string;
  scent: string;
  season: string;
  zodiacAffinity: string;
}

export function DailyScentFortune() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  //const [lastCheckTime, setLastCheckTime] = useState<number | null>(null);
  const [canCheck, setCanCheck] = useState<boolean>(true);

  useEffect(() => {
    const storedTime = localStorage.getItem('lastFortuneCheck');
    if (storedTime) {
      const lastCheck = parseInt(storedTime);
      const now = new Date().getTime();
      const hoursSinceLastCheck = (now - lastCheck) / (1000 * 60 * 60);
      if (hoursSinceLastCheck < 23) {
        setCanCheck(false);
        //setLastCheckTime(lastCheck);
      } else {
        setCanCheck(true);
      }
    }
  }, []);

  const handleReveal = () => {
    if (!birthDate || !canCheck) return;
    
    const now = new Date().getTime();
    //setLastCheckTime(now);
    localStorage.setItem('lastFortuneCheck', now.toString());
    setCanCheck(false);

    // Get today's date to seed the random fortune
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Expanded fortune array with seasonal influences
    const fortunes: Fortune[] = [
      // Spring Fortunes (March-May)
      { message: "Your pioneering spirit is blossoming like spring flowers! Time for new beginnings! ✨", scent: "Jo Malone Wild Bluebell", season: "Spring", zodiacAffinity: "Fire" },
      { message: "Your natural charm and inner strength are especially magnetic today! ⚡", scent: "Byredo La Tulipe", season: "Spring", zodiacAffinity: "Earth" },
      { message: "Your adaptable nature calls - embrace the fresh start! 🌱", scent: "Acqua di Parma Fico di Amalfi", season: "Spring", zodiacAffinity: "Air" },
      { message: "Your bold creativity is in full bloom! 🌸", scent: "Diptyque Do Son", season: "Spring", zodiacAffinity: "Fire" },
      { message: "Your determined spirit attracts new opportunities! 🌿", scent: "Le Labo Bergamote 22", season: "Spring", zodiacAffinity: "Earth" },
      { message: "Your quick wit is as fresh as morning dew! 💫", scent: "Maison Francis Kurkdjian L'eau À la Rose", season: "Spring", zodiacAffinity: "Air" },
      { message: "You're radiating confidence and leadership! 🌟", scent: "Chloé Eau de Parfum", season: "Spring", zodiacAffinity: "Fire" },
      
      // Summer Fortunes (June-August)
      { message: "Your nurturing spirit is as bright as the summer sun! ☀️", scent: "Sol de Janeiro Cheirosa '62", season: "Summer", zodiacAffinity: "Water" },
      { message: "Your natural leadership is heating up! Time to shine! ✨", scent: "Tom Ford Soleil Blanc", season: "Summer", zodiacAffinity: "Fire" },
      { message: "Your attention to detail brings success like a warm breeze! 🌊", scent: "Replica Beach Walk", season: "Summer", zodiacAffinity: "Earth" },
      { message: "Your protective energy is as vibrant as a sunset! 🌅", scent: "Ellis Brooklyn Sun Fruit", season: "Summer", zodiacAffinity: "Water" },
      { message: "Your dramatic flair attracts abundance like flowers attract butterflies! 🦋", scent: "Skylar Pink Canyon", season: "Summer", zodiacAffinity: "Fire" },
      { message: "Your analytical mind illuminates your path! ⭐", scent: "Hermes Un Jardin Sur La Lagune", season: "Summer", zodiacAffinity: "Earth" },
      { message: "Your emotional depth radiates pure joy! 🌞", scent: "Clean Reserve Solar Bloom", season: "Summer", zodiacAffinity: "Water" },

      // Autumn Fortunes (September-November)
      { message: "Your diplomatic nature transforms like autumn leaves! 🍁", scent: "Maison Margiela By the Fireplace", season: "Autumn", zodiacAffinity: "Air" },
      { message: "Your passionate intensity brings mystery and magic today! 🔮", scent: "Tom Ford Tobacco Vanille", season: "Autumn", zodiacAffinity: "Water" },
      { message: "Your philosophical spirit runs as deep as ancient forests! 🌳", scent: "Replica Autumn Vibes", season: "Autumn", zodiacAffinity: "Fire" },
      { message: "Your balanced nature brings rich rewards! 🍂", scent: "Byredo Gypsy Water", season: "Autumn", zodiacAffinity: "Air" },
      { message: "Your transformative power is awakening! 🎭", scent: "Le Labo Santal 33", season: "Autumn", zodiacAffinity: "Water" },
      { message: "Your optimistic spirit calls you to adventure! 🗺️", scent: "Diptyque Tam Dao", season: "Autumn", zodiacAffinity: "Fire" },
      { message: "Your harmonious spirit shines like autumn gold! 🌠", scent: "D.S. & Durga I Don't Know What", season: "Autumn", zodiacAffinity: "Air" },

      // Winter Fortunes (December-February)
      { message: "Your disciplined spirit crystallizes like frost! ❄️", scent: "Maison Francis Kurkdjian Baccarat Rouge 540", season: "Winter", zodiacAffinity: "Earth" },
      { message: "Your innovative spirit shines like stars on snow! ⭐", scent: "Phlur Missing Person", season: "Winter", zodiacAffinity: "Air" },
      { message: "Your compassionate nature flows like a winter stream! 🌊", scent: "Byredo Bal d'Afrique", season: "Winter", zodiacAffinity: "Water" },
      { message: "Your practical wisdom guides your steps in the snow! ❄️", scent: "Frederic Malle Portrait of a Lady", season: "Winter", zodiacAffinity: "Earth" },
      { message: "Your visionary spirit pierces through winter mists! 🌫️", scent: "Kilian Angels' Share", season: "Winter", zodiacAffinity: "Air" },
      { message: "Your intuitive dreams are taking magical form! 🌙", scent: "Parfums de Marly Delina", season: "Winter", zodiacAffinity: "Water" },
      { message: "Your determined path glows like northern lights! 🌌", scent: "Creed Aventus For Her", season: "Winter", zodiacAffinity: "Earth" },
      
      // Additional Special Fortunes
      { message: "The universe is aligning perfectly for you! 🌟", scent: "Glossier You", season: "All", zodiacAffinity: "All" },
      { message: "Your aura is absolutely magnetic today! ✨", scent: "Pink Yacht Club", season: "All", zodiacAffinity: "All" }
    ];
    
    // Get current season
    const month = today.getMonth();
    let currentSeason = "";
    if (month >= 2 && month <= 4) currentSeason = "Spring";
    else if (month >= 5 && month <= 7) currentSeason = "Summer";
    else if (month >= 8 && month <= 10) currentSeason = "Autumn";
    else currentSeason = "Winter";

    // Filter fortunes by current season and special ones
    const seasonalFortunes = fortunes.filter(f => f.season === currentSeason || f.season === "All");
    
    // Use birthDate and day of year to pick a fortune
    const fortuneIndex = (parseInt(birthDate.replace(/-/g, '')) + dayOfYear) % seasonalFortunes.length;
    setFortune(seasonalFortunes[fortuneIndex]);
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-[#fff6f9] rounded-lg shadow-[0_0_10px_#ff00ff] p-8 mb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">
          <span className="text-amber-400">✨</span> Daily Scent Fortune <span className="text-amber-400">✨</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Enter your birthday to discover today&apos;s perfect scent match! Check back daily for new cosmic-inspired recommendations.
        </p>

        <div className="flex flex-col items-center justify-center">
          {canCheck ? (
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-4 border-4 border-[#ff00ff] rounded-lg text-center text-xl focus:outline-none"
                style={{ boxShadow: '0 0 10px #ff00ff' }}
              />
              <button
                onClick={handleReveal}
                disabled={!birthDate}
                className="w-full px-8 py-4 bg-pink-500 text-white rounded-full text-xl font-bold hover:bg-pink-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Star className="h-6 w-6" />
                Reveal Today&apos;s Fortune!
                <Star className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-pink-200 rounded-full py-4 px-8 inline-flex items-center gap-2">
                <Star className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">Come Back Tomorrow!</span>
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="text-pink-500 text-lg">
                Next reading available in 23 hours
              </p>
            </div>
          )}

          {fortune && (
            <div className="mt-8 w-full">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl text-pink-500 mb-4">{fortune.message}</h2>
                <p className="text-xl text-pink-600">
                  Today&apos;s Perfect Scent: ✨ {fortune.scent} ✨
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}