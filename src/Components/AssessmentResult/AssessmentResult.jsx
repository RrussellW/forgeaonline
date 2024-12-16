import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AssessmentResult.css'; // Import the CSS file

const AssessmentResult = () => {
  // Dummy data for a single user
  const user = {
    email: "1@gmail.com",
    personalitySummary: "INFJ", // This will determine the percentages
  };

  // Function to calculate extrovert and introvert percentages based on personality type
  const calculatePersonality = (summary) => {
    switch (summary) {
      case "ENFP":
        return { extrovert: 80, introvert: 20 };
      case "ESTJ":
        return { extrovert: 70, introvert: 30 };
      case "INFJ":
        return { extrovert: 30, introvert: 70 };
      case "ISFP":
        return { extrovert: 20, introvert: 80 };
      case "ENFJ":
        return { extrovert: 65, introvert: 35 };
      default:
        return { extrovert: 50, introvert: 50 }; // Default case if personalitySummary is unknown
    }
  };

  // Calculate the extrovert and introvert percentages for the current user
  const { extrovert, introvert } = calculatePersonality(user.personalitySummary);

  // Data for the bar chart based on the user's personality
  const data = [
    { name: 'User', extrovert, introvert },
  ];

  return (
    <div className="assessment-container">
      <h2 className="chart-title">Extrovert vs Introvert</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="extrovert" fill="#82ca9d" name="Extrovert" />
            <Bar dataKey="introvert" fill="#8884d8" name="Introvert" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssessmentResult;
