import React from 'react';
import { 
  Sliders, 
  Camera, 
  BedDouble, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles 
} from 'lucide-react';

interface HowItWorksProps {
  onOpenExplainer?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps = [
    {
      id: '01',
      icon: <Sliders className="w-6 h-6 text-[#194983]" />,
      title: "1. Tell Us How You Sleep",
      description: "Select your sleeping posture (Side, Back, or Stomach), whether you share your bed with a partner, and your desired comfort feel."
    },
    {
      id: '02',
      icon: <Camera className="w-6 h-6 text-[#194983]" />,
      title: "2. Quick Posture Check",
      description: "Use your camera for a private, contactless posture scan or select a quick body preset to calculate your optimal spinal support needs."
    },
    {
      id: '03',
      icon: <BedDouble className="w-6 h-6 text-[#194983]" />,
      title: "3. Get Your Perfect Match",
      description: "Receive your tailored Hayleys Mattress recommendation complete with mattress cross-sections, firmness level, and warranty details."
    }
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: "100% Private & In-Browser",
      desc: "All posture checks happen securely on your device without saving or uploading images."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#4A90E2]" />,
      title: "Tailored to Sri Lankan Sleep",
      desc: "Designed specifically for tropical climates with cooling fabrics, latex, and breathable coir."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#194983]" />,
      title: "Factory-Direct Assurance",
      desc: "Authentic Hayleys quality certified with Canadian Springwall standards and up to 10-year warranty."
    }
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#194983] uppercase tracking-widest block">
            SIMPLE & INTUITIVE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Finding your dream mattress is quick and effortless. Just 3 simple steps to restful, rejuvenating sleep.
          </p>
        </div>

        {/* 3 Simple Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 premium-shadow premium-shadow-hover relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0f6fc] flex items-center justify-center border border-[#b8d7f5]">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    {step.id}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
