import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Car,
  Compass,
  LifeBuoy,
  CheckCircle,
  PhoneCall,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TipCard {
  id: string;
  category: 'Personal' | 'Online' | 'Travel' | 'Public' | 'Emergency';
  title: string;
  summary: string;
  tips: string[];
}

const SAFETY_TIPS: TipCard[] = [
  {
    id: 'personal-1',
    category: 'Personal',
    title: 'Situational Awareness & Confidence',
    summary: 'Trusting your intuition and projecting confident body language in everyday environments.',
    tips: [
      'Walk with upright posture, head up, and purposeful stride. Make brief, neutral eye contact with people around you.',
      'Trust your gut instinct: If a person, venue, or situation feels uncomfortable, exit immediately without worrying about politeness.',
      'Keep one ear free when walking with headphones, especially at dusk or along quiet streets.',
      'Have your keys or emergency device ready in your hand before approaching your vehicle or doorstep.',
    ],
  },
  {
    id: 'online-1',
    category: 'Online',
    title: 'Digital Privacy & Social Footprint',
    summary: 'Shielding your physical location and sensitive information across social networks and dating apps.',
    tips: [
      'Disable automatic geolocation tags on public photo posts (Instagram, Twitter, TikTok) until after you have left the venue.',
      'When meeting someone from an app, always choose a well-lit public cafe and tell a trusted contact where you are going.',
      'Use strong two-factor authentication (2FA) and avoid sharing your primary residential address on public profiles.',
      'Regularly review app permissions on your phone to see which utilities can track your background location.',
    ],
  },
  {
    id: 'travel-1',
    category: 'Travel',
    title: 'Commuting & Ride-Share Guidelines',
    summary: 'Proactive checks for cabs, public transit, and late-night commuting.',
    tips: [
      'Before entering any ride-share (Uber, Lyft, or taxi), ask: "Who are you picking up?" and verify the license plate matches your app.',
      'Share your trip progress in real-time with an emergency contact or family member via SafeHer or your ride-share app.',
      'On public buses and trains, sit near the driver, conductor, or in carriages with fellow passengers rather than isolated cabins.',
      'Keep your phone battery above 30% before traveling, or carry a small portable power bank.',
    ],
  },
  {
    id: 'public-1',
    category: 'Public',
    title: 'Public-Place & Campus Safety',
    summary: 'Navigating college campuses, parking structures, and nightlife safely.',
    tips: [
      'Familiarize yourself with campus blue-light emergency phones, security booths, and well-lit walking paths.',
      'Park in well-lit areas near building entrances rather than distant shadowy corners.',
      'Never leave beverages unattended at social gatherings; accept drinks only directly from the bartender or host.',
      'If you feel followed, head toward a bustling store, convenience shop, or security guard and ask for assistance.',
    ],
  },
  {
    id: 'emergency-1',
    category: 'Emergency',
    title: 'Emergency Preparedness & Response',
    summary: 'Equipping yourself with contingency plans and rapid access to assistance.',
    tips: [
      'Program emergency contact shortcuts on your smartphone (speed dial and emergency lock screen access).',
      'Learn universal emergency gestures and distress phrases to discreetly alert bystanders.',
      'Keep local emergency helpline numbers memorized (112, 911, or regional women helplines).',
      'Test your SafeHer SOS button periodically in demo mode so you are comfortable with how it works during stress.',
    ],
  },
];

export const SafetyTipsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('personal-1');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'check-1': true,
    'check-2': false,
    'check-3': true,
    'check-4': false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTips = selectedCategory === 'All'
    ? SAFETY_TIPS
    : SAFETY_TIPS.filter((t) => t.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Safety Knowledge Base</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical Safety Tips & Preparedness
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Empowering, practical, and non-alarmist advice to help you stay confident, prepared, and secure in any environment.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['All', 'Personal', 'Online', 'Travel', 'Public', 'Emergency'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'All Guides' : `${cat} Safety`}
          </button>
        ))}
      </div>

      {/* Grid of Tip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTips.map((tip) => {
          const isExpanded = expandedId === tip.id;
          return (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                    {tip.category} Safety
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">{tip.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{tip.summary}</p>

                {isExpanded && (
                  <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    {tip.tips.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : tip.id)}
                  className="font-semibold text-rose-600 hover:text-rose-700 text-[11px]"
                >
                  {isExpanded ? 'Collapse Tips' : 'Read Full Checklist'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Quick Going-Out Checklist */}
      <div className="bg-gradient-to-r from-rose-50/70 via-white to-amber-50/60 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Interactive Safety Checklist</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Pre-Departure Safety Checklist</h3>
          <p className="text-xs text-slate-500">Tick off items before traveling late or venturing to unfamiliar locations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist['check-1']}
              onChange={() => toggleCheck('check-1')}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <span className="text-slate-800">Phone charged above 50% or power bank packed</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist['check-2']}
              onChange={() => toggleCheck('check-2')}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <span className="text-slate-800">At least 2 active Emergency Contacts in SafeHer</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist['check-3']}
              onChange={() => toggleCheck('check-3')}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <span className="text-slate-800">Destination address and transport route verified</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist['check-4']}
              onChange={() => toggleCheck('check-4')}
              className="w-4 h-4 accent-rose-600 rounded"
            />
            <span className="text-slate-800">Shared estimated arrival time with friend or family</span>
          </label>
        </div>
      </div>
    </div>
  );
};
