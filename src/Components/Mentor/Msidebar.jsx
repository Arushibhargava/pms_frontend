import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, CheckSquare, Award, Bell, FileText, LogOut } from 'lucide-react';

const Msidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'My Team', icon: Users, path: '/mentor' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/mentor/task' },
    { id: 'marks', label: 'Marks', icon: Award, path: '/mentor/marks' },
    { id: 'notification', label: 'Notifications', icon: Bell, path: '/mentor/notification' },
    { id: 'report', label: 'Reports', icon: FileText, path: '/mentor/report' },
  ];

  return (
    <aside className="left-0 top-0 w-96 min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-500/10 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
      <div className="absolute top-24 left-0 w-28 h-28 bg-gradient-to-br from-blue-300/15 to-blue-400/10 rounded-full -translate-x-14 blur-lg"></div>
      <div className="absolute bottom-60 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-full translate-x-16 blur-lg"></div>
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-blue-500/5 rounded-full -translate-x-12 blur-md"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 p-8">
        {/* Logo and Team Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative group">
            <div onClick={() => navigate('/coord-profile')}   className="w-36 h-36 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full overflow-hidden mb-6 shadow-2xl shadow-blue-500/40 border-4 border-blue-300/30 group-hover:border-blue-300/50 transition-all duration-500 group-hover:shadow-blue-400/60 group-hover:scale-105">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl font-black text-white drop-shadow-2xl z-10">TP</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-4 border-blue-800 flex items-center justify-center shadow-xl shadow-green-500/30">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-widest bg-gradient-to-r from-blue-100 via-blue-200 to-blue-50 bg-clip-text text-transparent drop-shadow-lg mb-2">
            MENTOR
          </h2>
          <p className="text-blue-200/80 text-base font-medium">Management Dashboard</p>
        </div>

        {/* Navigation Links - Maintained your routing logic */}
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`group relative w-full flex items-center px-5 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-600/30 shadow-2xl shadow-blue-500/30 translate-x-3 border border-blue-400/40'
                        : 'hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-blue-600/15 hover:to-blue-500/20 hover:translate-x-2 border border-transparent hover:border-blue-400/30'
                    }`}
                  >
                    {/* Animated background shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/40' 
                          : 'bg-blue-500/20 group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/40'
                      }`}>
                        <IconComponent className="w-6 h-6 text-white" />
                        {isActive && (
                          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                        )}
                      </div>
                      <span className="font-semibold text-lg text-blue-100 group-hover:text-white transition-colors duration-300">
                        {item.label}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500 rounded-l-full shadow-lg shadow-blue-400/50"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Enhanced Stats Card */}
        <div className="mt-10 bg-gradient-to-br from-blue-500/25 via-blue-600/20 to-blue-700/25 backdrop-blur-lg rounded-3xl p-6 border border-blue-400/30 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-blue-100 font-bold text-lg">Team Status</p>
              <p className="text-blue-200/80 text-sm font-medium">3 members online</p>
            </div>
          </div>
          <div className="w-full bg-blue-800/40 rounded-full h-3 overflow-hidden shadow-inset">
            <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 h-3 rounded-full w-3/4 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Logout Section - Maintained your routing logic */}
      <div className="relative z-10 p-8">
        <button 
          onClick={() => navigate('/logout')} // Replace with your actual logout path
          className="group relative w-full flex items-center justify-center gap-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
              <LogOut className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-white font-bold">Logout</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-white/20 to-red-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>
        
        {/* Enhanced Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-blue-200/70 text-sm font-medium">© 2024 Mentor Panel</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-blue-300/60 text-xs">Version 2.1.0 • Online</p>
          </div>
        </div>
      </div>

      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent pointer-events-none"></div>
    </aside>
  );
};

export default Msidebar;