import React, { useState, useEffect } from 'react';
//import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography, CircularProgress} from '@mui/material';
import './AssessmentResult.css'; // Import the CSS file
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSquares from '../Assets/LoadingSquares';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    success: {
      main: '#81c784'
    },
    error: {
      main: '#e57373'
    }
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function Blink({children}) {
  return(
    <motion.div
      initial={{ scale: 0.8, y:100 ,opacity: 1}}
      animate={{ scale: 1, y:0, opacity: 1}}
      transition={{
        duration: 0.4,
      }}
    >
      {children}
    </motion.div>
  )
}

function Transition1({children}) {
  return(
    <motion.div
      initial={{y:5 ,opacity: 0}}
      animate={{y:0, opacity: 1}}
      transition={{
        duration: 0.6,
        delay:0.6
      }}
    >
      {children}
    </motion.div>
  )
}

function Transition2({children}) {
  return(
    <motion.div
      initial={{y:5 ,opacity: 0}}
      animate={{y:0, opacity: 1}}
      transition={{
        duration: 0.6,
        delay:0.8
      }}
    >
      {children}
    </motion.div>
  )
}

function Transform({children}) {
  return(
    <motion.div
      initial={{opacity: 1}}
      animate={{opacity: 1}}
      transition={{
        duration: 0.4,
      }}
    >
      {children}
    </motion.div>
  )
}

const AssessmentResult = () => {
  const auth = getAuth();
  const [user, setUser] = useState({
    id: "",
    personalitySummary: "    ", // Default personality
    percentW: 0,
    percentI: 0,
    percentD: 0,
    percentS: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState("");

  const fetchUserData = async (currentUser) => {
    if(auth.currentUser != null) {
      try {
        const docRef = doc(db, "Dataset", currentUser.email.replace("@forgea.com", ""));
        const docSnap = await getDoc(docRef); // Await the asynchronous getDoc call
    
        if (docSnap.exists()) {
          const data = docSnap.data(); // Retrieve the document's data
          setUser({
            id: auth.currentUser.email,
            personalitySummary: data.personalitySummary || "",
            percentW: data.percentW || 0,
            percentI: data.percentI || 0,
            percentD: data.percentD || 0,
            percentS: data.percentS || 0,
          });
          setSelectedLetter(data.personalitySummary?.[0] || "");
          console.log("User data:", data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        alert("Error fetching data: " + error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2500);
        
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser);
      } else {
        console.log("No user is logged in");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth.currentUser]);

  // Trait descriptions
  const descriptions = {
    Extraversion: "Extroverts gain energy from social interaction and external activities.",
    Introversion: "Introverts recharge through solitude and internal reflection.",
    Sensing: "Sensors focus on facts, details, and the present moment.",
    Intuition: "Intuitives prioritize patterns, possibilities, and future potential.",
    Thinking: "Thinkers rely on logic and objective analysis for decisions.",
    Feeling: "Feelers consider values, emotions, and relationships in decision-making.",
    Judging: "Judgers prefer organization, structure, and clear plans.",
    Perceiving: "Perceivers value flexibility, spontaneity, and open-ended options.",
  };

  // Trait categories based on personality summary (ESFP)
  const traitCategories = {
    E: "Extraversion",
    I: "Introversion",
    S: "Sensing",
    N: "Intuition",
    T: "Thinking",
    F: "Feeling",
    J: "Judging",
    P: "Perceiving",
  };

  // Calculate dominant and inverse values based on the MBTI type and percentages
  const calculateTraits = (personalitySummary, percentW, percentI, percentD, percentS) => {
    let traitData = {};

    personalitySummary.split('').forEach(letter => {
      switch (letter) {
        case 'E': // Extraversion
          traitData.E = {
            dominant: 'Extraversion',
            inverse: 'Introversion',
            value: percentW,
            inverseValue: 100 - percentW,
          };
          break;
        case 'I': // Introversion
          traitData.I = {
            dominant: 'Introversion',
            inverse: 'Extraversion',
            value: percentI,
            inverseValue: 100 - percentI,
          };
          break;
        case 'S': // Sensing
          traitData.S = {
            dominant: 'Sensing',
            inverse: 'Intuition',
            value: percentI,
            inverseValue: 100 - percentI,
          };
          break;
        case 'N': // Intuition
          traitData.N = {
            dominant: 'Intuition',
            inverse: 'Sensing',
            value: percentI,
            inverseValue: 100 - percentI,
          };
          break;
        case 'T': // Thinking
          traitData.T = {
            dominant: 'Thinking',
            inverse: 'Feeling',
            value: percentD, // For this case, assume it matches D value
            inverseValue: 100 - percentD,
          };
          break;
        case 'F': // Feeling
          traitData.F = {
            dominant: 'Feeling',
            inverse: 'Thinking',
            value: percentD,
            inverseValue: 100 - percentD,
          };
          break;
        case 'J': // Judging
          traitData.J = {
            dominant: 'Judging',
            inverse: 'Perceiving',
            value: percentS,
            inverseValue: 100 - percentS,
          };
          break;
        case 'P': // Perceiving
          traitData.P = {
            dominant: 'Perceiving',
            inverse: 'Judging',
            value: percentS,
            inverseValue: 100 - percentS,
          };
          break;
        case ' ': // None
          traitData.P = {
            dominant: ' ',
            inverse: ' ',
            value: 0,
            inverseValue: 0,
          };
          break;
        default:
          break;
      }
    });
    return traitData;
  };

  // Calculate trait data based on the user's MBTI type and percentages
  const traitData = calculateTraits(user.personalitySummary, user.percentW, user.percentI, user.percentD, user.percentS);

  // Button colors for visual appeal
  const buttonColors = ['#F8F1AD', '#EDACA3', '#E199C8', '#B78FD6'];
  if (loading) {
    return (
    //<ThemeProvider theme={darkTheme}>
    //  <CssBaseline />
    //  <div className='assessment-resulttop'>
    //    <Paper className="assessment-container">
    //      <CircularProgress color="success" />
    //    </Paper>;
    //  </div>
    //</ThemeProvider>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AnimatePresence>
      <div className='assessment-transition'>
        <Paper elevation={1} style={{ boxShadow: 'none' }} className='container-loading'>
          <LoadingSquares/>
        </Paper>
      </div>
      </AnimatePresence>
    </ThemeProvider>
    )
  } else

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="assessment-resulttop">
    <Transform>
    <Paper elevation={24} className="assessment-container">
      {auth.currentUser != null && (<div>
        <Typography variant="h5" className="typographyHeaderAR">
                      Test Results
        </Typography>
        <h2 className="chart-title">Your Personality Type is:</h2>

        {/* Personality Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {user.personalitySummary.split('').map((letter, index) => (
            <Blink>
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              style={{
                backgroundColor: selectedLetter === letter ? 'transparent' : buttonColors[index % buttonColors.length],
                color: selectedLetter === letter ? buttonColors[index % buttonColors.length] : '#333',
                border: `6px solid ${buttonColors[index % buttonColors.length]}`,
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.6s ease',
                fontSize: '20px',
              }}
            >
              {letter}
            </button>
            </Blink>
          ))}
        </div>

        {/* Trait Descriptions */}
        
        <div style={{ marginBottom: '20px', textAlign: 'left', whiteSpace: 'pre-line' }}>
        <Transition1>
          <h3>{traitData[selectedLetter]?.dominant}: {traitData[selectedLetter]?.value}%</h3>
          <p>{descriptions[traitData[selectedLetter]?.dominant]}</p>
        </Transition1>
        <Transition2>
          <h4 style={{ color: '#999999' }}>Other Trait: {traitData[selectedLetter]?.inverse} ({traitData[selectedLetter]?.inverseValue}%)</h4>
          <p style={{ color: '#999999' }}>{descriptions[traitData[selectedLetter]?.inverse]}</p>
        </Transition2>
        </div>
        
        <p style={{ fontSize: '12px', color: '#999999', textAlign: 'center' }}>
          Please remember that these results are for informational purposes only and should not be considered as definitive or absolute.
        </p>
      </div>)}

      {auth.currentUser === null && (
        <div>
          <CircularProgress color="success" />
        </div>
      )}
    </Paper>
    </Transform>
    </div>
    </ThemeProvider>
  );
};

export default AssessmentResult;
