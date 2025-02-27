import React, { useState, useEffect, createContext, useContext } from 'react';
import { X } from 'lucide-react';
import { generateClient } from "aws-amplify/api";

// Create the API client
const client = generateClient();

// Define TypeScript interfaces for API calls
interface SocialChallengeInput {
  tiktokLink: string;
  challengeType: string;
  pointsEarned: number;
}

interface PointsContextType {
  totalPoints: number;
  updatePoints: (points: number) => void;
}

// Points context for the whole challenges section
const PointsContext = createContext<PointsContextType>({
  totalPoints: 0,
  updatePoints: () => {}
});

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
  const { updatePoints } = useContext(PointsContext);
  const [tiktokLink, setTiktokLink] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to validate TikTok URL
  const validateTikTokUrl = (url: string) => {
    // Basic validation for TikTok URLs
    return url.includes('tiktok.com');
  };

  // Function to submit TikTok link and award points
  const handleSubmitTikTok = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!tiktokLink) {
      setError("Please enter your TikTok link");
      setLoading(false);
      return;
    }

    if (!validateTikTokUrl(tiktokLink)) {
      setError("Please enter a valid TikTok URL");
      setLoading(false);
      return;
    }

    try {
      // Store the submission in local storage temporarily
      // In a real app, you would replace this with your actual API call
      localStorage.setItem('socialChallengeSubmission', JSON.stringify({
        tiktokLink,
        timestamp: new Date().toISOString(),
        pointsEarned: 5
      }));

      // Your real API call would look something like this:
      // Uncomment when your API is ready:
      /*
      await client.graphql({
        query: `
          mutation UpdateUserPoints($points: Int!) {
            updateUserPoints(points: $points) {
              success
              totalPoints
            }
          }
        `,
        variables: {
          points: 5
        }
      });
      */

      // Update points in the UI (5 points for completing)
      updatePoints(5);
      setIsSubmitted(true);
      setTiktokLink("");
    } catch (err) {
      console.error("Error submitting social challenge:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#e6f8ff" }} className="relative rounded-2xl p-4 mx-4">
      <div className="relative z-10">
      <div className="flex justify-between items-center mb-2">
          <h3 style={{ color: "#00aeef" }} className="font-medium text-lg">
            Social Challenge
          </h3>
          <span style={{ color: "#00aeef" }} className="font-medium">+5 points</span>
        </div>
        <p style={{ color: "#00aeef", margin: 0 }}>
          ✨ CALLING ALL WONDER MAKERS! ✨

          POV: Your main character moment just dropped in cloud-soft blue 💙

          Join our #BlueWonderverse GRWM in Blue Challenge and win our limited edition Main Character hoodie!
          
          Here's the assignment:

          1. Create your Get Ready With Me in blue!!
          2. Post your creation on TikTok AND Wonder-society.com
          3. Tag @wonderverselab so we don't miss your texture journey
          4. Enter by Saturday, February 29, 2025

          The plushest hoodie is waiting for your cloud-soft self! Welcome to your comfort era ⭐
        </p>

        {!isSubmitted ? (
          <div className="mt-4">
            <form onSubmit={handleSubmitTikTok}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="url"
                    value={tiktokLink}
                    onChange={(e) => {
                      setTiktokLink(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your TikTok link"
                    className="w-full p-2 border rounded"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: "#00aeef" }}
                  className="px-4 py-2 text-white rounded"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: "rgba(0, 174, 239, 0.1)" }}>
            <p style={{ color: "#00aeef", fontWeight: "bold" }}>
              ✅ Thanks for participating! You've earned 5 points!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChallengesSection = () => {
  const [totalPoints, setTotalPoints] = useState(0);

  const updatePoints = (points: number) => {
    setTotalPoints(prev => prev + points);
    
    // Store the updated points in localStorage
    localStorage.setItem('userPoints', String(totalPoints + points));
  };

  // Load initial points when component mounts
  useEffect(() => {
    // Check for locally stored points first
    const storedPoints = localStorage.getItem('userPoints');
    if (storedPoints) {
      setTotalPoints(parseInt(storedPoints, 10));
    }

    // In a real app, you would fetch points from your API
    // Uncomment when your API is ready:
    /*
    const fetchUserPoints = async () => {
      try {
        const response = await client.graphql({
          query: `
            query GetUserPoints {
              getUserPoints {
                totalPoints
              }
            }
          `
        });
        
        if (response.data?.getUserPoints?.totalPoints) {
          setTotalPoints(response.data.getUserPoints.totalPoints);
          localStorage.setItem('userPoints', String(response.data.getUserPoints.totalPoints));
        }
      } catch (err) {
        console.error("Error fetching user points:", err);
      }
    };

    fetchUserPoints();
    */
  }, []);

  return (
    <PointsContext.Provider value={{ totalPoints, updatePoints }}>
      <div className="p-4">
        {/* Points Display */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 style={{ color: "#ff47b0" }} className="text-xl font-semibold">
              Total Points
            </h2>
            <div className="bg-pink-100 px-4 py-2 rounded-full">
              <span style={{ color: "#ff47b0" }} className="text-lg font-bold">{totalPoints}</span>
            </div>
          </div>
        </div>
        {/* Rewards Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 style={{ color: "#ff47b0" }} className="text-xl font-semibold mb-4">
            Rewards
          </h2>
          <div className="flex items-center justify-between p-3">
            <div>
              <h3 className="font-medium">Limited Edition Pink Yacht Club Parfum</h3>
              <p className="text-gray-600">50 points gets you the Pink Yacht Club!</p>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: "#ff47b0" }} className="font-medium">{totalPoints}/50 points</span>
              <button 
                style={{ backgroundColor: "#ff47b0" }}
                className="px-4 py-2 text-white rounded"
                disabled={totalPoints < 50}
              >
                {totalPoints >= 50 ? "Redeem" : "Earn More"}
              </button>
            </div>
          </div>
        </div>
        {/* Challenges Container */}
        <div className="bg-white rounded-lg shadow-lg p-4 overflow-hidden">
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
    </PointsContext.Provider>
  );
};

export default ChallengesSection;