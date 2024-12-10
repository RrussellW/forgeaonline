import React, { useState } from 'react';
import './PITest.css';
import { Paper, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const cache = createCache({
    key: 'css',
    prepend: true,
});

const PITest = () => {
    const [formData, setFormData] = useState({
        major: '',
        yearLevel: '',
        subjects: [
            { grade: '', units: '' },
            { grade: '', units: '' },
            { grade: '', units: '' }
        ],
        gwa: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e, index, field) => {
        const { value } = e.target;
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[index][field] = value; // Update the specific field
        setFormData({ ...formData, subjects: updatedSubjects });
    };
    
    

    const calculateGWA = () => {
        let totalUnits = 0;
        let weightedSum = 0;

        formData.subjects.forEach(subject => {
            const grade = parseFloat(subject.grade) || 0;
            const units = parseFloat(subject.units) || 0;

            weightedSum += grade * units;
            totalUnits += units;
        });

        if (totalUnits === 0) return 0;  // Avoid division by zero
        return weightedSum / totalUnits;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.major) newErrors.major = 'Please select your major';
        if (!formData.yearLevel) newErrors.yearLevel = 'Please select your year level';

        formData.subjects.forEach((subject, index) => {
            if (!subject.grade) newErrors[`subject_${index}_grade`] = `Grade for Subject #${index + 1} is required`;
            if (!subject.units) newErrors[`subject_${index}_units`] = `Units for Subject #${index + 1} are required`;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        // Calculate the GWA here based on formData
        let totalUnits = 0;
        let totalGradeUnits = 0;
    
        formData.subjects.forEach(subject => {
            if (subject.grade && subject.units) {
                totalUnits += parseFloat(subject.units);
                totalGradeUnits += parseFloat(subject.grade) * parseFloat(subject.units);
            }
        });
    
        const gwa = totalGradeUnits / totalUnits;  // GWA formula
    
        // You can save this result to Firebase or handle it as needed
        console.log('Calculated GWA:', gwa);
    };
    

    const addSubject = () => {
        setFormData({
            ...formData,
            subjects: [...formData.subjects, { grade: '', units: '' }],
        });
    };

    const removeSubject = (index) => {
        const newSubjects = [...formData.subjects];
        newSubjects.splice(index, 1);
        setFormData({ ...formData, subjects: newSubjects });
    };

    return (
        <CacheProvider value={cache}>
            <Paper elevation={24} className="paperContainer">
                <Typography variant="h5" className="typographyHeader">
                    Personal Information Test
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div className="inputField">
                        <FormControl fullWidth variant="filled">
                            <InputLabel>Major</InputLabel>
                            <Select
                                label="Major"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                error={!!errors.major}
                            >
                                <MenuItem value="CS">Computer Science</MenuItem>
                                <MenuItem value="IT">Information Technology</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="inputField">
                        <FormControl fullWidth variant="filled">
                            <InputLabel>Year Level</InputLabel>
                            <Select
                                label="Year Level"
                                name="yearLevel"
                                value={formData.yearLevel}
                                onChange={handleChange}
                                error={!!errors.yearLevel}
                            >
                                <MenuItem value="1">1st Year</MenuItem>
                                <MenuItem value="2">2nd Year</MenuItem>
                                <MenuItem value="3">3rd Year</MenuItem>
                                <MenuItem value="4">4th Year</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <Typography variant="h6">GWA Calculation</Typography>
                    {
                        formData.subjects.map((subject, index) => (
                            <div
                                className="subjectRow"
                                key={index}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}
                            >
                                <TextField
                                    variant="filled"
                                    label={`Subject #${index + 1} Grade`}
                                    name={`subject_${index}_grade`}
                                    value={subject.grade ?? ''} // Fallback to an empty string if undefined
                                    onChange={(e) => handleChange(e, index, 'grade')}
                                    fullWidth
                                />
                                <TextField
                                    variant="filled"
                                    label="Number of Units"
                                    name={`subject_${index}_units`}
                                    value={subject.units ?? ''} // Fallback to an empty string if undefined
                                    onChange={(e) => handleChange(e, index, 'units')}
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => removeSubject(index)}
                                    style={{ height: 'fit-content' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))
                    }


                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <Button onClick={addSubject} variant="contained" color="primary">
                            Add Subject
                        </Button>
                        <Button type="submit" variant="contained" className="button">
                            NEXT
                        </Button>
                    </div>
                </form>
            </Paper>
        </CacheProvider>
    );
};

export default PITest;
