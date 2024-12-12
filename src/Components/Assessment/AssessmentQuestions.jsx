import React, { useState } from "react";
import "./AssessmentQuestions.css";

const AssessmentQuestions = () => {
    const [qIndex, setQIndex] = useState(0);
    const [world, setWorld] = useState(Array(8).fill(0));
    const [information, setInformation] = useState(Array(8).fill(0));
    const [decision, setDecision] = useState(Array(8).fill(0));
    const [structure, setStructure] = useState(Array(8).fill(0));

    const worldQ = [
        "Do you enjoy large social gatherings?",
        "Do you prefer to work in a quiet environment?",
        "Are you comfortable being the center of attention?",
        "Do you prefer to work alone rather than in a team?",
        "Are you comfortable speaking in front of a large group of people?",
        "Do you enjoy spending time alone?",
        "Do you enjoy attending parties and social events?",
        "Do you prefer to spend time in a smaller group of friends?"
    ];

    const informationQ = [
        "Do you prefer dealing with concrete facts and details rather than abstract concepts?",     //S
        "Do you often find yourself more interested in new possibilities than focusing on the details of the present?",
        "Do you enjoy activities that require paying attention to the present moment and immediate surroundings?",//S
        "Do you enjoy contemplating abstract concepts and theories?",
        "Do you trust your direct observations and experiences more than theories or ideas?",       //S
        "Are you more drawn to innovative and creative solutions rather than relying solely on proven and established methods?",
        "Do you appreciate practical, realistic solutions to problems rather than theoretical or conceptual approaches?",//S
        "Do you tend to see the big picture and overarching patterns, rather than getting bogged down in specific details?"
    ];

    const decisionQ = [
        "Do you prefer to analyze and dissect situations?",
        "Do you prefer to empathize and understand others' feelings?",
        "Are you more focused on the logical and objective aspects of life?",
        "Do you prefer to consider the emotional and subjective aspects of life?",
        "Do you prefer to make decisions based on logical reasoning?",
        "Do you prefer to make decisions based on your emotions and feelings?",
        "Are you more comfortable with facts and data?",
        "Do you prefer to make decisions based on your intuition and feelings?"
    ];

    const structureQ = [
        "Do you prefer to be organized and structured?",
        "Do you prefer to be flexible and adaptable?",
        "Do you prefer to plan and schedule?",
        "Do you prefer to be unplanned and spontaneous?",
        "Do you prefer to be regulated and structured?",
        "Do you prefer to be easygoing and live and let live?",
        "Do you prefer to prepare and plan ahead?",
        "Do you prefer to go with the flow and adapt as you go?"
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
        } else if (qIndex >= first && qIndex < second) {
            updatedInformation[qIndex - first] = value;
        } else if (qIndex >= second && qIndex < third) {
            updatedDecision[qIndex - second] = value;
        } else if (qIndex >= third && qIndex < fourth) {
            updatedStructure[qIndex - third] = value;
        }

        setWorld(updatedWorld);
        setInformation(updatedInformation);
        setDecision(updatedDecision);
        setStructure(updatedStructure);

        if (qIndex + 1 < fourth) {
            setQIndex(qIndex + 1);
        }
    };

    return (
        <div className="assessment-container">
            <div className="question-number">
                {qIndex + 1} of {worldQ.length + informationQ.length + decisionQ.length + structureQ.length}
            </div>
            <div className="question">
                {proceedAssessment()}
            </div>
            <div className="answers">
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
            </div>
        </div>
    );
};

export default AssessmentQuestions;
