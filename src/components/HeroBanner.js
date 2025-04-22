import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components using MUI system
const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #121212 0%, #2e1065 50%, #121212 100%)',
  position: 'relative',
  overflow: 'hidden',
  color: theme.palette.common.white,
}));

const AccentButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#9333ea', // Purple equivalent
  color: theme.palette.common.white,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '18px',
  '&:hover': {
    backgroundColor: '#7e22ce',
  },
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  color: '#c084fc',
  borderColor: '#9333ea',
  textTransform: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '18px',
  '&:hover': {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
}));

const Badge = styled(Box)(({ theme }) => ({
  backgroundColor: '#581c87',
  color: '#f3e8ff',
  padding: '6px 12px',
  borderRadius: '20px',
  display: 'inline-block',
  fontWeight: 600,
  fontSize: '14px',
  marginBottom: theme.spacing(3),
}));

const CircleDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '-16px',
  right: '-16px',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#9333ea',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '12px',
}));

const StatsBox = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e1b24',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.common.white,
  borderRadius: '8px',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '320px',
  height: '320px',
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    width: '380px',
    height: '380px',
  },
}));

const RoundedImage = styled('img')(({ theme }) => ({
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  border: '4px solid #9333ea',
  boxShadow: theme.shadows[10],
}));

const HeroBanner = () => {
  return (
    <GradientBackground>
      {/* Background text */}
      <Typography
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          fontSize: '180px',
          fontWeight: 800,
          color: '#3b0764',
          opacity: 0.1,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        FITNESS
      </Typography>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Text Content */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Badge>FITNESS FLOW</Badge>
            
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2,
                mb: 3
              }}
            >
              Transform Your Body, <br />
              <Box component="span" sx={{ color: '#c084fc' }}>Elevate Your Mind</Box>
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#d1d5db', 
                mb: 4,   
                maxWidth: '600px',
                fontWeight: 400
              }}
            >
              Discover personalized workout routines designed for your specific goals and fitness level.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <AccentButton href="#exercises" variant="contained">
                Explore Workouts
              </AccentButton>
              <OutlineButton href="#plans" variant="outlined">
                View Plans
              </OutlineButton>
            </Box>
          </Grid>
          
          {/* Image Section */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} 
            sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}
          >
            <ImageContainer>
              {/* <RoundedImage 
                src="/api/placeholder/400/400"
                alt="Fitness athlete"
              /> */}
              <CircleDecoration>
                <Typography variant="subtitle2" align="center">
                  START TODAY
                </Typography>
              </CircleDecoration>
            </ImageContainer>
          </Grid>
        </Grid>
      </Container>

      {/* Stats section */}
      <Box sx={{ backgroundColor: '#0f0f13', borderTop: '1px solid #27272a', py: 3 }}>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            {[
              { value: '500+', label: 'Workouts' },
              { value: '50k+', label: 'Members' },
              { value: '100%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <StatsBox elevation={0}>
                  <Typography variant="h4" sx={{ color: '#c084fc', fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    {stat.label}
                  </Typography>
                </StatsBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </GradientBackground>
  );
};

export default HeroBanner;