import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginSignin from './Components/LoginSignin/LoginSignin';
import PITest from './Components/PersonalInformation/PITest';
import AssessmentQuestions from './Components/Assessment/AssessmentQuestions';


function App() {
  return (
    <div className="App">
      <Routes> {/* Define routes for different pages */}
        <Route path="/signup" element={<LoginSignup />} /> {/* Route for Login/Signup page */}
        <Route path="/" element={<LoginSignin />} /> {/* Route for Sign In page */}
        <Route path="/PersonalInfo" element={<PITest />} />
        <Route path="/AssessmentQuestions" element={<AssessmentQuestions />} />
      </Routes>
    </div>
  );
}

export default App;