import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import './AssessmentResult.css'; // Import the CSS file

const AssessmentResult = () => {
  // Dummy user data
  const user = {
    email: "1@gmail.com",
    personalitySummary: "ESFP", // User's MBTI type
    percentW: 70, // Extraversion percentage (W = Extraversion)
    percentI: 75, // Introversion percentage (I = 100 - W)
    percentP: 55, // Sensing percentage (P = Sensing)
    percentS: 70, // Intuition percentage (S = 100 - P)
  };

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
  const calculateTraits = (personalitySummary, percentW, percentI, percentP, percentS) => {
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
            value: percentP,
            inverseValue: 100 - percentP,
          };
          break;
        case 'N': // Intuition
          traitData.N = {
            dominant: 'Intuition',
            inverse: 'Sensing',
            value: percentS,
            inverseValue: 100 - percentS,
          };
          break;
        case 'T': // Thinking
          traitData.T = {
            dominant: 'Thinking',
            inverse: 'Feeling',
            value: percentW, // For this case, assume it matches W value
            inverseValue: 100 - percentW,
          };
          break;
        case 'F': // Feeling
          traitData.F = {
            dominant: 'Feeling',
            inverse: 'Thinking',
            value: percentI, // For this case, assume it matches I value
            inverseValue: 100 - percentI,
          };
          break;
        case 'J': // Judging
          traitData.J = {
            dominant: 'Judging',
            inverse: 'Perceiving',
            value: percentP,
            inverseValue: 100 - percentP,
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
        default:
          break;
      }
    });

    return traitData;
  };

  // Calculate trait data based on the user's MBTI type and percentages
  const traitData = calculateTraits(user.personalitySummary, user.percentW, user.percentI, user.percentP, user.percentS);

  // State for the selected letter
  const [selectedLetter, setSelectedLetter] = useState(user.personalitySummary[0]);

  // Button colors for visual appeal
  const buttonColors = ['#F8F1AD', '#EDACA3', '#E199C8', '#B78FD6'];

  return (
    <div className="assessment-container">
      <Typography variant="h5" className="typographyHeader">
                    Test Results
      </Typography>
      <h2 className="chart-title">Your Personality Type is:</h2>

      {/* Personality Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {user.personalitySummary.split('').map((letter, index) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            style={{
              backgroundColor: selectedLetter === letter ? '#564a61' : buttonColors[index % buttonColors.length],
              color: selectedLetter === letter ? buttonColors[index % buttonColors.length] : '#333',
              border: `6px solid ${buttonColors[index % buttonColors.length]}`,
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '20px',
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Trait Descriptions */}
      <div style={{ marginBottom: '20px', textAlign: 'left', whiteSpace: 'pre-line' }}>
        <h3>{traitData[selectedLetter]?.dominant}: {traitData[selectedLetter]?.value}%</h3>
        <p>{descriptions[traitData[selectedLetter]?.dominant]}</p>

        <h4 style={{ color: 'gray' }}>Other Trait: {traitData[selectedLetter]?.inverse} ({traitData[selectedLetter]?.inverseValue}%)</h4>
        <p style={{ color: 'gray' }}>{descriptions[traitData[selectedLetter]?.inverse]}</p>
      </div>

      {/* Chart
      <div className="chart-container" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: traitData[selectedLetter]?.dominant, value: traitData[selectedLetter]?.value },
              { name: traitData[selectedLetter]?.inverse, value: traitData[selectedLetter]?.inverseValue },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}
      {/* Informational Disclaimer */}
      <p style={{ fontSize: '12px', color: 'gray', textAlign: 'center' }}>
        Please remember that these results are for informational purposes only and should not be considered as definitive or absolute.
      </p>
    </div>
  );
};

export default AssessmentResult;
