import React, { useState, useEffect } from "react";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Paper, Stack, Button} from '@mui/material';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import "./AssessmentQuestions.css";
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


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


const AssessmentQuestions = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [firstT, setFirstT] = useState(0);
  const [secondT, setSecondT] = useState(0);
  const [thirdT, setThirdT] = useState(0);
  const [fourthT, setFourthT] = useState(0);

  const[world, setWorld] = useState([]);
  const[information, setInformation] = useState([]);
  const[decision, setDecision] = useState([]);
  const[structure, setStructure] = useState([]);

  const [isFading, setIsFading] = useState(false);
  const [displayQuestion, setDisplayQuestion] = useState("");

  useEffect(() => {
    setIsFading(true); 
    const timeout = setTimeout(() => {
      setDisplayQuestion(proceedAssessment()); 
      setIsFading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [qIndex]);

  var worldType = "";
  var informationType = "";
  var decisionType = "";
  var structureType = "";

  var worldPercent = 0;
  var informationPercent = 0;
  var decisionPercent = 0;
  var structurePercent = 0;

  var introversion = 0;
  var extroversion = 0;
  var sensing = 0;
  var intuition = 0;
  var thinking = 0;
  var feeling = 0;
  var judging = 0;
  var perceiving = 0;

  const worldQ = [
    "Do you enjoy large social gatherings?", // E
    "Do you prefer to work in a quiet environment?",
    "Are you comfortable being the center of attention?", // E
    "Do you prefer to work alone rather than in a team?",
    "Are you comfortable speaking in front of a large group of people?", // E
    "Do you enjoy spending time alone?",
    "Do you enjoy attending parties and social events?", // E
    "Do you prefer to spend time in a smaller group of friends?"
  ];

  const informationQ = [
    "Do you prefer dealing with concrete facts and details rather than abstract concepts?", // S
    "Do you often find yourself more interested in new possibilities than focusing on the details of the present?", // N
    "Do you enjoy activities that require paying attention to the present moment and immediate surroundings?", // S
    "Do you enjoy contemplating abstract concepts and theories?", // N
    "Do you trust your direct observations and experiences more than theories or ideas?", // S
    "Are you more drawn to innovative and creative solutions rather than relying solely on proven and established methods?", // N
    "Do you appreciate practical, realistic solutions to problems rather than theoretical or conceptual approaches?", // S
    "Do you tend to see the big picture and overarching patterns, rather than getting bogged down in specific details?" // N
  ];

  const decisionQ = [
    "Do you prefer to analyze and dissect situations?", // T
    "Do you prefer to empathize and understand others' feelings?", // F
    "Are you more focused on the logical and objective aspects of life?", // T
    "Do you prefer to consider the emotional and subjective aspects of life?", // F
    "Do you prefer to make decisions based on logical reasoning?", // T
    "Do you prefer to make decisions based on your emotions and feelings?", // F
    "Are you more comfortable with facts and data?", // T
    "Do you prefer to make decisions based on your intuition and feelings?" // F
  ];

  const structureQ = [
    "Do you prefer to be organized and structured?", // J
    "Do you prefer to be flexible and adaptable?", // P
    "Do you prefer to plan and schedule?", // J
    "Do you prefer to be unplanned and spontaneous?", // P
    "Do you prefer to be regulated and structured?", // J
    "Do you prefer to be easygoing and live and let live?", // P
    "Do you prefer to prepare and plan ahead?", // J
    "Do you prefer to go with the flow and adapt as you go?" // P
  ];

  var first = worldQ.length;
  var second = first + informationQ.length;
  var third = second + decisionQ.length;
  var fourth = third + structureQ.length;

  /*useEffect(() => {
    console.log("Updated Index:", qIndex);
    console.log("Updated First:", firstT);
  }, [qIndex,firstT]);*/

  function proceedAssessment() {
    if (qIndex < first) {
      return worldQ[qIndex];
    } else if (qIndex >= first && qIndex < second) {
      return informationQ[qIndex - first];
    } else if (qIndex >= second && qIndex < third) {
      return decisionQ[qIndex - second];
    } else if (qIndex >= third && qIndex < fourth) {
      return structureQ[qIndex - third];
    }
    return "";
  };

  function handleAnswer(value) {
    if (qIndex < fourth) {
      if (qIndex < first) {
        setWorld((prev) => [...prev, value]);
        setFirstT((prev) => prev + 1);
      } else if (qIndex >= first && qIndex < second) {
        setInformation((prev) => [...prev, value]);
        setSecondT((prev) => prev + 1);
      } else if (qIndex >= second && qIndex < third) {
        setDecision((prev) => [...prev, value]);
        setThirdT((prev) => prev + 1);
      } else if (qIndex >= third && qIndex < fourth) {
        setStructure((prev) => [...prev, value]);
        setFourthT((prev) => prev + 1);
      }
      setQIndex((prev) => prev + 1);
    } 
  };

  function handleBack() {
    if (qIndex > 0) {
      setQIndex((prev) => prev - 1);
      if (qIndex <= first) {
        setWorld((prev) => prev.slice(0, -1));
        setFirstT((prev) => prev - 1);
      } else if (qIndex > first && qIndex <= second) {
        setInformation((prev) => prev.slice(0, -1));
        setSecondT((prev) => prev - 1);
      } else if (qIndex > second && qIndex <= third) {
        setDecision((prev) => prev.slice(0, -1));
        setThirdT((prev) => prev - 1);
      } else if (qIndex > third && qIndex <= fourth) {
        setStructure((prev) => prev.slice(0, -1));
        setFourthT((prev) => prev - 1);
      }
    } else {
      navigate('/Disclaimer');
    }
  };

  function proceedResults() {
    extroversion = 0;
    introversion = 0;
    sensing = 0;
    intuition = 0;
    thinking = 0;
    feeling = 0;
    judging = 0;
    perceiving = 0;

    for(var i = 0; i < world.length; i++) {
      if(i % 2 === 0) {
        extroversion += world[i];
        sensing += information[i];
        thinking += decision[i];
        judging += structure[i];
      } else {
        introversion += world[i];
        intuition += information[i];
        feeling += decision[i];
        perceiving += structure[i];
      }
    }

    if(extroversion > introversion) {
      worldType = "E";
      worldPercent = (extroversion / (extroversion + introversion)) * 100;
    } else {
      introversion += 1;
      worldType = "I";
      worldPercent = (introversion / (introversion + extroversion)) * 100;
    }

    if(sensing > intuition) {
      informationType = "S";
      informationPercent = (sensing / (sensing + intuition)) * 100;
    } else {
      intuition += 1;
      informationType = "N";
      informationPercent = (intuition / (intuition + sensing)) * 100;
    }

    if(thinking > feeling) {
      decisionType = "T";
      decisionPercent = (thinking / (thinking + feeling)) * 100;
    } else {
      feeling += 1;
      decisionType = "F";
      decisionPercent = (feeling / (feeling + thinking)) * 100;
    }

    if(judging > perceiving) {
      structureType = "J";
      structurePercent = (judging / (judging + perceiving)) * 100;
    } else { 
      perceiving += 1;
      structureType = "P";
      structurePercent = (perceiving / (perceiving + judging)) * 100;
    }

    console.log("Extroversion:", extroversion);
    console.log("Introversion:", introversion);
    console.log("Sensing:", sensing);
    console.log("Intuition:", intuition);
    console.log("Thinking:", thinking);
    console.log("Feeling:", feeling);
    console.log("Judging:", judging);
    console.log("Perceiving:", perceiving);

    worldPercent = Math.round(worldPercent);
    informationPercent = Math.round(informationPercent);
    decisionPercent = Math.round(decisionPercent);
    structurePercent = Math.round(structurePercent);

    const data = {
      personalitySummary: worldType + informationType + decisionType + structureType,
      percentW: worldPercent,
      percentI: informationPercent,
      percentD: decisionPercent,
      percentS: structurePercent
    };

    saveData(data);

  }
  
  const saveData = async (data) => {
    try {
          await setDoc(doc(db, "Dataset", auth.currentUser.email.replace("@forgea.com", "")), data, { merge: true });
          navigate('/AssessmentResult');
        } catch (error) {
            console.log(error);
          return;
        }
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="assessment-top">
    <Paper elevation={24} className="assessment-questions-container">
        <div 
          className="back-button-container"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            variant="contained" 
            onClick={() => handleBack()} 
            className="back-button"
            sx={{
              backgroundColor: '#444444', // Custom background color
              '&:hover': {
                backgroundColor: '#333333', // Hover color
              },
              '&:active': {
                backgroundColor: '#222222', // Active color
              },
            }}
          >
          </Button>
        </div>
        {qIndex < 32 && (
          <div 
            className={`question-number ${isFading ? 'fade-out' : ''}`}
            style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
            {(qIndex + 1)} of {worldQ.length + informationQ.length + decisionQ.length + structureQ.length}
            
          </div>
        )}
        {qIndex >= 32 && (
          <div className="question-number">
            Finished Assessment
          </div>
        )}
        <div className="gauge-container">
          <Stack direction={{ xs: 'row', md: 'row' }} spacing={{}}>
            <Gauge
              width={100}
              height={100}
              value={(firstT / 8) * 100}
              text={""}
              sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: { fill: "#F8F1AD" }
              })}
            />
            <Gauge
              width={100}
              height={100}
              value={(secondT / 8) * 100}
              text={""}
              sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: { fill: "#EDACA3" }
              })}
            />
            <Gauge
              width={100}
              height={100}
              value={(thirdT / 8) * 100}
              text={""}
              sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: { fill: "#E199C8" }
              })}
            />
            <Gauge
              width={100}
              height={100}
              value={(fourthT / 8) * 100}
              text={""}
              sx={(theme) => ({
                [`& .${gaugeClasses.valueArc}`]: { fill: "#B78FD6" }
              })}
            />
          </Stack>
        </div>
        <div className={`question ${isFading ? 'fade-out' : ''}`}>
          {qIndex < fourth && proceedAssessment()}
        </div>
        <div className="answers-container">
          {qIndex < 32 && (
            <div className="answers-top">
              {/* Left label for Agree */}
              <div className="button-container"></div>
              <div className="label-left">Agree</div>
              <div className="button-container"><div className="button-6-top"/></div>
              <div className="button-container"><div className="button-5-top"/></div>
              <div className="button-container"><div className="button-center-top"/></div>
              <div className="button-container"><div className="button-3-top"/></div>
              <div className="button-container"><div className="button-2-top"/></div>
              {/* Right label for Disagree */}
              <div className="label-right">Disagree</div>
              <div className="button-container"></div>
            </div>
          )}
          {qIndex < 32 && (
            <div className="answers">
              {/* Left label for Agree */}
              <div className="label-left"> </div>
              {/* Leftmost button (largest) */}
              <div className="button-container">
                <button onClick={() => handleAnswer(7)} className="button-7"></button>
              </div>
              {/* Second button */}
              <div className="button-container">
                <button onClick={() => handleAnswer(6)} className="button-6"></button>
              </div>
              {/* Third button */}
              <div className="button-container">
                <button onClick={() => handleAnswer(5)} className="button-5"></button>
              </div>
              {/* Center button (smallest) */}
              <div className="button-container">
                <button onClick={() => handleAnswer(4)} className="button-center"></button>
              </div>
              {/* Fifth button */}
              <div className="button-container">
                <button onClick={() => handleAnswer(3)} className="button-3"></button>
              </div>
              {/* Sixth button */}
              <div className="button-container">
                <button onClick={() => handleAnswer(2)} className="button-2"></button>
              </div>
              {/* Rightmost button (largest) */}
              <div className="button-container">
                <button onClick={() => handleAnswer(1)} className="button-1"></button>
              </div>
              {/* Right label for Disagree */}
              <div className="label-right"> </div>
            </div>
          )}
          {qIndex >= 32 && (
            <Button variant="contained" color="success" onClick={() => proceedResults()} className="proceed-button">
              Proceed
            </Button>
          )}
        </div>
      </Paper>
    </div>
    </ThemeProvider>
  );
};

export default AssessmentQuestions;
