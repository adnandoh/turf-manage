import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Button,
  IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { authService } from '../api/api';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Set the active tab based on the current path
  const value = location.pathname === '/cricket' ? 0 : 1;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Turf Management
      </Typography>
      <List>
        <ListItem button onClick={() => handleNavigation('/cricket')}>
          <ListItemText 
            primary="Cricket" 
            sx={{ 
              color: location.pathname === '/cricket' ? theme.palette.primary.main : 'inherit',
              textAlign: 'center'
            }} 
          />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/pickleball')}>
          <ListItemText 
            primary="Pickleball" 
            sx={{ 
              color: location.pathname === '/pickleball' ? theme.palette.primary.main : 'inherit',
              textAlign: 'center'
            }} 
          />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" sx={{ textAlign: 'center' }} />
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              flexGrow: { xs: 1, sm: 0 },
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Turf Management
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tabs 
                value={value} 
                indicatorColor="secondary"
                textColor="inherit"
              >
                <Tab 
                  label="Cricket" 
                  component={Link} 
                  to="/cricket" 
                />
                <Tab 
                  label="Pickleball" 
                  component={Link} 
                  to="/pickleball" 
                />
              </Tabs>
              
              <Button 
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 2 }}
                startIcon={<ExitToAppIcon />}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 