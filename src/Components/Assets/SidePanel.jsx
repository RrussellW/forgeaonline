import {getAuth} from "firebase/auth";
import React, {useEffect, useState} from "react";
import { AppBar, Box, Toolbar } from "@mui/material";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Blink({children}) {
  return(
    <motion.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      exit={{ opacity: 0}}
      transition={{
        duration: 0.4,
      }}
    >
      {children}
    </motion.div>
  )
}

export default function TopPanel() {
    const auth = getAuth();
    const navigate = useNavigate();
    return(
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="flex" sx={{backgroundColor: 'transparent', position: 'fixed',width: '10vw', height: '100vh', boxShadow: 'none'}}>
                <Toolbar>
                    <a onClick={() => navigate('/')}>
                    <img src={require('./forgeaLogoTitle.png')} href="/" alt="Logo" style={{ width: '200px', height: '70px', marginRight: '10px' }}/>
                    </a>
                </Toolbar>
            </AppBar>
            </Box>
    )
}
