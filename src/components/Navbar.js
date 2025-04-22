import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Button, 
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import {useAuth, useUser, SignInButton, UserButton} from "@clerk/clerk-react"

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#121212',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const NavButton = styled(Button)(({ active, theme }) => ({
  color: '#fff',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  textTransform: 'none',
  fontSize: '18px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#c084fc',
  },
  ...(active && {
    color: '#c084fc',
    borderBottom: '3px solid #9333ea',
  }),
}));

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {isSignedIn, userId} = useAuth()
  const {isLoaded, user} = useUser()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  if (!isLoaded) {
    return <div style={{color:"white"}}>Loading.....</div>
  }

  const navItems = [
    { name: 'Home', path: '/', active: true },
    { name: 'Tracker', path: '/fitness-flow', active: false },
    { name: 'Exercises', path: '#exercises', active: false },
  ];

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo - always visible */}
          <LogoContainer sx={{ display: 'flex', mr: 2 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box sx={{ 
                bgcolor: '#9333ea', 
                p: 1, 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <FitnessCenterIcon sx={{ color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: 'white',
                  textDecoration: 'none',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                FITNESS FLOW
              </Typography>
            </Link>
          </LogoContainer>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: '#1e1b24',
                  color: 'white',
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={item.path}
                  sx={{
                    ...(item.active && {
                      color: '#c084fc',
                    }),
                  }}
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo text only for mobile */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              display: { xs: 'flex', md: 'none' }
            }}
          >
            FITNESS FLOW
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {navItems.map((item) => (
              <NavButton
                key={item.name}
                component={Link}
                to={item.path}
                onClick={handleCloseNavMenu}
                active={item.active ? 1 : 0}
              >
                {item.name}
              </NavButton>
            ))}
            {user?<UserButton/>:<SignInButton/>}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;