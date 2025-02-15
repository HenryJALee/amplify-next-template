import React from 'react';

const WonderSocietyButton = () => {
  const handleClick = () => {
    // Replace 'YOUR_GOOGLE_SHEETS_URL' with your actual Google Sheets URL
    window.open('YOUR_GOOGLE_SHEETS_URL', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="mt-6 px-6 py-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors duration-200 ease-in-out"
    >
      <span className="text-lg text-white">✨ Join the Wonder Society ✨</span>
    </button>
  );
};

export default WonderSocietyButton;