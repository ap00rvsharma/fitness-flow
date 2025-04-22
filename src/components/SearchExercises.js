import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Stack, 
  TextField, 
  Typography, 
  InputAdornment,
  Container,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';
import Guide from './Guide';

// Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#121212',
  color: theme.palette.common.white,
  padding: theme.spacing(8, 2),
  borderRadius: '4px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1e1b24',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: '#9333ea',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9333ea',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.palette.common.white,
    fontWeight: 500,
    padding: theme.spacing(2),
  },
  '& .MuiInputLabel-root': {
    color: '#9ca3af',
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#9333ea',
  color: theme.palette.common.white,
  borderRadius: '0 12px 12px 0',
  padding: theme.spacing(2, 4),
  '&:hover': {
    backgroundColor: '#7e22ce',
  },
  position: 'absolute',
  right: 0,
  height: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(6),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    backgroundColor: '#9333ea',
    borderRadius: '2px',
  },
}));

const ScrollbarContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1e1b24',
  borderRadius: '12px',
  padding: theme.spacing(3),
  marginTop: theme.spacing(6),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
}));

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);

      setBodyParts(['all', ...bodyPartsData]);
    };

    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

      const searchedExercises = exercisesData.filter(
        (item) => item.name.toLowerCase().includes(search)
               || item.target.toLowerCase().includes(search)
               || item.equipment.toLowerCase().includes(search)
               || item.bodyPart.toLowerCase().includes(search),
      );

      window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });

      setSearch('');
      setExercises(searchedExercises);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchContainer>
      <Container maxWidth="xl">
        <Stack alignItems="center" justifyContent="center" spacing={4}>
          <SectionTitle 
            variant="h3" 
            align="center"
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              mb: 5,
              color: 'white'
            }}
          >
            Discover Effective <Box component="span" sx={{ color: '#c084fc' }}>Workouts</Box>
          </SectionTitle>

          <Guide />
          
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              maxWidth: '800px',
              color: '#d1d5db',
              mb: 4,
              fontWeight: 400
            }}
          >
            Search from over 1,300 exercises with detailed instructions and videos
          </Typography>
          
          <Box position="relative" width="100%" maxWidth="900px" mb={4}>
            <StyledTextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              placeholder="Search exercises, muscle groups, or equipment"
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />
            <SearchButton 
              onClick={handleSearch}
              sx={{ 
                fontSize: { xs: '0.9rem', md: '1rem' },
                width: { xs: '80px', md: '120px' },
              }}
            >
              Search
            </SearchButton>
          </Box>
          
          <ScrollbarContainer elevation={0} sx={{ width: '100%' }}>
            <Typography 
              variant="h6" 
              sx={{ mb: 3, color: 'white', fontWeight: 600 }}
            >
              Filter by Body Part
            </Typography>
            
            <Box sx={{ width: '100%' }}>
              <HorizontalScrollbar 
                data={bodyParts} 
                bodyParts 
                setBodyPart={setBodyPart} 
                bodyPart={bodyPart} 
              />
            </Box>
          </ScrollbarContainer>
        </Stack>
      </Container>
    </SearchContainer>
  );
};

export default SearchExercises;