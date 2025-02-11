// Import React and necessary hooks
import React, { useState } from 'react';
import './LoginSignup.css';
import { Paper, TextField, Button, Typography, CircularProgress  } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs  } from "firebase/firestore"; 

const cache = createCache({
    key: 'css',
    prepend: true,
});



const LoginSignup = () => {
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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

        try {

        } catch (error) {
            alert(error.message);
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //Firebase Stuff
    const handleSubmit = async (e) => {
        const newErrors = {};
        let hasError = false;
        e.preventDefault();
        if (validateForm()) {
            try {
                setDisabled(true);
                // Check if email already exists in Firestore
                const docRef = doc(db, "Dataset", formData.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    //alert("Email already in use");
                    newErrors.email = 'Email already in use';
                    
                    hasError = true;
                    setDisabled(false);
                }
    
                // Check if student ID is already linked to another email
                const q = query(collection(db, "Dataset"), where("id", "==", formData.studentId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    //alert("ID Number is already linked to an email");
                    newErrors.studentId = 'ID Number is already linked to an email';
                    hasError = true;
                    setDisabled(false);
                }

                if(hasError) {
                    setErrors(newErrors);
                    return;
                }
    
                // Create the user in Firebase Authentication
                await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    
                // Add user data to Firestore
                const data = {
                    email: formData.email,
                    id: formData.studentId,
                    personalitySummary: 'None',
                    major: 'None'
                };
                await setDoc(doc(db, "Dataset", data.email), data);
    
                // Reset form and navigate
                setDisabled(false);
                setFormData({ studentId: '', email: '', password: '', confirmPassword: '' });
                console.log('Registration successful:', formData);
                alert('Registration successful!');
                navigate('/');
            } catch (error) {
                if(error.code === 'auth/weak-password') {
                    newErrors.password = 'Weak password. Password should be at least 6 characters';
                }
                setDisabled(false);
                setErrors(newErrors);
                //alert(error.message);
            }
        }
    };    

    return (
        <CacheProvider value={cache}>
            <Paper elevation={24} className="paperContainer">
                <Typography variant="h5" className="typographyHeader">
                    Create an Account
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div className="inputField">
                        <TextField
                            variant="filled"
                            label="Student ID"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.studentId}
                            helperText={errors.studentId}
                            className="textFieldRoot"
                        />
                    </div>
                    <div className="inputField">
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
                            className="textFieldRoot"
                        />
                    </div>
                    <div className="inputField">
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
                            className="textFieldRoot"
                        />
                    </div>
                    <div className="inputField">
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
                            className="textFieldRoot"
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        className="button"
                        disabled={disabled}
                    >
                        {!disabled &&
                            (<>Sign Up</>)
                        }
                        {disabled &&
                            <CircularProgress color="inherit" size="30px"/>
                        }
                    </Button>
                </form>
                <div className='signIn'>
                    <Link to="/" className='signIn'>
                        Already have an account? Sign In
                    </Link>
                </div>
            </Paper>
        </CacheProvider>
    );
};

export default LoginSignup;
