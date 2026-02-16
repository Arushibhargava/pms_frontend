// src/components/DashboardLayout.js
import React from 'react';

import { Outlet } from 'react-router-dom';
import Csidebar from './Csidebar';

const CdashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f0f0f7]">
      <Csidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CdashboardLayout;