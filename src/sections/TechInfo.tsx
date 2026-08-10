import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Layers, Award, Heart, Feather } from 'lucide-react';

export const TechInfo: React.FC = () => {
  const technologies = [
    {
      icon: <Award className="w-5 h-5 text-gold-600" />,
      title: "100% Eco-Friendly Rubberized Coir",
      benefit: "Exceptional Spine Neutrality",
      description: "Manufactured by curling natural coconut fibers and binding them in natural rubber latex. Machine-prepared for high durability, keeping the pelvis from sagging and correcting lumbosacral angles.",
      bullets: ["100% natural, biodegradable fibers", "High tensile anti-sagging support", "Superior natural breathability"]
    },
    {
      icon: <Award className="w-5 h-5 text-brand-600" />,
      title: "Canadian Springwall Technology",
      benefit: "Internationally Renowned Standards",
      description: "Hayleys holds exclusive rights in Sri Lanka to manufacture and distribute Springwall Canadian mattresses, built to international orthopaedic posture standards.",
      bullets: ["Exclusive Canadian license", "Active posture correction", "Engineered edge support"]
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      title: "Independently Encased Pocket Springs",
      benefit: "Zero Partner Disturbance",
      description: "Each barrel spring is individually nested in fabric pockets. Springs compress independently according to localized pressure, eliminating kinetic motion transfer across the bed.",
      bullets: ["Zero motion wave transmission", "3” Euro Top integration", "Micro-contour adaptation"]
    },
    {
      icon: <Heart className="w-5 h-5 text-emerald-600" />,
      title: "Perforated Natural Dunlop Latex",
      benefit: "Buoyant Pressure Relief",
      description: "Harvested from organic rubber trees and vulcanized with continuous pincore ventilation channels. Induces active air flow, absorbs body heat, and provides instant responsive bounce.",
      bullets: ["Naturally hypoallergenic & dust-mite proof", "Instant push-back response", "Perforated airflow cooling"]
    },
    {
      icon: <Wind className="w-5 h-5 text-sky-500" />,
      title: "Gel-Infused Visco Elastic Foam",
      benefit: "Revolutionary Heat Absorption",
      description: "Microscopic cooling gel beads infused inside body-contouring memory foam. Visco foam yields dynamically to body weight to alleviate pressure spikes while gel dissipates heat.",
      bullets: ["Eliminates pressure hotspots", "Continuous temperature regulation", "Deep shoulder & pelvic nesting"]
    },
    {
      icon: <Feather className="w-5 h-5 text-purple-500" />,
      title: "Convoluted Airflow Architecture",
      benefit: "Anti-Sweating Peak & Valley Foam",
      description: "Precision-sculpted convoluted foam minimizes excessive sweating during sleep by generating continuous convective airflow channels beneath the quilted cover.",
      bullets: ["Continuous thermal venting", "Point-elastic cushioning", "Durable rebonded core support"]
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' } as any
    }
  };

  return (
    <section id="technology" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header detail */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
            HAYLEYS SLEEP SCIENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Pioneering Material Engineering
          </h2>
          <p className="text-slate-600 font-light leading-relaxed">
            Hayleys is the only company in Sri Lanka to manufacture Spring, Rubberized Coir, and Foam Mattresses under one roof, backed by ISO and Canadian Springwall engineering.
          </p>
        </div>

        {/* Technology Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.title}
              variants={cardVariants}
              className="bg-white border border-slate-200 rounded-3xl p-8 premium-shadow premium-shadow-hover flex flex-col justify-between"
            >
              <div>
                {/* Header block */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{tech.title}</h3>
                    <span className="text-[10px] text-brand-600 font-bold block mt-0.5 uppercase tracking-wide">
                      {tech.benefit}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
                  {tech.description}
                </p>
              </div>

              {/* Bullet list benefits */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                {tech.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2 text-[11px] text-slate-600 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TechInfo;
