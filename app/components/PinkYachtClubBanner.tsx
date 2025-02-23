import React from 'react';

const PinkYachtClubBanner = () => {
  return (
    <div className="bg-[#fff6f9] p-6 rounded-lg shadow-sm mb-4">
      {/* Title */}
      <h3 className="font-semibold text-2xl text-[#ff47b0] text-center mb-4">
        Pink Yacht Club Vibes
      </h3>
      
      {/* Desktop version - 4 images side by side */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-chill.png" 
            alt="Beach Chill Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-bar.png" 
            alt="Beach Bar Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-loungers.png" 
            alt="Beach Loungers Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-restaurant.png" 
            alt="Beach Restaurant Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      
      {/* Mobile version - 2x2 grid */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-chill.png" 
            alt="Beach Chill Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-bar.png" 
            alt="Beach Bar Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-loungers.png" 
            alt="Beach Loungers Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="/icons/vibes/beach-restaurant.png" 
            alt="Beach Restaurant Vibes" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      <p className="text-[#ff47b0] text-center mt-6 italic">
      Pack your coziest beach vibes ✨ Pink Yacht Club wraps you in a dreamy blend of sun-warmed hibiscus, lychee kisses, and sweet-as-sunset notes of peach and vanilla. It's like that perfect beachy moment when you're wrapped in the softest towel, watching the waves roll in 🌊
      </p>
    </div>
  );
};

export default PinkYachtClubBanner;