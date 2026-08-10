import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Camera, Layers, Award, Compass } from 'lucide-react';

interface HowItWorksProps {
  onOpenExplainer?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenExplainer }) => {
  const steps = [
    {
      id: 1,
      icon: <UserCheck className="w-6 h-6 text-brand-700" />,
      title: "1. Posture & Sleep Profile",
      description: "Select your preferred sleeping position (Back, Side, Stomach, Combo), weight range, and comfort priorities (cooling, motion isolation, pressure relief)."
    },
    {
      id: 2,
      icon: <Camera className="w-6 h-6 text-brand-700" />,
      title: "2. Optical Geometry Scan",
      description: "Stand upright in front of your camera or use the digital simulator. MediaPipe calculates shoulder tilt, hip width, and plumb-line spine deviation."
    },
    {
      id: 3,
      icon: <Layers className="w-6 h-6 text-brand-700" />,
      title: "3. 5-Zone Biomechanics",
      description: "The algorithm computes load percentages across cervical, thoracic, lumbar, pelvic, and lower limb contact zones to derive your Target Firmness Score (1–10)."
    },
    {
      id: 4,
      icon: <Award className="w-6 h-6 text-brand-700" />,
      title: "4. Hayleys Mattress Matching",
      description: "Every Hayleys Spring, Rubberized Coir, and Foam mattress is evaluated with explainable mathematical formulas to find your optimal ergonomic match."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' } as any 
    }
  };

  return (
    <section id="how-it-works" className="bg-slate-50 py-24 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">SCIENTIFIC METHODOLOGY</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            How The Hayleys SleepMatcher Works
          </h2>
          <p className="text-slate-600 font-light leading-relaxed">
            Our multi-stage diagnostic engine pairs client-side Computer Vision with orthopedic biomechanics. No guesswork—every recommendation is 100% mathematically derived.
          </p>

          {onOpenExplainer && (
            <div className="pt-2">
              <button
                onClick={onOpenExplainer}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 bg-white px-4 py-2 rounded-full border border-brand-200 shadow-2xs transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-brand-600" />
                Explore Detailed Algorithm Equations & Derivations →
              </button>
            </div>
          )}
        </div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={cardVariants}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 premium-shadow premium-shadow-hover relative flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="absolute top-6 right-6 text-5xl font-black text-slate-100 font-mono leading-none select-none">
                  0{step.id}
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-6 border border-brand-100">
                  {step.icon}
                </div>

                {/* Text Details */}
                <h3 className="text-base font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
