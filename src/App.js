import logo from './Components/Assets/forgeaLogo.png';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginSignin from './Components/LoginSignin/LoginSignin';
import PITest from './Components/PersonalInformation/PITest';
import Intro from './Components/Disclaimer/Intro';
import AssessmentQuestions from './Components/Assessment/AssessmentQuestions';
import AssessmentResult from './Components/AssessmentResult/AssessmentResult';
import SidePanel from './Components/Assets/SidePanel';
import { AnimatePresence } from 'framer-motion';


function App() {
  const location = useLocation();
  return (
    <div className="App">
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}> {/* Define routes for different pages */}
          <Route path="/signup" element={<LoginSignup currentPath={location.pathname}/>} /> {/* Route for Login/Signup page */}
          <Route path="/" element={<LoginSignin currentPath={location.pathname}/>} /> {/* Route for Sign In page */}
          <Route path="/PersonalInfo" element={<PITest />} />
          <Route path="/Disclaimer" element={<Intro />} />
          <Route path="/AssessmentQuestions" element={<AssessmentQuestions />} />
          <Route path="/AssessmentResult" element={<AssessmentResult />} /> {/* Add AssessmentResult route */}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;