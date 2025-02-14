import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SectionKey = 'welcome' | 'codeOfConduct' | 'privacy';

interface Section {
  title: string;
  content: string;
}

type Sections = {
  [K in SectionKey]: Section;
}

const FAQDropdown = () => {
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);

  const toggleSection = (section: SectionKey) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections: Sections = {
    welcome: {
      title: "✨ Welcome Message",
      content: `✨ Welcome to Your Wonderverse Journey! ✨

Hey Wonder Maker!

The fact that you're here reading this makes our hearts do a little happy dance! You're now part of something incredibly special - a community of texture-obsessed, joy-spreading magic makers who believe self-care should feel like the coziest hug.

As a Wonderverse Ambassador, you're more than just part of our community - you're part of our story. And we can't wait to see how you'll add your own special sparkle to it! Whether you're here to share your texture adventures, geek out about our science innovations, or spread some joy, you've found your comfort zone.

Your dashboard is like your personal wonder lab, where you can:
* Get first peeks at upcoming launches (we're terrible at keeping secrets from our besties!)
* Test out content to use on other plateforms and get constructive feedback (because your creativity is a superpower)
* Connect with fellow Wonder Makers (the coolest texture enthusiasts around)
* Track your impact (because every bit of magic you share matters)

Ready to make some wonder together? Let's go! ✨

With love and sparkles,
The Wonderverse Team`
    },
    codeOfConduct: {
      title: "⭐ Code of Conduct",
      content: `Wonderverse Ambassador Code of Conduct ⭐
Welcome to the Wonderverse Ambassador program! As a Wonder Maker, you're joining a special community dedicated to making self-care a journey of discovery and joy for everyone. This code of conduct outlines our expectations and guidelines to ensure our community remains a safe, inclusive, and positive spaceCreating a Safe Space ✨
Speaking of special community, we have zero tolerance for:
Bullying or harassment of any kind, online or offline
Discriminatory comments or behavior based on age, race, ethnicity, gender, sexual orientation, disability, appearance, or personal preferences
Exclusionary practices or clique formation
Negative comments about others' appearance, skin type, or self-care choices
Spreading harmful rumors or misinformation
Encouraging others to engage in harmful behavior
Content Creation Standards 💗
As a Wonderverse Ambassador, your content should:
Be authentic and true to your experience
Include appropriate content warnings when discussing sensitive topics
Respect intellectual property rights and properly credit others
Follow FTC guidelines for disclosure of gifted products or sponsored content
Maintain age-appropriate messaging aligned with our Gen Zalpha audience
Never make medical claims about products
Platform Engagement
Respond to comments and messages with kindness and respect
Use inclusive language that makes everyone feel welcome
Keep private conversations and personal information confidential
Report inappropriate behavior to your designated community manager
Support fellow ambassadors through engagement and collaboration
Maintain a positive, solution-focused approach to challenges
Brand Representation
Follow Wonderverse's brand guidelines and voice
Only share accurate product information and claims
Disclose your ambassador status clearly in relevant posts
Never speak negatively about other brands or competitors
Maintain professional boundaries with community members
Report any concerns about product safety or quality immediately
Privacy & Confidentiality
Protect the privacy of other community members
Keep ambassador-exclusive information confidential
Never share personal information about other members
Obtain permission before sharing others' content or stories
Use appropriate privacy settings on social media
Report any privacy breaches immediately
Consequences
Violations of this code may result in:
Written warning and guidance
Temporary suspension from ambassador activities
Immediate termination from the program
Removal from all Ambassador-related platforms and communities
Reporting Process
If you witness or experience violations of this code:
Document the incident with screenshots or relevant information
Contact your designated community manager immediately
Maintain confidentiality about the reporting process
Follow up if you need additional support or guidance
Ambassador Pledge
By accepting your role as a Wonderverse Ambassador, you commit to:
Creating a safe, inclusive space for self-care discovery
Supporting and uplifting fellow community members
Using your influence responsibly and thoughtfully
Being an advocate for positive community building
Representing Wonderverse's values in all interactions
Remember: Your actions help shape the Wonderverse community. Together, we're creating a space where everyone feels welcome to explore their perfect comfort zone. ⭐
Last Updated: February 2025 For questions or concerns, contact: [Community Manager Contact Information] this is my welcome message ✨ Welcome to Your Wonderverse Journey! ✨


`
    },
    privacy: {
      title: "🔒 Privacy Policy",
      content: `🔒 Wonderverse Privacy Policy
Last Updated: February 2025
Introduction
Welcome to Wonderverse! We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you participate in our Ambassador program.
Information We Collect
Personal Information:


Name and contact information
Email address
Shipping address
Social media handles
Profile pictures
Payment information (when applicable)

Usage Information:

Content engagement metrics
Ambassador activity data
Platform interaction history
Device information
IP addresses


How We Use Your Information


To manage your Ambassador account
To track and reward program participation
To process and ship products
To communicate program updates
To improve our services
To ensure platform security
To comply with legal obligations


Information Sharing
We may share your information with:


Service providers (shipping, payment processing)
Social media platforms (with your consent)
Legal authorities (when required by law)
Business partners (with your explicit consent)

We never sell your personal information to third parties.

Your Rights (CCPA & CPRA Compliance)
As a California resident, you have the right to:


Access your personal information
Delete your personal information
Correct inaccurate personal information
Opt-out of data sharing
Non-discrimination for exercising these rights
Limit use of sensitive personal information


Data Security
We implement appropriate technical and organizational measures to protect your personal information, including:


Encryption of sensitive data
Regular security assessments
Access controls
Secure data storage
Employee training


Children's Privacy
Our Ambassador program is not intended for individuals under 13 years of age. We do not knowingly collect personal information from children.
International Data Transfers
If we transfer your data internationally, we ensure appropriate safeguards are in place to protect your information.
Data Retention
We retain your information for as long as necessary to:


Maintain your Ambassador account
Comply with legal obligations
Resolve disputes
Enforce our agreements


Changes to This Policy
We may update this Privacy Policy periodically. We will notify you of any material changes via email or through our platform.
Contact Us
For privacy-related questions or to exercise your rights, contact us at:
[Contact Information]
Additional California Rights
California residents may also:


Request detailed information about personal information sharing
Opt-out of automated decision-making
Designate an authorized agent


Cookie Policy
We use cookies and similar technologies to:


Maintain session information
Analyze platform usage
Improve user experience
Ensure platform security

You can control cookie settings through your browser preferences.`
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {(Object.entries(sections) as [SectionKey, Section][]).map(([key, section]) => (
        <div key={key} className="border rounded-lg bg-white shadow-sm">
          <button
            onClick={() => toggleSection(key)}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-pink-50 transition-colors rounded-lg"
          >
            <span className="text-lg font-medium text-pink-600">{section.title}</span>
            {openSection === key ? (
              <ChevronUp className="text-pink-600" />
            ) : (
              <ChevronDown className="text-pink-600" />
            )}
          </button>
          
          {openSection === key && (
            <div className="px-6 py-4 border-t">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {section.content}
                </pre>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQDropdown;