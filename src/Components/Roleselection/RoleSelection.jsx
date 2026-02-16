import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
  { name: 'ADMIN', icon: '/admin-icon.png', route: '/admin-login' },
  { name: 'COORDINATOR', icon: '/coordinator-icon.png', route: '/coordinator-login' },
  { name: 'MENTOR', icon: '/mentor-icon.png', route: '/mentor-login' },
  { name: 'TEAM', icon: '/team-login', route: '/team-login' }, // Link to team login
];

const RoleSelection = () => {
  const navigate = useNavigate();
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex flex-col items-center justify-center text-white px-4">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-600/10 to-transparent"></div>
      
      {/* Interactive mouse-following gradient */}
      <div 
        className="absolute inset-0 opacity-25 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.2), transparent 40%)`
        }}
      ></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
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
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        
        {/* Logo/Brand Section */}
        <div className={`mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6 shadow-2xl shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>

        {/* Main heading */}
        <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 bg-clip-text text-transparent drop-shadow-2xl transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          Choose Your Role
        </h2>

        {/* Subtitle */}
        <p className={`text-xl md:text-2xl mb-12 text-blue-200 font-light max-w-2xl mx-auto leading-relaxed transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '400ms' }}>
          Select your role to access your personalized dashboard
        </p>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <div
              key={index}
              onClick={() => navigate(role.route)}
              className={`group relative cursor-pointer backdrop-blur-sm bg-blue-500/10 border border-blue-300/20 hover:border-blue-300/40 rounded-2xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 flex flex-col items-center justify-center p-8 w-full h-52 transition-all duration-300 hover:scale-105 overflow-hidden transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${600 + index * 150}ms` }}
            >
              {/* Card background animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <img
                      src={role.icon}
                      alt={role.name}
                      className="h-12 w-12 object-contain filter brightness-0 invert"
                      onError={(e) => {
                        // Fallback to default icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    {/* Fallback icon */}
                    <svg 
                      className="h-12 w-12 text-white hidden" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  {/* Floating accent */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
                </div>

                {/* Role name */}
                <span className="text-xl font-bold text-blue-100 group-hover:text-white transition-colors duration-300 tracking-wider">
                  {role.name}
                </span>

                {/* Hover indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <span>Click to continue</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role-specific accent color */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
                index === 0 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                'bg-gradient-to-r from-orange-500 to-orange-600'
              } opacity-0 group-hover:opacity-100`}></div>
            </div>
          ))}
        </div>

        {/* Bottom help text */}
        <div className={`mt-12 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '1200ms' }}>
          <p className="text-blue-300 text-sm max-w-md mx-auto">
            Need help choosing? Contact your administrator for role assignment guidance.
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default RoleSelection;