import React from 'react';
import { Wind, Layers, Award, Heart, Feather } from 'lucide-react';

export const TechInfo: React.FC = () => {
  const technologies = [
    {
      icon: <Award className="w-5 h-5 text-[#194983]" />,
      title: "100% Eco-Friendly Rubberized Coir",
      benefit: "Exceptional Spine Alignment",
      description: "Manufactured by curling natural coconut coir and bonding with natural rubber latex. Provides resilient orthopedic support that prevents spine and pelvic sagging.",
      bullets: ["100% natural, biodegradable fibers", "High tensile anti-sagging support", "Superior natural air breathability"]
    },
    {
      icon: <Award className="w-5 h-5 text-[#4A90E2]" />,
      title: "Canadian Springwall Technology",
      benefit: "International Posture Standards",
      description: "Hayleys holds exclusive rights in Sri Lanka to manufacture and distribute Springwall Canadian mattresses, built to global orthopedic sleep standards.",
      bullets: ["Exclusive Canadian license", "Active posture correction", "Reinforced perimeter edge support"]
    },
    {
      icon: <Layers className="w-5 h-5 text-[#194983]" />,
      title: "Independently Encased Pocket Springs",
      benefit: "Zero Partner Disturbance",
      description: "Each steel spring is individually encased in breathable fabric pockets to compress independently, eliminating motion transfer across the bed.",
      bullets: ["Zero motion wave transmission", "3” Euro Top integration", "Micro-contour adaptation"]
    },
    {
      icon: <Heart className="w-5 h-5 text-emerald-600" />,
      title: "Perforated Natural Dunlop Latex",
      benefit: "Responsive Breathable Bounce",
      description: "Harvested from organic rubber trees and vulcanized with continuous ventilation pin-cores to induce air circulation and absorb body heat.",
      bullets: ["Hypoallergenic & dust-mite resistant", "Instant responsive push-back", "Perforated airflow cooling"]
    },
    {
      icon: <Wind className="w-5 h-5 text-[#4A90E2]" />,
      title: "Gel-Infused Visco Elastic Foam",
      benefit: "Soothing Heat Absorption",
      description: "Microscopic cooling gel beads infused inside body-contouring memory foam alleviate pressure points around shoulders and hips while dissipating heat.",
      bullets: ["Eliminates pressure hotspots", "Continuous temperature regulation", "Deep joint pressure nesting"]
    },
    {
      icon: <Feather className="w-5 h-5 text-purple-600" />,
      title: "Convoluted Airflow Architecture",
      benefit: "Anti-Sweat Aeration Channels",
      description: "Precision peak-and-valley convoluted foam minimizes excessive sweating during sleep by generating continuous convective airflow channels.",
      bullets: ["Continuous thermal venting", "Point-elastic cushioning", "Durable rebonded core foundation"]
    }
  ];

  return (
    <section id="technology" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header detail */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#194983] uppercase tracking-widest block">
            HAYLEYS SLEEP SCIENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Craftsmanship & Materials
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Hayleys is Sri Lanka’s premier manufacturer uniting Spring, Rubberized Coir, and Foam Mattresses under one roof, backed by Canadian Springwall engineering.
          </p>
        </div>

        {/* Technology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.title}
              className="bg-white border border-slate-200 rounded-3xl p-7 premium-shadow premium-shadow-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#f0f6fc] border border-[#b8d7f5] flex items-center justify-center shadow-2xs">
                    {tech.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{tech.title}</h3>
                    <span className="text-[10px] text-[#194983] font-bold block mt-0.5 uppercase tracking-wide">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechInfo;
