import React, { useState, useEffect } from 'react';

const Timeline = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const steps = [
    { 
      title: 'Sign Up and create your workspace',
      icon: '🚀',
      detail: 'Get started with your personalized workspace in seconds'
    },
    { 
      title: 'Add team members and define roles',
      icon: '👥',
      detail: 'Invite your team and set up permissions seamlessly'
    },
    { 
      title: 'Create projects and assign tasks',
      icon: '📋',
      detail: 'Organize work with intelligent task management'
    },
    { 
      title: 'Track progress and meet deadlines',
      icon: '🎯',
      detail: 'Monitor success with real-time analytics'
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 px-6">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-600/10 to-transparent"></div>
      
      {/* Interactive mouse-following gradient */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15), transparent 40%)`
        }}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main content */}
      <div className="relative z-10">
        <h2 className={`text-5xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 bg-clip-text text-transparent drop-shadow-2xl transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative backdrop-blur-sm bg-blue-500/10 border border-blue-300/20 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 overflow-hidden transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Card background animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              
              <div className="relative z-10">
                {/* Step number and icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                    <span className="text-xl font-bold text-white">{index + 1}</span>
                  </div>
                  <div className="text-3xl">{step.icon}</div>
                </div>

                {/* Step title */}
                <div className="text-xl font-semibold mb-3 text-blue-100 group-hover:text-white transition-colors duration-300">
                  Step {index + 1}
                </div>
                
                {/* Step description */}
                <p className="text-blue-200 text-lg mb-3 leading-relaxed group-hover:text-blue-100 transition-colors duration-300">
                  {step.title}
                </p>
                
                {/* Step detail */}
                <p className="text-blue-300 text-sm leading-relaxed group-hover:text-blue-200 transition-colors duration-300">
                  {step.detail}
                </p>

                {/* Progress indicator */}
                <div className="mt-6 flex items-center gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i <= index 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 w-8' 
                          : 'bg-blue-300/30 w-2'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className={`text-center mt-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '600ms' }}>
          <p className="text-xl text-blue-200 mb-6 max-w-2xl mx-auto">
            Ready to transform your workflow? Start your journey today.
          </p>
          <button className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-lg font-semibold text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative z-10 flex items-center gap-2">
              Get Started Now
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Timeline;