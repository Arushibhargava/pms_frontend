import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import LandingPage from './pages/LandingPage'; // combined page with Header, Home, About, etc.
import TeamSignup from './Components/Login/TeamSignup';
import TeamLogin from './Components/Login/TeamLogin';
import SignupSuccess from './Components/Login/SignupSuccess';

import Dashboard from './Components/Team/Dashboard';

import DashboardLayout from './Components/Team/DashboardLayout';
import TeamRoutes from './TeamRoutes';
import Mentorsignup from './Components/Login/Mentorsignup';
import MentorLogin from './Components/Login/MentorLogin';
import MentorRoutes from './MentorRoutes';
import CoordinatorSignup from './Components/Login/CoordinatorSignup';
import CoordinatorLogin from './Components/Login/CoordinatorLogin';
import CoordinatorRoutes from './CoordinatorRoutes';
import RoleSelection from './Components/Roleselection/RoleSelection';
import Logout from './Logout/Logout';
import Mweeklyprogress from './Components/Mentor/Mweeklyprogress';
import Projectsubmission from './Components/Team/Projectsubmission';
import Profile from './Components/Team/Profile';
import Cprofile from './Components/Coordinator/Cprofile';
function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
    <CoordinatorRoutes/>
     <MentorRoutes/>
     <TeamRoutes /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roleselection" element={<RoleSelection />} />
        <Route path="/team-login" element={<TeamLogin />} />
        <Route path="/team-signup" element={<TeamSignup />} />
        <Route path="/mentor-signup" element={<Mentorsignup />} />
        <Route path="/mentor-login" element={<MentorLogin />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        <Route path="/coordinator-signup" element={<CoordinatorSignup />} />
        <Route path="/coordinator-login" element={<CoordinatorLogin/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/mweekly" element={<Mweeklyprogress/>} />
        <Route path="/team-projectsubmisson" element={<Projectsubmission/>} />
        <Route path="/team-profile" element={<Profile/>} />
         <Route path="/coord-profile" element={<Cprofile/>} />
        
      </Routes>
    </>
  );
}

export default App;
