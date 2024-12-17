import React, { useState } from "react";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Stack, Button } from '@mui/material';
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import "./AssessmentQuestions.css";
import { useNavigate } from 'react-router-dom';

const AssessmentQuestions = () => {
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
        "Do you enjoy large social gatherings?", //E
        "Do you prefer to work in a quiet environment?",
        "Are you comfortable being the center of attention?", //E
        "Do you prefer to work alone rather than in a team?",
        "Are you comfortable speaking in front of a large group of people?", //E
        "Do you enjoy spending time alone?",
        "Do you enjoy attending parties and social events?", //E
        "Do you prefer to spend time in a smaller group of friends?"
    ];

    const informationQ = [
        "Do you prefer dealing with concrete facts and details rather than abstract concepts?",     //S
        "Do you often find yourself more interested in new possibilities than focusing on the details of the present?",//N
        "Do you enjoy activities that require paying attention to the present moment and immediate surroundings?",//S
        "Do you enjoy contemplating abstract concepts and theories?",//N
        "Do you trust your direct observations and experiences more than theories or ideas?",       //S
        "Are you more drawn to innovative and creative solutions rather than relying solely on proven and established methods?",//N
        "Do you appreciate practical, realistic solutions to problems rather than theoretical or conceptual approaches?",//S
        "Do you tend to see the big picture and overarching patterns, rather than getting bogged down in specific details?" //N
    ];

    const decisionQ = [
        "Do you prefer to analyze and dissect situations?", //T
        "Do you prefer to empathize and understand others' feelings?", //F
        "Are you more focused on the logical and objective aspects of life?", //T
        "Do you prefer to consider the emotional and subjective aspects of life?", //F
        "Do you prefer to make decisions based on logical reasoning?",//T
        "Do you prefer to make decisions based on your emotions and feelings?", //F
        "Are you more comfortable with facts and data?",//T
        "Do you prefer to make decisions based on your intuition and feelings?" //F
    ];

    const structureQ = [
        "Do you prefer to be organized and structured?", //J
        "Do you prefer to be flexible and adaptable?", //P
        "Do you prefer to plan and schedule?",//J
        "Do you prefer to be unplanned and spontaneous?",//P
        "Do you prefer to be regulated and structured?",//J
        "Do you prefer to be easygoing and live and let live?",//P
        "Do you prefer to prepare and plan ahead?",//J
        "Do you prefer to go with the flow and adapt as you go?"//P
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
        const data = {
            personalitySummary: summary,
            percentW: (percentW),
            percentI: (percentI),
            percentD: (percentD),
            percentS: (percentS)
        };

        try {
            await setDoc(doc(db, "Dataset", auth.currentUser.email), data, {merge: true});
        } catch(error) {

            return;
        }
        navigate('/AssessmentResult')
    };

    const handleAnswer = (value) => {
        let updatedWorld = [...world];
        let updatedInformation = [...information];
        let updatedDecision = [...decision];
        let updatedStructure = [...structure];

        if (qIndex + 1 === first) {
            // Final question for World section
            if (extroversion > introversion) {
                setSummary(summary + 'E');
                setPercentW(Math.round((extroversion / (extroversion + introversion)) * 100));
            } else {
                setSummary(summary + 'I');
                setPercentW(Math.round((introversion / (extroversion + introversion)) * 100));
            }
        }
    
        if (qIndex + 1 === second) {
            // Final question for Information section
            if (sensing > intuition) {
                setSummary(summary + 'S');
                setPercentI(Math.round((sensing / (sensing + intuition)) * 100));
            } else {
                setSummary(summary + 'N');
                setPercentI(Math.round((intuition / (sensing + intuition)) * 100));
            }
        }
    
        if (qIndex + 1 === third) {
            // Final question for Decision section
            if (thinking > feeling) {
                setSummary(summary + 'T');
                setPercentD(Math.round((thinking / (thinking + feeling)) * 100));
            } else {
                setSummary(summary + 'F');
                setPercentD(Math.round((feeling / (thinking + feeling)) * 100));
            }
        }
    
        if (qIndex + 1 === fourth) {
            // Final question for Structure section
            if (judging > perceiving) {
                setSummary(summary + 'J');
                setPercentS(Math.round((judging / (judging + perceiving)) * 100));
            } else {
                setSummary(summary + 'P');
                setPercentS(Math.round((perceiving / (judging + perceiving)) * 100));
            }
        }
    
        if (qIndex < first) {
            updatedWorld[qIndex] = value;
            setExtroversion((qIndex % 2 === 0) ? extroversion + value : extroversion);
            setIntroversion((qIndex % 2 !== 0) ? introversion + value : introversion);
        } else if (qIndex < second) {
            updatedInformation[qIndex - first] = value;
            setSensing(((qIndex - first) % 2 === 0) ? sensing + value : sensing);
            setIntuition(((qIndex - first) % 2 !== 0) ? intuition + value : intuition);
        } else if (qIndex < third) {
            updatedDecision[qIndex - second] = value;
            setThinking(((qIndex - second) % 2 === 0) ? thinking + value : thinking);
            setFeeling(((qIndex - second) % 2 !== 0) ? feeling + value : feeling);
        } else if (qIndex < fourth) {
            updatedStructure[qIndex - third] = value;
            setJudging(((qIndex - third) % 2 === 0) ? judging + value : judging);
            setPerceiving(((qIndex - third) % 2 !== 0) ? perceiving + value : perceiving);
        }
    
        setWorld(updatedWorld);
        setInformation(updatedInformation);
        setDecision(updatedDecision);
        setStructure(updatedStructure);

        if(qIndex < first) {
            setFirstT(firstT + 1);
        } else if(qIndex >= first && qIndex < second) {
            setSecondT(secondT + 1);
        } else if(qIndex >= second && qIndex < third) {
            setThirdT(thirdT + 1);
        } else if(qIndex >= third && qIndex < fourth) {
            setFourthT(fourthT + 1);
        } 
    
        if (qIndex + 1 <= fourth) {
            setQIndex(qIndex + 1);
        } 
    };    

    return (
        <div className="assessment-top">
            <div className="assessment-container">
                {qIndex < 32 && (<div className="question-number">
                    {(qIndex + 1)} of {worldQ.length + informationQ.length + decisionQ.length + structureQ.length}
                </div>)}
                {qIndex >= 32 && (<div className="question-number">
                    Finished Assessment
                </div>)}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: .2, md: -5 }}>
                    <Gauge width={100} height={100} value={(firstT/8) * 100} text={""} sx={(theme) => ({
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#F8F1AD"
                        }})}/>
                    <Gauge width={100} height={100} value={(secondT/8) * 100} text={""} sx={(theme) => ({
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#EDACA3"
                        }})}/>
                    <Gauge width={100} height={100} value={(thirdT/8) * 100} text={""} sx={(theme) => ({
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#E199C8"
                        }})}/>
                    <Gauge width={100} height={100} value={(fourthT/8) * 100} text={""} sx={(theme) => ({
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#B78FD6"
                        }})}/>
                </Stack>
                <div className="question">
                    {qIndex < fourth && (proceedAssessment())}
                </div>
                {qIndex < 32 && (<div className="answers">
                    {/* Left label for Agree */}
                    <div className="label-left">Agree</div>

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
                    <div className="label-right">Disagree</div>
                </div>)}

                {qIndex >= 32 && (
                    <Button variant="contained" color="success" onClick={ () => proceedResults()}>
                        Proceed
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AssessmentQuestions;
