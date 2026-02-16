import React from 'react'
import MdashboardLayout from './Components/Mentor/MdashboardLayout'
import Mdashboard from './Components/Mentor/Mdashboard'
import { Routes, Route } from 'react-router-dom';
import CdashboardLayout from './Components/Coordinator/CdashboardLayout';
import Cdashboard from './Components/Coordinator/Cdashboard';
import Cmarks from './Components/Coordinator/Cmarks';
import Cnotification from './Components/Coordinator/Cnotification';
import Creport from './Components/Coordinator/Creport';
import Cprojectproposals from './Components/Coordinator/Cprojectproposals';
const CoordinatorRoutes = () => {
  return (
        <Routes>
        
     <Route path="/coordinator" element={<CdashboardLayout />}>
  <Route index element={<Cdashboard />} />
  
  <Route path="marks" element={<Cmarks />} />
  <Route path="notification" element={<Cnotification />} />
  <Route path="report" element={<Creport />} />
  <Route path="cproposals" element={<Cprojectproposals />} />
  
</Route>
    </Routes>
  )
}

export default CoordinatorRoutes