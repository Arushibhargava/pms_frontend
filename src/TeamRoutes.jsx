// TeamRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './Components/Team/DashboardLayout';
import Dashboard from './Components/Team/Dashboard';

import Notifications from './Components/Team/Notifications';
import Reports from './Components/Team/Reports';
import Task from './Components/Team/Task';
import AddTeamMember from './Components/Team/AddTeamMember';
import Weeklyprogress from './Components/Team/Weeklyprogress';
import Projectsubmission from './Components/Team/Projectsubmission';


const TeamRoutes = () => {
  return (
  
    <Routes>
        
     <Route path="/team" element={<DashboardLayout />}>
  <Route index element={<Dashboard />} />
  
  <Route path="tasks" element={<Task />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="reports" element={<Reports />} />
  <Route path="add-member" element={<AddTeamMember />} />
   <Route path="weeklyprogress" element={< Weeklyprogress/>} />
  
</Route>
    </Routes>
  );
};

export default TeamRoutes;
