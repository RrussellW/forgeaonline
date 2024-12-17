import React, { useState } from 'react';
import './PITest.css';
import { Paper, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const cache = createCache({
    key: 'css',
    prepend: true,
});

const PITest = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        major: '',
        yearLevel: '',
        gender: '',
        semester: '',
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

        // If it's a subject field (grade or units)
        if (index !== undefined) {
            const updatedSubjects = [...formData.subjects];
            if (updatedSubjects[index]) {
                updatedSubjects[index][field] = value; // Update the specific field
                setFormData({ ...formData, subjects: updatedSubjects });
            }
        } else {
            // If it's a major or yearLevel field
            setFormData({
                ...formData, [e.target.name]: value // Update major or yearLevel
            });
        }
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
        if (!formData.gender) newErrors.gender = 'Please select your gender';
        if (!formData.semester) newErrors.semester = 'Please select your current semester for your grades';

        formData.subjects.forEach((subject, index) => {
            if (!subject.grade) newErrors[`subject_${index}_grade`] = `Grade is required`;
            if (!subject.units) newErrors[`subject_${index}_units`] = `Units are required`;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form submission
    
        if (!validateForm()) {
            return;  // Don't proceed if validation fails
        }
    
        let totalUnits = 0;
        let totalGradeUnits = 0;
    
        formData.subjects.forEach(subject => {
            if (subject.grade && subject.units) {
                totalUnits += parseFloat(subject.units);
                totalGradeUnits += parseFloat(subject.grade) * parseFloat(subject.units);
            }
        });
    
        const gwa = totalGradeUnits / totalUnits;  // GWA formula
        //console.log('Calculated GWA:', gwa);
        //console.log('Major:', formData.major);
        //console.log('Year Level:', formData.yearLevel);
        //console.log('Subjects:', formData.subjects);
        //console.log('GWA:', gwa);
    
        // Save data or proceed with next steps
        try {
            await setDoc(doc(db, "Dataset", auth.currentUser.email), {
                gwa: gwa,
                year: formData.yearLevel,
                major: formData.major
              }, {merge: true});
        } catch (error) {
            console.log(error);
            return;
        }
        navigate('/AssessmentQuestions');
    };
    

    const addSubject = () => {
        setFormData({
            ...formData,
            subjects: [...formData.subjects, { grade: '', units: '' }],
        });
    };

    const removeSubject = (index) => {
        if (formData.subjects.length > 1) {  // Avoid removing the last subject
            const newSubjects = [...formData.subjects];
            newSubjects.splice(index, 1);
            setFormData({ ...formData, subjects: newSubjects });
        }
    };

    return (
        <CacheProvider value={cache}>
            <Paper elevation={24} className="paperContainer">
                <Typography variant="h5" className="typographyHeader">
                    Personal Information Test
                </Typography>
                <Typography variant="body2" style={{ marginBottom: '10px' }}>
                    Please provide your student information. Your selected major and year level help to categorize and tailor the results for students in different fields of study and academic stages.
                </Typography>

                <form onSubmit={handleSubmit}>
                    <div className="inputField">
                        <FormControl fullWidth variant="filled" className="textFieldRoot">
                            <InputLabel>Major</InputLabel>
                            <Select
                                label="Major"
                                name="major"
                                value={formData.major}
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value="CS">Computer Science</MenuItem>
                                <MenuItem value="IT">Information Technology</MenuItem>
                            </Select>
                            {errors.major && <Typography color="error" variant="caption">{errors.major}</Typography>}
                        </FormControl>
                    </div>

                    <div className="inputField">
                        <FormControl fullWidth variant="filled" className="textFieldRoot">
                            <InputLabel>Year Level</InputLabel>
                            <Select
                                label="Year Level"
                                name="yearLevel"
                                value={formData.yearLevel}
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value="1">1st Year</MenuItem>
                                <MenuItem value="2">2nd Year</MenuItem>
                                <MenuItem value="3">3rd Year</MenuItem>
                                <MenuItem value="4">4th Year</MenuItem>
                            </Select>
                            {errors.yearLevel && <Typography color="error" variant="caption">{errors.yearLevel}</Typography>}
                        </FormControl>
                    </div>

                    <div className="inputField">
                        <FormControl fullWidth variant="filled" className="textFieldRoot">
                            <InputLabel>Gender</InputLabel>
                            <Select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value="1">Man</MenuItem>
                                <MenuItem value="2">Woman</MenuItem>
                                <MenuItem value="3">Non-binary</MenuItem>
                                <MenuItem value="4">I prefer not to say</MenuItem>
                            </Select>
                            {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
                        </FormControl>
                    </div>

                    <Typography variant="h6">GWA Calculation</Typography>
                    <Typography variant="body2" style={{ marginBottom: '10px' }}>
                        Please input your grades from your major classes and its number of units. GWA will be automatically calculated.
                    </Typography>

                    <div className="inputField">
                        <FormControl fullWidth variant="filled" className="textFieldRoot">
                            <InputLabel>Semester</InputLabel>
                            <Select
                                label="Semester"
                                name="semester"
                                value={formData.semester}
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value="1">First Semester</MenuItem>
                                <MenuItem value="2">Second Semester</MenuItem>
                            </Select>
                            {errors.semester && <Typography color="error" variant="caption">{errors.semester}</Typography>}
                        </FormControl>
                    </div>

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
                                    className="textFieldRoot"
                                    fullWidth
                                    error={!!errors[`subject_${index}_grade`]}
                                    helperText={errors[`subject_${index}_grade`]}
                                />
                                <TextField
                                    variant="filled"
                                    label="Number of Units"
                                    name={`subject_${index}_units`}
                                    value={subject.units ?? ''} // Fallback to an empty string if undefined
                                    onChange={(e) => handleChange(e, index, 'units')}
                                    className="textFieldRoot"
                                    fullWidth
                                    error={!!errors[`subject_${index}_units`]}
                                    helperText={errors[`subject_${index}_units`]}
                                />
                                <Button
                                    variant="contained"
                                    color="#333333"
                                    onClick={() => removeSubject(index)}
                                    className='remove'
                                >
                                    -
                                </Button>
                            </div>
                        ))
                    }

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
                        <Button
                            onClick={addSubject}
                            variant="contained"
                            sx={{
                                backgroundColor: '#B78FD6',
                                color: 'white',
                                textTransform: 'none', // Prevents text from being uppercase
                                '&:hover': {
                                    backgroundColor: '#9A6ABF', // Hover color
                                },
                                '&:active': {
                                    backgroundColor: '#7A4D98', // Active (clicked) color
                                },
                            }}
                        >
                            Add Subject
                        </Button>
                    </div>
                    <Button type="submit" variant="contained" className="button">
                        Save
                    </Button>
                </form>
            </Paper>
        </CacheProvider>
    );
};

export default PITest;
