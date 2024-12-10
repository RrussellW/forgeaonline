import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginSignin from './Components/LoginSignin/LoginSignin';


function App() {
  return (
    <div className="App">
      <Routes> {/* Define routes for different pages */}
        <Route path="/signup" element={<LoginSignup />} /> {/* Route for Login/Signup page */}
        <Route path="/" element={<LoginSignin />} /> {/* Route for Sign In page */}
      </Routes>
    </div>
  );
}

export default App;
