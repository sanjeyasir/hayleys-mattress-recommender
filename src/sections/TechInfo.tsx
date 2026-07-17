import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Wind, Layers, Award, Heart } from 'lucide-react';

export const TechInfo: React.FC = () => {
  const technologies = [
    {
      icon: <Award className="w-5 h-5 text-gold-600" />,
      title: "Rubberized Coir Core",
      benefit: "Exceptional Spine Neutrality",
      description: "Made by curling organic coconut fibers and bonding them in natural rubber latex. Keeps the pelvis from sinking, correcting lumbosacral angles.",
      bullets: ["100% natural materials", "High tensile posture hold", "Extremely breathable profile"]
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      title: "Pocket Spring Array",
      benefit: "Zero Motion Transfer",
      description: "Individually nested springs wrapped in premium fabric. They compress independently, tailoring support directly to body curves and stopping partner disturbances.",
      bullets: ["Localized curve mapping", "Reduces micro-pressure zones", "Enhanced edge suspension"]
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      title: "Natural Dunlop Latex",
      benefit: "Buoyant Pressure Relief",
      description: "Harvested from organic rubber trees and vulcanized with a pincore layout. Offers quick responsive bounce, distributing weight evenly while maintaining high airflow.",
      bullets: ["Hypoallergenic & dust-mite proof", "Long-lasting resilience", "Eco-conscious sourcing"]
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
      title: "Visco-Elastic Foam",
      benefit: "Space-Grade Joint Comfort",
      description: "Visco foam that yields dynamically to heat and body weight. Adapts perfectly to the shoulder blades and hip joints to alleviate pressure spikes.",
      bullets: ["Distributes load evenly", "Minimizes muscle soreness", "Deep contour nesting"]
    },
    {
      icon: <Wind className="w-5 h-5 text-sky-500" />,
      title: "Active Thermal Mesh",
      benefit: "Premium Climate Control",
      description: "Engineered with 3D spacer border fabrics and Tencel fibers. Discharges body heat, maintaining the mattress core temperature 2°C cooler.",
      bullets: ["Disperses humidity", "Combats dust-mite reproduction", "Cool-to-the-touch sleep surface"]
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
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest block">SLEEP SCIENCE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Hayleys Sleep Technology
          </h2>
          <p className="text-slate-600 font-light leading-relaxed">
            Every mattress core is built on specialized material engineering designed to resolve back aches, improve deep sleep cycles, and control hot temperatures.
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
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              variants={cardVariants}
              className={`bg-white border border-slate-100 rounded-3xl p-8 premium-shadow premium-shadow-hover flex flex-col justify-between ${
                index >= 3 ? 'lg:col-span-1' : '' // standard positioning
              }`}
            >
              <div>
                {/* Header block */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-none">{tech.title}</h3>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1 tracking-wide uppercase">
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
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
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
