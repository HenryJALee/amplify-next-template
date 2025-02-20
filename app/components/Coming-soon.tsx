import React from 'react';
import Image from 'next/image';

// Separate Product Announcement Component
const ProductAnnouncement = () => {
  return (
    <div className="bg-[#fff6f9] p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)] mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src="/icons/Pink-Star.png"
          alt="Pink Star"
          width={30}
          height={30}
        />
        <h3 className="text-2xl font-bold text-pink-500">
          Pink Yacht Club
        </h3>
        <span className="text-md bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
          Coming Soon
        </span>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center items-center">
          <Image
            src="/icons/coming-soon/pink-yacht-club.png"
            alt="Pink Yacht Club Preview"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col justify-center space-y-4 bg-[#FFF6F9] p-6 rounded-lg w-full">
          <p className="text-lg text-gray-800 font-medium">
            Get ready bestie - your new comfort-zone companion is about to drop! ✨ Think: cloud-soft luxury 
            meets quick-absorbing magic. The non-greasy formula actually increases skin's moisture with everyday use.
          </p>

          <div className="flex flex-wrap gap-3">
            <span className="bg-white px-3 py-1 rounded-full text-md text-pink-500 font-semibold border border-pink-300">
              10%+ Moisture Increase 
            </span>
            <span className="bg-white px-3 py-1 rounded-full text-md text-pink-500 font-semibold border border-pink-300">
              Fragrance Created in France
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate Experience Section Component
const ExperienceSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-pink-50 p-6 rounded-lg flex flex-col justify-center w-full">
          <h4 className="text-xl font-semibold text-pink-600 flex items-center gap-3 mb-3">
            <Image
              src="/icons/Pink-Star.png"
              alt="Pink Star"
              width={20}
              height={20}
            />
            The Experience
          </h4>
          <p className="text-pink-600 text-lg font-medium">
            Picture this: You&apos;re lounging at an exclusive beach club, surrounded by blooming hibiscus and 
            sunkissed bergamot. That&apos;s the vibe we&apos;ve bottled up just for you! You sip your lychee and blended peach dream mocktail while breathing in the fresh sea air✨
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src="/icons/coming-soon/umbrellas.png"
            alt="Beach Umbrellas"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
const ComingSoonBlock = () => {
  return (
    <div className="space-y-6">
      <ProductAnnouncement />
      <ExperienceSection />
    </div>
  );
};

export default ComingSoonBlock;