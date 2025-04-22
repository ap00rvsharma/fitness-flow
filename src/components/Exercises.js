import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { 
  Box, 
  Stack, 
  Typography, 
  Container, 
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import ExerciseCard from './ExerciseCard';
import Loader from './Loader';

// Styled components
const ExercisesContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#121212',
  color: theme.palette.common.white,
  padding: theme.spacing(6, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  marginBottom: theme.spacing(6),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: 0,
    width: '60px',
    height: '4px',
    backgroundColor: '#9333ea',
    borderRadius: '2px',
  },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: '#d1d5db',
    '&.Mui-selected': {
      backgroundColor: '#9333ea',
      color: 'white',
      '&:hover': {
        backgroundColor: '#7e22ce',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
    },
  },
}));

const ResultsCount = styled(Typography)(({ theme }) => ({
  color: '#9ca3af',
  marginBottom: theme.spacing(3),
}));

const Exercises = ({ exercises, setExercises, bodyPart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchExercisesData = async () => {
      setIsLoading(true);
      let exercisesData = [];

      try {
        if (bodyPart === 'all') {
          exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
        } else {
          exercisesData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, exerciseOptions);
        }

        setExercises(exercisesData);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercisesData();
  }, [bodyPart, setExercises]);

  // Pagination
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises?.slice(indexOfFirstExercise, indexOfLastExercise);

  const paginate = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: 'smooth' });
  };

  if (isLoading) return <Loader />;

  return (
    <ExercisesContainer id="exercises">
      <Container maxWidth="xl">
        <Box sx={{ mb: 6 }}>
          <SectionTitle 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.8rem', md: '2.2rem', lg: '2.5rem' } 
            }}
          >
            Exercise Results
          </SectionTitle>
          
          <ResultsCount>
            {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} found
            {bodyPart !== 'all' && ` for ${bodyPart}`}
          </ResultsCount>
        </Box>

        {currentExercises.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            backgroundColor: '#1e1b24', 
            borderRadius: '12px',
            mt: 4
          }}>
            <Typography variant="h6" sx={{ color: '#9ca3af' }}>
              No exercises found. Try a different search.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentExercises.map((exercise, idx) => (
                <Grid item xs={12} sm={6} lg={4} key={idx}>
                  <ExerciseCard exercise={exercise} />
                </Grid>
              ))}
            </Grid>
            
            <Stack sx={{ mt: { xs: 5, lg: 8 } }} alignItems="center">
              {exercises.length > exercisesPerPage && (
                <StyledPagination
                  shape="rounded"
                  defaultPage={1}
                  count={Math.ceil(exercises.length / exercisesPerPage)}
                  page={currentPage}
                  onChange={paginate}
                  size={isMobile ? "medium" : "large"}
                  sx={{ 
                    '& .MuiPaginationItem-root': { 
                      color: 'white',
                    }
                  }}
                />
              )}
            </Stack>
          </>
        )}
      </Container>
    </ExercisesContainer>
  );
};

export default Exercises;