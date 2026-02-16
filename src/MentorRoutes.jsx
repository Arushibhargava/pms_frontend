import React from 'react'
import MdashboardLayout from './Components/Mentor/MdashboardLayout'
import Mdashboard from './Components/Mentor/Mdashboard'
import { Routes, Route } from 'react-router-dom';
import Mmarks from './Components/Mentor/Mmarks';
import Mtask from './Components/Mentor/Mtask';
import Mnotification from './Components/Mentor/Mnotification';
import Mreport from './Components/Mentor/Mreport';
const MentorRoutes = () => {
  return (
        <Routes>
        
     <Route path="/mentor" element={<MdashboardLayout />}>
  <Route index element={<Mdashboard />} />
  <Route path="marks" element={<Mmarks />} />
  <Route path="task" element={<Mtask />} />
  <Route path="notification" element={<Mnotification />} />
  <Route path="report" element={<Mreport />} />
  
</Route>
    </Routes>
  )
}

export default MentorRoutes
