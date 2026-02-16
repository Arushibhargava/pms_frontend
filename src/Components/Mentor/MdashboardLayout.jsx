// src/components/DashboardLayout.js
import React from 'react';

import { Outlet } from 'react-router-dom';
import Msidebar from './Msidebar';

const MdashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f0f0f7]">
      <Msidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MdashboardLayout;
