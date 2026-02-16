import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
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

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-600/10 to-transparent"></div>
      
      {/* Interactive mouse-following gradient */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.2), transparent 40%)`
        }}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className={`text-center text-white max-w-4xl transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-2xl shadow-blue-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>

          {/* Main heading with gradient text */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 bg-clip-text text-transparent drop-shadow-2xl">
            ProManage
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-4 text-blue-200 font-light max-w-3xl mx-auto leading-relaxed">
            Transform your team's workflow with intelligent project management
          </p>
          
          <p className="text-lg mb-12 text-blue-300 max-w-2xl mx-auto">
            Streamline collaboration, boost productivity, and deliver exceptional results with our cutting-edge platform.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/roleselection">
            <button 
              onClick={() => {
                // Replace with your navigation logic
                console.log('Navigate to role selection');
              }}
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-lg font-semibold text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-blue-300/30 hover:border-blue-300/50 rounded-2xl text-lg font-medium text-blue-200 hover:text-blue-100 hover:bg-blue-500/10 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Real-time collaboration' },
              { icon: '🎯', title: 'Smart Tracking', desc: 'AI-powered insights' },
              { icon: '🔒', title: 'Secure & Scalable', desc: 'Enterprise-grade security' }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-blue-300/20 hover:bg-blue-500/20 transition-all duration-300 transform hover:scale-105 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-blue-100">{feature.title}</h3>
                <p className="text-sm text-blue-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Home;