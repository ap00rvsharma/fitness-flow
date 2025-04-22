import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Dark purplish theme configuration
const darkPurpleTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Deep purple
    },
    background: {
      default: '#1a1a2e', // Very dark purple
      paper: '#2e2e48',   // Card color
    },
    text: {
      primary: '#ffffff',
      secondary: '#b39ddb',
    },
  },
  typography: {
    fontFamily: `'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
});

// Guide data
const data = [
  {
    title: 'Beginners',
    dos: [
      'Start with light cardio and stretching.',
      'Focus on form rather than weight.',
      'Follow a balanced full-body routine.',
    ],
    donts: [
      'Don’t lift heavy weights immediately.',
      'Avoid skipping warm-ups.',
      'Don’t ignore rest days.',
    ],
  },
  {
    title: 'Intermediate',
    dos: [
      'Progressively overload your workouts.',
      'Split workouts by muscle groups.',
      'Track progress regularly.',
    ],
    donts: [
      'Don’t overtrain without proper recovery.',
      'Avoid comparing with professionals.',
      'Don’t neglect mobility work.',
    ],
  },
  {
    title: 'Professional',
    dos: [
      'Optimize nutrition and hydration.',
      'Periodize training for goals.',
      'Include deload weeks.',
    ],
    donts: [
      'Avoid ego lifting.',
      'Don’t ignore minor injuries.',
      'Avoid training without clear goals.',
    ],
  },
  {
    title: 'Diabetic Individuals',
    dos: [
      'Monitor blood sugar before and after workouts.',
      'Carry a quick sugar source.',
      'Prefer consistent timing and intensity.',
    ],
    donts: [
      'Don’t work out on an empty stomach.',
      'Avoid skipping medications.',
      'Don’t ignore signs of hypoglycemia.',
    ],
  },
  {
    title: 'Cardiac Patients',
    dos: [
      'Follow a doctor-approved program.',
      'Include low-impact aerobic exercises.',
      'Warm up and cool down thoroughly.',
    ],
    donts: [
      'Don’t do high-intensity interval training (HIIT) without clearance.',
      'Avoid heavy lifting.',
      'Don’t ignore chest discomfort or shortness of breath.',
    ],
  },
];

// Main component
const Guide = () => {
  return (
    <ThemeProvider theme={darkPurpleTheme}>
      <CssBaseline />
      <Container maxWidth="md" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Exercise Guide: Do's and Don'ts
        </Typography>

        {data.map((group, index) => (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="white">{group.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary">✅ Do's</Typography>
                  <List dense>
                    {group.dos.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemText  primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" color="secondary">🚫 Don'ts</Typography>
                  <List dense>
                    {group.donts.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </ThemeProvider>
  );
};

export default Guide;
