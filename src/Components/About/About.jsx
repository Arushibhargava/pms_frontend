import React , { useState, useEffect } from 'react';

const About = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col items-center justify-center px-6"
    >
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.2), transparent 40%)`
        }}
      ></div>
      {/* Background Elements - Same as Home */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-600/10 to-transparent"></div>
      
      {/* Grid Pattern Overlay - Same as Home */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Floating particles - Same as Home */}
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

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 bg-clip-text text-transparent drop-shadow-2xl">
          About This Project
        </h2>
        
        <p className="text-xl md:text-2xl mb-4 text-blue-200 font-light leading-relaxed">
          We built this Project Management System to simplify task coordination, enhance collaboration, and boost productivity. Whether you're a student working on group assignments, a team managing complex projects, or a manager overseeing deadlines—this tool is designed for you.
        </p>
        
        <p className="text-lg mb-12 text-blue-300 leading-relaxed">
          It solves the chaos of miscommunication and missed deadlines by offering a centralized platform where you can track progress, assign tasks, and ensure everyone stays on the same page.
        </p>
      </div>

      {/* Bottom gradient fade - Same as Home */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default About;