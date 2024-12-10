// Import React and necessary hooks
import React, { useState } from 'react';
import './LoginSignup.css'
import { Paper, TextField, Button, Typography } from '@mui/material';
import inter from '@fontsource/inter';
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';

const LoginSignup = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate Student ID
        if (!formData.studentId) {
            newErrors.studentId = 'Student ID is required';
        } else if (!/^\d{2}-\d{4}-\d{3}$/.test(formData.studentId)) {
            newErrors.studentId = 'Invalid Student ID format (e.g., 21-1476-291)';
        }

        // Validate Email
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Validate Password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        // Validate Confirm Password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createUserWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('Registration successful:', formData);
            alert('Registration successful!');
            // Clear form
            setFormData({ studentId: '', email: '', password: '', confirmPassword: '' });
        }
    };

    return (
        <Paper elevation={24} 
            style={{ 
            marginTop: '50px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '30px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'}}>
            <Typography fontStyle={inter} variant="h5" align="center" gutterBottom style={{marginBottom: '80px',}}>
                Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        variant="filled"
                        label="Student ID"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.studentId}
                        helperText={errors.studentId}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        variant="filled"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <TextField
                        variant="filled"
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                </div>
                <div style={{ marginBottom: '50px' }}>
                    <TextField
                        color="primary"
                        variant="filled"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                </div>
                <Button type="submit" variant="contained" color="success"  >
                    Register
                </Button>
            </form>
        </Paper>
    );
};

export default LoginSignup;
