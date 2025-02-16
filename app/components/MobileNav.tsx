import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import WONDERLOGO_UPDATED from '../../public/icons/Wonderverse-logo-update.png';

// Define the types for the props
interface MobileNavProps {
  activeSection: 'home' | 'community' | 'messages' | 'profile' | 'game';
  setActiveSection: (section: 'home' | 'community' | 'messages' | 'profile' | 'game') => void;
  userData: {
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  ambassador: {
    name: string;
    tier: string;
  };
  profileImage: string | null;
  handleSignOut: () => void;
  setShowVideoUploader: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNav: React.FC<MobileNavProps> = ({
  activeSection,
  setActiveSection,
  userData,
  ambassador,
  profileImage,
  handleSignOut,
  setShowVideoUploader
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="lg:hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <Image 
            src={WONDERLOGO_UPDATED}
            alt="Wonder Logo"
            width={120}
            height={32}
            priority
          />
          <button
            onClick={toggleMenu}
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        pt-16 pb-6 px-4
      `}>
        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-6 p-4 bg-pink-50 rounded-lg">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-pink-200 flex items-center justify-center">
                <span className="text-pink-500 text-xl">
                  {userData?.username?.[0]?.toUpperCase() || 'W'}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-bold">{userData?.username || ambassador.name}</h2>
            <p className="text-sm text-gray-500">{ambassador.tier}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {[
            { icon: "⭐", label: 'Dashboard', key: 'home' },
            { icon: "💫", label: 'Community', key: 'community' },
            { icon: "✨", label: 'Updates', key: 'messages' },
            { icon: "🌟", label: 'Profile', key: 'profile' },
            { icon: "⚡", label: 'Game', key: 'game' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveSection(item.key as typeof activeSection);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 p-4 rounded-lg transition
                ${activeSection === item.key 
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-700 hover:bg-pink-50'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Add Content Button */}
          <button
            onClick={() => {
              setShowVideoUploader(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 p-4 rounded-lg
              bg-pink-50 text-pink-500 hover:bg-pink-100"
          >
            <span>+</span>
            <span>Add Content</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-4 rounded-lg
              text-red-600 hover:bg-red-50 mt-4"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;