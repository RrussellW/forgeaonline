import React, { useState } from 'react';
import './Intro.css';
import { Paper, Button, Typography, CircularProgress, Divider, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const cache = createCache({
    key: 'css',
    prepend: true,
});

const Intro = () => {
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const handleStartTest = () => {
        setDisabled(true); // Simulate 2-second loading
        setTimeout(() => {
            navigate('/AssessmentQuestions');
        }, 2000);
    };

    return (
        <div className='intro'>
            <Paper elevation={24} className="paperContainerIntro">
                <Typography variant="h5" className="typographyHeaderIntro" gutterBottom>
                    MBTI Personality Assessment for CS/IT Student Performance Prediction
                </Typography>

                <Typography variant="body1" paragraph>
                    Thank you for participating in this research study! Below is important information about the assessment.
                </Typography>

                <Accordion
                    sx={{ 
                        bgcolor: 'transparent',
                        marginBottom: '1rem',
                        boxShadow: '1',
                        border: '1px solid #ccc',
                        borderRadius: '10px',}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h8" gutterBottom>
                            Informed Consent Form
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            bgcolor: '#FFFFFF',
                            borderRadius: '10px',
                        }}>
                    <Typography variant="body2" paragraph className="justify-text">
                    <p/>
                    <Divider><strong><Chip label="Purpose of the Study" variant="outlined" /></strong></Divider> This study investigates the relationship between personality traits (measured by the Myers-Briggs Type Indicator or MBTI) and academic performance among Computer Science (CS) and Information Technology (IT) students. By participating, you will help us develop predictive models using machine learning to enhance academic guidance tools for future students.
                </Typography>

                <Typography variant="body2" paragraph className="justify-text">
                    <Divider><strong><Chip label="What You Will Do" variant="outlined" /></strong></Divider>
                    You will complete an online MBTI personality assessment, which takes approximately 10–15 minutes. The assessment involves answering questions about your preferences and behaviors. No sensitive or personally identifiable information will be collected, and all responses will remain anonymous.
                </Typography>

                <Typography variant="body2" paragraph className="justify-text">
                    <Divider><strong><Chip label="Your Participation is Voluntary" variant="outlined" /></strong></Divider> You can choose to participate or withdraw at any time without providing a reason. Withdrawing will not affect your relationship with the researchers or your institution. If you withdraw before completing the assessment, any collected data will be deleted.
                </Typography>

                

                <Typography variant="body2" paragraph className="justify-text">
                    <Divider><strong><Chip label="Risks" variant="outlined" /></strong></Divider> There are no significant risks associated with this study. The MBTI assessment consists of general questions about your preferences and behaviors. If you feel uncomfortable at any point, you may skip questions or leave the assessment.
                </Typography>

                <Typography variant="body2" paragraph className="justify-text">
                    <Divider><strong><Chip label="Benefits" variant="outlined" /></strong></Divider> While there are no direct benefits to you, your participation will heavily contribute to this research. The findings may lead to improved understanding of CS/IT students' personalities.
                </Typography>

                <Typography variant="body2" paragraph className="justify-text">
                    <Divider><strong><Chip label="Confidentiality" variant="outlined" /></strong></Divider> Your responses will be kept strictly confidential. All data will be anonymized, stored securely, and reported in aggregate form to ensure individual responses cannot be identified.
                </Typography>
                    </AccordionDetails>
                        
                </Accordion>

                <Divider />

                <Typography variant="body1" paragraph style={{ marginTop: '2rem' }}>
                    By proceeding, you acknowledge that you have read and understood this consent form and agree to participate in the study.
                </Typography>

                

                <div className="buttonContainer">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleStartTest}
                        disabled={disabled}
                        className="button"
                    >
                        {disabled ? <CircularProgress size={24} /> : 'Start Personality Assessment'}
                    </Button>
                </div>
            </Paper>
            <div>&#8203;</div>
        </div>
    );
};

export default Intro;