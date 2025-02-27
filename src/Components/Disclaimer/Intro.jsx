import React, { useState } from 'react';
import './Intro.css';
import { Paper, Button, Typography, CircularProgress, Divider, Chip, Accordion, AccordionSummary, AccordionDetails, Step, StepLabel,
StepContent, Stepper, Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

const Intro = () => {
    const [activeStep, setActiveStep] = React.useState(0);
  
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if(activeStep === steps.length - 1) {
            setAccordionExpanded(false);
            setConsentFinished(true);
        }
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        if (activeStep === steps.length) {
            setConsentFinished(false);
        }
    };
    
    const handleReset = () => {
        setActiveStep(0);
    };
    
    const [accordionExpanded, setAccordionExpanded] = useState(false);
    const [consentFinished, setConsentFinished] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const handleStartTest = () => {
        setDisabled(true); // Simulate 2-second loading
        setTimeout(() => {
            navigate('/AssessmentQuestions');
        }, 2000);
    };

    const steps = [
        {
            label: 'Purpose of the Study',
            description: `This study investigates the relationship between personality traits 
            (measured by the Myers-Briggs Type Indicator or MBTI) and academic performance among 
            Computer Science (CS) and Information Technology (IT) students. By participating, 
            you will help us develop predictive models using machine learning to enhance academic 
            guidance tools for future students.`,
        },
        {
            label: 'What You Will Do',
            description:
            `You will complete an online MBTI personality assessment, which takes approximately 10-15 minutes.
             The assessment involves answering questions about your preferences and behaviors. No sensitive 
             or personally identifiable information will be collected, and all responses will remain anonymous.`,
        },
        {
            label: 'Your Participation is Voluntary',
            description: `You can choose to participate or withdraw at any time without providing a reason. Withdrawing will 
            not affect your relationship with the researchers or your institution. If you withdraw before completing
            the assessment, any collected data will be deleted.`,
        },
        {
            label: 'Risks',
            description: `There are no significant risks associated with this study. The MBTI assessment consists of 
            general questions about your preferences and behaviors. If you feel uncomfortable at any point, you may skip
            questions or leave the assessment.`,
        },
        {
            label: 'Benefits',
            description: `While there are no direct benefits to you, your participation will heavily contribute to this
            research. The findings may lead to improved understanding of CS/IT students' personalities.`,
        },
        {
            label: 'Confidentiality',
            description: `Your responses will be kept strictly confidential. All data will be anonymized, 
            stored securely, and reported in aggregate form to ensure individual responses cannot be identified.`,
        },
      ];

    return (
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className='intro'>
            <Paper elevation={24} className="paperContainerIntro">
                <Typography variant="h5" className="typographyHeaderIntro" gutterBottom>
                    Personality Assessment for CS/IT Student Performance Prediction
                </Typography>

                <Typography variant="body1" paragraph>
                    Thank you for participating in this research study! Below is important information about the assessment.
                </Typography>

                <Accordion className='AccordionIntro'
                    expanded={accordionExpanded}
                    sx={{ 
                        bgcolor: 'transparent',
                        marginBottom: '1rem',
                        boxShadow: '1',
                        border: '1px solid light.primary',
                        borderRadius: '10px',}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                    onClick={() => setAccordionExpanded(!accordionExpanded)}
                    sx={{
                        bgcolor: 'transparent',}}>
                        <Typography variant="h8" gutterBottom>
                            Informed Consent Form
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            bgcolor: 'transparent',
                            borderRadius: '10px',
                        }}>
                    <Stepper activeStep={activeStep} orientation="vertical" >
                        {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                            sx={{ 
                                '& .MuiStepIcon-root': { 
                                  color: '#B78FD6', // Change the circle color
                                },
                                '& .Mui-active .MuiStepIcon-root': { 
                                  color: '#E199C8', // Change color when active
                                },
                                '& .Mui-completed .MuiStepIcon-root': { 
                                  color: '#F8F1AD', // Change color when step is completed
                                }
                              }}
                            optional={
                                index === steps.length - 1 ? (
                                <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                            >
                            {step.label}
                            </StepLabel>
                            <StepContent >
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ 
                                    mt: 1, 
                                    mr: 1, 
                                    background:  '#B78FD6', 
                                    color: 'white', 
                                    '&:hover': { 
                                    filter: 'brightness(1.2)', 
                                    }
                                }}
                                >
                                {index === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>   
                                <Button
                                disabled={index === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1 }}
                                color='error'
                                >
                                Back
                                </Button>
                            </Box>
                            </StepContent>
                        </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && accordionExpanded && (
                        <Paper square elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                        <Typography>All steps completed! Form is finished.</Typography>
                        <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }} color='error'>
                            Back
                        </Button>
                        </Paper>
                    )}
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
                        disabled={!consentFinished || disabled}
                        className="buttonGradient"
                    >
                        {disabled ? <CircularProgress color="inherit" size={30} /> : 'Start Personality Assessment'}
                    </Button>
                </div>
            </Paper>
            <div>&#8203;</div>
        </div>
        </ThemeProvider>
    );
};

export default Intro;