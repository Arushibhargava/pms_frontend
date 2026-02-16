import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const Features = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: <CheckCircle size={40} />,
      title: 'Task Management',
      desc: 'Effortlessly assign, track, and manage tasks with intelligent automation and real-time updates.',
      highlight: 'Smart Automation',
      stats: '99% completion rate'
    },
    {
      icon: <Users size={40} />,
      title: 'Team Collaboration',
      desc: 'Unite your team in a dynamic workspace with seamless communication and shared resources.',
      highlight: 'Real-time Sync',
      stats: '50+ integrations'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Progress Tracking',
      desc: 'Visualize success with advanced analytics and meet deadlines with predictive insights.',
      highlight: 'AI-Powered Analytics',
      stats: '10x faster delivery'
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card, index) => {
      card.dataset.index = index;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 px-6 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden"
    >
      {/* Background Elements - Same as Home */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-600/10 to-transparent"></div>

      {/* Grid Pattern Overlay - Same as Home */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Floating particles - Same as Home */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-300/30 rounded-full text-blue-200 text-sm font-medium mb-6">
            <Sparkles size={16} className="animate-pulse" />
            <span>Powerful Features</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 bg-clip-text text-transparent drop-shadow-2xl">
            Why Choose PMS?
          </h2>
          
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed font-light">
            Discover the tools that transform your project management experience with cutting-edge technology and intuitive design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card group relative transform transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-400/30 rounded-2xl blur-sm group-hover:blur-none transition-all duration-500"></div>
              
              <div className="relative backdrop-blur-xl bg-blue-900/50 border border-blue-300/30 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-105 group-hover:border-blue-300/50">
                
                {/* Floating Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-400/60 transition-all duration-300 group-hover:rotate-3">
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center animate-bounce">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <ArrowRight 
                      size={20} 
                      className="text-blue-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" 
                    />
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-blue-500/30 border border-blue-300/40 rounded-full text-blue-200 text-sm font-medium">
                    {feature.highlight}
                  </div>
                  
                  <p className="text-blue-200 leading-relaxed group-hover:text-blue-100 transition-colors duration-300">
                    {feature.desc}
                  </p>
                  
                  <div className="pt-4 border-t border-blue-400/30">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-300">{feature.stats}</span>
                      <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/40 rounded-lg text-blue-200 text-sm font-medium transition-all duration-300 hover:border-blue-300/60">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-gradient-to-r from-blue-500/20 to-blue-400/20 border border-blue-300/30 rounded-2xl backdrop-blur-sm">
            <div className="text-left sm:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to get started?</h3>
              <p className="text-blue-200">Join thousands of teams already using PMS</p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
      {/* Bottom gradient fade - Same as Home */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Features;