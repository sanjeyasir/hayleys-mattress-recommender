import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Camera, Layers, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: 1,
      icon: <UserCheck className="w-6 h-6 text-brand-700" />,
      title: "Stand Naturally",
      description: "Stand relaxed, facing the camera. Wear fitting clothing for the most precise contour calculation."
    },
    {
      id: 2,
      icon: <Camera className="w-6 h-6 text-brand-700" />,
      title: "Capture Your Body Profile",
      description: "Align your torso within the digital human silhouette guide and snap a snapshot of your standing posture."
    },
    {
      id: 3,
      icon: <Layers className="w-6 h-6 text-brand-700" />,
      title: "Analyze Support Levels",
      description: "Our OpenCV.js script calculates shoulder tilt, hip proportions, spine deviation, and maps pressure zones."
    },
    {
      id: 4,
      icon: <Award className="w-6 h-6 text-brand-700" />,
      title: "Get Match Recommendations",
      description: "Instantly receive a detailed compatibility report matching you with customized Hayleys Mattress models."
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
    <section id="how-it-works" className="bg-slate-50 py-24 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest block">HOW IT WORKS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Scientific Sleeping Analysis
          </h2>
          <p className="text-slate-600 font-light leading-relaxed">
            Our dual-stage matching process merges classical optical geometry with orthopedic sleep sciences. No AI assumptions—pure, explainable math.
          </p>
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
              className="bg-white rounded-3xl p-8 border border-slate-100 premium-shadow premium-shadow-hover relative flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="absolute top-6 right-6 text-6xl font-black text-brand-100/50 font-serif leading-none select-none">
                  0{step.id}
                </div>

                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-6 border border-brand-100">
                  {step.icon}
                </div>

                {/* Text Details */}
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
