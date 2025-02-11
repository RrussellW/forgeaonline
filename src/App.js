import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginSignin from './Components/LoginSignin/LoginSignin';
import PITest from './Components/PersonalInformation/PITest';
import Intro from './Components/Disclaimer/Intro';
import AssessmentQuestions from './Components/Assessment/AssessmentQuestions';
import AssessmentResult from './Components/AssessmentResult/AssessmentResult';


function App() {
  return (
    <div className="App">
      <Routes> {/* Define routes for different pages */}
        <Route path="/signup" element={<LoginSignup />} /> {/* Route for Login/Signup page */}
        <Route path="/" element={<LoginSignin />} /> {/* Route for Sign In page */}
        <Route path="/PersonalInfo" element={<PITest />} />
        <Route path="/Disclaimer" element={<Intro />} />
        <Route path="/AssessmentQuestions" element={<AssessmentQuestions />} />
        <Route path="/AssessmentResult" element={<AssessmentResult />} /> {/* Add AssessmentResult route */}
      </Routes>
    </div>
  );
}

export default App;