import React, { useState } from "react";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Stack, Button } from '@mui/material';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import "./AssessmentQuestions.css";
import { useNavigate } from 'react-router-dom';

const AssessmentQuestionsOld = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [world, setWorld] = useState(Array(8).fill(0));
  const [information, setInformation] = useState(Array(8).fill(0));
  const [decision, setDecision] = useState(Array(8).fill(0));
  const [structure, setStructure] = useState(Array(8).fill(0));
  const [introversion, setIntroversion] = useState(0);
  const [extroversion, setExtroversion] = useState(0);
  const [sensing, setSensing] = useState(0);
  const [intuition, setIntuition] = useState(0);
  const [thinking, setThinking] = useState(0);
  const [feeling, setFeeling] = useState(0);
  const [judging, setJudging] = useState(0);
  const [perceiving, setPerceiving] = useState(0);
  const [summary, setSummary] = useState("");

  const [percentW, setPercentW] = useState(0);
  const [percentI, setPercentI] = useState(0);
  const [percentD, setPercentD] = useState(0);
  const [percentS, setPercentS] = useState(0);

  const [firstT, setFirstT] = useState(0);
  const [secondT, setSecondT] = useState(0);
  const [thirdT, setThirdT] = useState(0);
  const [fourthT, setFourthT] = useState(0);

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

  const first = worldQ.length;
  const second = first + informationQ.length;
  const third = second + decisionQ.length;
  const fourth = third + structureQ.length;

  const proceedAssessment = () => {
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

  const proceedResults = async () => {
    console.log("Introversion:", introversion);
    console.log("Extroversion:", extroversion);
    console.log("Sensing:", sensing);
    console.log("Intuition:", intuition);
    console.log("Thinking:", thinking);
    console.log("Feeling:", feeling);
    console.log("Judging:", judging);
    console.log("Perceiving:", perceiving);

    const data = {
      personalitySummary: summary,
      percentW: percentW,
      percentI: percentI,
      percentD: percentD,
      percentS: percentS,
    };

    console.log("Data:", data);

    try {
      await setDoc(doc(db, "Dataset", auth.currentUser.email), data, { merge: true });
      navigate('/AssessmentResult');
    } catch (error) {
        console.log(error);
      return;
    }
  };

  const handleAnswer = (value) => {
    let updatedWorld = [...world];
    let updatedInformation = [...information];
    let updatedDecision = [...decision];
    let updatedStructure = [...structure];
  
    // Handle "Back" functionality
    if (value === "Back") {
      if (qIndex > 0) {
        setQIndex(qIndex - 1);
        if (qIndex < first) {
          updatedWorld[qIndex] = 0; // Reset the current question's answer
          setExtroversion((prev) => prev - world[qIndex]); // Adjust extroversion score
          setIntroversion((prev) => prev - world[qIndex + 1]); // Adjust introversion score
          console.log("World:", updatedWorld.map(v => (v === 0 ? '-' : v)).join(','));
        } else if (qIndex < second) {
          updatedInformation[qIndex - first] = 0; // Reset the current question's answer
          setSensing((prev) => prev - information[qIndex - first]); // Adjust sensing score
          setIntuition((prev) => prev - information[qIndex - first + 1]); // Adjust intuition score
          console.log("Information:", updatedInformation.map(v => (v === 0 ? '-' : v)).join(','));
        } else if (qIndex < third) {
          updatedDecision[qIndex - second] = 0; // Reset the current question's answer
          setThinking((prev) => prev - decision[qIndex - second]); // Adjust thinking score
          setFeeling((prev) => prev - decision[qIndex - second + 1]); // Adjust feeling score
          console.log("Decision:", updatedDecision.map(v => (v === 0 ? '-' : v)).join(','));
        } else if (qIndex < fourth) {
          updatedStructure[qIndex - third] = 0; // Reset the current question's answer
          setJudging((prev) => prev - structure[qIndex - third]); // Adjust judging score
          setPerceiving((prev) => prev - structure[qIndex - third + 1]); // Adjust perceiving score
          console.log("Structure:", updatedStructure.map(v => (v === 0 ? '-' : v)).join(','));
        }
  
        // Adjust summary based on the section being navigated back from
        if (qIndex === first - 1) {
          setSummary(prev => prev.slice(0, -1)); // Remove the last character if it's the last question in the section
        } else if (qIndex === second - 1) {
          setSummary(prev => prev.slice(0, -2)); // Remove the last two characters if it's the last question in the section
        } else if (qIndex === third - 1) {
          setSummary(prev => prev.slice(0, -3)); // Remove the last three characters if it's the last question in the section
        } else if (qIndex === fourth - 1) {
          setSummary(prev => prev.slice(0, -4)); // Remove the last four characters if it's the last question in the section
        }
  
        if (qIndex <= first) {
          setFirstT(firstT - 1);
        } else if (qIndex > first && qIndex <= second) {
          setSecondT(secondT - 1);
        } else if (qIndex > second && qIndex <= third) {
          setThirdT(thirdT - 1);
        } else if (qIndex > third && qIndex <= fourth) {
          setFourthT(fourthT - 1);
        }
      }
      return;
    }
  
    // Record answer in the appropriate section array
    if (qIndex < first) {
      updatedWorld[qIndex] = value;
      console.log("World:", updatedWorld.map(v => (v === 0 ? '-' : v)).join(','));
    } else if (qIndex < second) {
      updatedInformation[qIndex - first] = value;
      console.log("Information:", updatedInformation.map(v => (v === 0 ? '-' : v)).join(','));
    } else if (qIndex < third) {
      updatedDecision[qIndex - second] = value;
      console.log("Decision:", updatedDecision.map(v => (v === 0 ? '-' : v)).join(','));
    } else if (qIndex < fourth) {
      updatedStructure[qIndex - third] = value;
      console.log("Structure:", updatedStructure.map(v => (v === 0 ? '-' : v)).join(','));
    }
  
    // Update our state arrays
    setWorld(updatedWorld);
    setInformation(updatedInformation);
    setDecision(updatedDecision);
    setStructure(updatedStructure);
  
    // Synchronously calculate totals when a section is complete
    if (qIndex + 1 === first) {
      let newExtroversion = 0;
      let newIntroversion = 0;
      for (let i = 0; i < updatedWorld.length; i++) {
        if (i % 2 === 0) {
          newExtroversion += updatedWorld[i];
        } else {
          newIntroversion += updatedWorld[i];
        }
      }
      if (newExtroversion === newIntroversion) {
        newExtroversion++;
      }
      setExtroversion(newExtroversion);
      setIntroversion(newIntroversion);
      if (newExtroversion > newIntroversion) {
        setSummary(prev => prev + 'E');
        setPercentW(Math.round((newExtroversion / (newExtroversion + newIntroversion)) * 100));
      } else {
        setSummary(prev => prev + 'I');
        setPercentW(Math.round((newIntroversion / (newExtroversion + newIntroversion)) * 100));
      }
    }
    if (qIndex + 1 === second) {
      let newSensing = 0;
      let newIntuition = 0;
      for (let i = 0; i < updatedInformation.length; i++) {
        if (i % 2 === 0) {
          newSensing += updatedInformation[i];
        } else {
          newIntuition += updatedInformation[i];
        }
      }
      if (newSensing === newIntuition) {
        newSensing++;
      }
      setSensing(newSensing);
      setIntuition(newIntuition);
      if (newSensing > newIntuition) {
        setSummary(prev => prev + 'S');
        setPercentI(Math.round((newSensing / (newSensing + newIntuition)) * 100));
      } else {
        setSummary(prev => prev + 'N');
        setPercentI(Math.round((newIntuition / (newSensing + newIntuition)) * 100));
      }
    }
    if (qIndex + 1 === third) {
      let newThinking = 0;
      let newFeeling = 0;
      for (let i = 0; i < updatedDecision.length; i++) {
        if (i % 2 === 0) {
          newThinking += updatedDecision[i];
        } else {
          newFeeling += updatedDecision[i];
        }
      }
      if (newThinking === newFeeling) {
        newThinking++;
      }
      setThinking(newThinking);
      setFeeling(newFeeling);
      if (newThinking > newFeeling) {
        setSummary(prev => prev + 'T');
        setPercentD(Math.round((newThinking / (newThinking + newFeeling)) * 100));
      } else {
        setSummary(prev => prev + 'F');
        setPercentD(Math.round((newFeeling / (newThinking + newFeeling)) * 100));
      }
    }
    if (qIndex + 1 === fourth) {
      let newJudging = 0;
      let newPerceiving = 0;
      for (let i = 0; i < updatedStructure.length; i++) {
        if (i % 2 === 0) {
          newJudging += updatedStructure[i];
        } else {
          newPerceiving += updatedStructure[i];
        }
      }
      if (newJudging === newPerceiving) {
        newJudging++;
      }
      setJudging(newJudging);
      setPerceiving(newPerceiving);
      if (newJudging > newPerceiving) {
        setSummary(prev => prev + 'J');
        setPercentS(Math.round((newJudging / (newJudging + newPerceiving)) * 100));
      } else {
        setSummary(prev => prev + 'P');
        setPercentS(Math.round((newPerceiving / (newJudging + newPerceiving)) * 100));
      }
    }
  
    // Update gauge tracking counts for each section
    if (qIndex < first) {
      setFirstT(firstT + 1);
    } else if (qIndex >= first && qIndex < second) {
      setSecondT(secondT + 1);
    } else if (qIndex >= second && qIndex < third) {
      setThirdT(thirdT + 1);
    } else if (qIndex >= third && qIndex < fourth) {
      setFourthT(fourthT + 1);
    }
  
    if (qIndex + 1 <= fourth) {
      setQIndex(qIndex + 1);
    }
  };

  return (
    <div className="assessment-top">
      <div className="assessment-questions-container">
        <div className="back-button-container">
          <Button 
            variant="contained" 
            onClick={() => handleAnswer("Back")} 
            className="back-button"
            sx={{
              backgroundColor: '#444444', // Custom background color
              color: 'white', // Text color
              '&:hover': {
                backgroundColor: '#333333', // Hover color
              },
              '&:active': {
                backgroundColor: '#222222', // Active color
              },
            }}
          >
            Back
          </Button>
        </div>
        {qIndex < 32 && (
          <div className="question-number">
            {(qIndex + 1)} of {worldQ.length + informationQ.length + decisionQ.length + structureQ.length}
          </div>
        )}
        {qIndex >= 32 && (
          <div className="question-number">
            Finished Assessment
          </div>
        )}
        <div className="gauge-container">
          <Stack direction={{ xs: 'row', md: 'row' }} spacing={{ xs: .2, md: -30 }}>
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
        <div className="question">
          {qIndex < fourth && proceedAssessment()}
        </div>
        <div className="answers-container">
          {qIndex < 32 && (
            <div className="answers">
              {/* Left label for Agree */}
              <div className="button-container"></div>
              <div className="label-left">Agree</div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
              <div className="button-container"></div>
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
            <Button variant="contained" color="success" onClick={() => proceedResults()}>
              Proceed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestionsOld;
