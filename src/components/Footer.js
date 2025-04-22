import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import Logo from '../assets/images/Logo-1.png';

const Footer = () => (
  <Box mt="40px" bgcolor="#1a0033" py="16px"> {/* dark purple background */}
    <Divider sx={{ mb: 2, backgroundColor: '#5e35b1' }} /> {/* purple divider */}
    <Box display="flex" justifyContent="space-between" alignItems="center" px="24px">
      <img src={Logo} alt="logo" style={{ width: '120px', height: 'auto' }} />
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: { lg: '14px', xs: '12px' },
          color: '#d1c4e9' // light purple text
        }}
      >
        Made with ❤️ by Apoorv, Rubi & Shruti
      </Typography>
    </Box>
  </Box>
);

export default Footer;
