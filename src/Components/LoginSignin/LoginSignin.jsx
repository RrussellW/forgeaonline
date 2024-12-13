// Import React and necessary hooks
import React, { useState } from 'react';
import './LoginSignin.css';
import { Paper, TextField, Button, Typography } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs  } from "firebase/firestore";
import { db } from '../../firebase';

const cache = createCache({
    key: 'css',
    prepend: true,
});

const LoginSignin = () => {
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [firebaseError, setFirebaseError] = useState(null);
    const navigate = useNavigate(); // For redirecting on successful login

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate Email
        if (!formData.email) {
            newErrors.email = 'Email is required';
            setDisabled(false);
        } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            setDisabled(false);
        }

        // Validate Password
        if (!formData.password) {
            newErrors.password = 'Password is required';
            setDisabled(false);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        const newErrors = {};
        setFirebaseError(null)
        e.preventDefault();
        setDisabled(true);
        if (validateForm()) {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, formData.email, formData.password)
                .then(async() => {
                    const q = query(collection(db, "Users"), where("email", "==", formData.email));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        const dataMobile = {
                            email: formData.email,
                            percentD: 0,
                            percentI: 0,
                            percentS: 0,
                            percentW: 0,
                            personalitySummary: 'NONE',
                            type: 1,
                        };
                    await setDoc(doc(db, "Users", formData.email), dataMobile, {merge: true});
                    }
                    console.log('Login successful');
                    setDisabled(false);
                    navigate('/PersonalInfo'); // Redirect to the dashboard or another page
                })
                .catch((error) => {
                    setDisabled(false);
                    const errorCode = error.code;
                    if (errorCode === 'auth/wrong-password') {
                        setFirebaseError('Incorrect password');
                    } else if (errorCode === 'auth/user-not-found') {
                        setFirebaseError('No user found with this email');
                    } else if (errorCode === 'auth/invalid-credential') {
                        newErrors.password = 'Invalid credentials, check email or password';
                        setErrors(newErrors);
                        //setFirebaseError('Invalid credentials');
                    } else {
                        //alert(error.code)
                        setFirebaseError('Login failed, please try again');
                    }
                });
        }
    };

    return (
        <CacheProvider value={cache}>
            <Paper elevation={24} className="paperContainer">
                <Typography variant="h5" className="typographyHeader">
                    Forgea Login
                </Typography>
                <form onSubmit={handleSubmit}>
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
                    {firebaseError && (
                        <Typography color="error" className="firebaseError">
                            {firebaseError}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        className="button"
                        disabled={disabled}
                    >
                        Sign In
                    </Button>
                </form>
                <div className='signIn'>
                    <Link to="/signup" className='signIn'>
                        Don't have an account? Sign Up
                    </Link>
                </div>
            </Paper>
        </CacheProvider>
    );
};

export default LoginSignin;
