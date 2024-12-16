import React, { useState } from "react";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Stack, Button } from '@mui/material';
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

    const handleAnswer = (value) => {
        let updatedWorld = [...world];
        let updatedInformation = [...information];
        let updatedDecision = [...decision];
        let updatedStructure = [...structure];
    
        if (qIndex < first) {
            updatedWorld[qIndex] = value;
            setFirstT(firstT + 1);
            if (qIndex === 0 || qIndex % 2 === 0) {
                setExtroversion(extroversion + value);
            } else {
                setIntroversion(introversion + value);
            }
        } else if (qIndex >= first && qIndex < second) {
            updatedInformation[qIndex - first] = value;
            setSecondT(secondT + 1);
            if ((qIndex - first) === 0 || (qIndex - first) % 2 === 0) {
                setSensing(sensing + value);
            } else {
                setIntuition(intuition + value);
            }
        } else if (qIndex >= second && qIndex < third) {
            updatedDecision[qIndex - second] = value;
            setThirdT(thirdT + 1);
            if ((qIndex - second) === 0 || (qIndex - second) % 2 === 0) {
                setThinking(thinking + value);
            } else {
                setFeeling(feeling + value);
            }
        } else if (qIndex >= third && qIndex < fourth) {
            updatedStructure[qIndex - third] = value;
            setFourthT(fourthT + 1);
            if ((qIndex - third) === 0 || (qIndex - third) % 2 === 0) {
                setJudging(judging + value);
            } else {
                setPerceiving(perceiving + value);
            }
        }
    
        setWorld(updatedWorld);
        setInformation(updatedInformation);
        setDecision(updatedDecision);
        setStructure(updatedStructure);
    
        if (qIndex + 1 < fourth) {
            setQIndex(qIndex + 1);
        } else {
            navigate('/AssessmentResult'); // Redirect to the result page
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
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: .2, md: -30 }}>
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
                    <Button variant="contained" color="success">
                        Proceed
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AssessmentQuestions;
