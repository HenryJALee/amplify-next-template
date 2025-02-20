import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const ReferralChallenge = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentEmail) {
      setError("Please enter an email address");
      return;
    }

    if (!validateEmail(currentEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (emails.includes(currentEmail)) {
      setError("This email has already been added");
      return;
    }

    if (emails.length < 10) {
      const newEmails = [...emails, currentEmail];
      setEmails(newEmails);
      setCurrentEmail("");
    }
  };

  const removeEmail = (indexToRemove: number) => {
    const newEmails = emails.filter((_, i) => i !== indexToRemove);
    setEmails(newEmails);
  };

  return (
    <div style={{ backgroundColor: "#fff6f9" }} className="relative rounded-2xl p-4 mx-4 mb-4">
      <div className="relative z-10">
        <h3 style={{ color: "#ff47b0" }} className="font-medium text-lg mb-2">
          Referral Challenge
        </h3>
        <p style={{ color: "#ff47b0" }}>Refer 10 friends for a hoodie! 👕</p>

        <div className="mt-4">
          <form onSubmit={handleAddEmail}>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(e) => {
                    setCurrentEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter friend's email"
                  className="w-full p-2 border rounded"
                  disabled={emails.length >= 10}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
              </div>
              <button
                type="submit"
                style={{ backgroundColor: "#ff47b0" }}
                className="px-4 py-2 text-white rounded"
                disabled={emails.length >= 10}
              >
                Add
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg p-4 mt-4">
            <h4 style={{ color: "#ff47b0" }} className="text-sm font-medium mb-2">
              Referred Friends ({emails.length}/10)
            </h4>
            {emails.length === 0 ? (
              <p className="text-gray-500 text-sm">No emails added yet</p>
            ) : (
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-700">{email}</span>
                    <button
                      onClick={() => removeEmail(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: "#ff47b0" }} className="text-sm">
              Progress: {emails.length}/10
            </span>
          </div>
          <div style={{ backgroundColor: "rgba(255, 71, 176, 0.2)" }} className="h-2 rounded-full">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: "#ff47b0",
                width: `${(emails.length / 10) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Instead of CustomColorChallenge, we'll create two simple components:
const VideoChallenge = () => {
  return (
    <div style={{ backgroundColor: "#f9e6fb" }} className="relative rounded-2xl p-4 mx-4 mb-4">
      <div className="relative z-10">
        <h3 style={{ color: "#d683e8" }} className="font-medium text-lg mb-2">
          Video Challenge
        </h3>
        <div className="flex justify-between items-center">
          <p style={{ color: "#d683e8" }}>Create 5 product reviews! 🎥</p>
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
            NOT YET LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

const SocialChallenge = () => {
  return (
    <div style={{ backgroundColor: "#e6f8ff" }} className="relative rounded-2xl p-4 mx-4 mb-4">
      <div className="relative z-10">
        <h3 style={{ color: "#00aeef" }} className="font-medium text-lg mb-2">
          Social Challenge
        </h3>
        <div className="flex justify-between items-center">
          <p style={{ color: "#00aeef" }}>Share 3 posts with #Wonderverse! ✨</p>
          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
            NOT YET LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

const ChallengesSection = () => {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 style={{ color: "#ff47b0" }} className="text-xl font-semibold mb-4">
          Challenges
        </h2>
        <div className="space-y-6">
          <ReferralChallenge />
          <VideoChallenge />
          <SocialChallenge />
        </div>
      </div>
    </div>
  );
};

export default ChallengesSection;