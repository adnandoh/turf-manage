import React from 'react';
import { Grid, Box, Typography, CircularProgress, Fade } from '@mui/material';
import SlotCard from './SlotCard';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const SlotGrid = ({ slots, onToggleBlock, loading }) => {
  if (loading) {
    return (
      <Fade in={loading}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          height="50vh"
          sx={{ py: 8 }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            Loading slots...
          </Typography>
        </Box>
      </Fade>
    );
  }
  
  if (!slots || slots.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="40vh"
        sx={{ py: 6 }}
      >
        <HourglassEmptyIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No slots available for this date
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try selecting a different date
        </Typography>
      </Box>
    );
  }
  
  // Group slots by morning, afternoon, evening
  const morningSlots = slots.filter(slot => {
    const hour = parseInt(slot.start_time.split(':')[0]);
    return hour >= 0 && hour < 12;
  });
  
  const afternoonSlots = slots.filter(slot => {
    const hour = parseInt(slot.start_time.split(':')[0]);
    return hour >= 12 && hour < 18;
  });
  
  const eveningSlots = slots.filter(slot => {
    const hour = parseInt(slot.start_time.split(':')[0]);
    return hour >= 18 && hour < 24;
  });
  
  const renderSlotSection = (title, sectionSlots, icon) => (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {icon}
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ ml: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          {title}
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {sectionSlots.map((slot) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={slot.id || `${slot.date}-${slot.start_time}`}
            sx={{ display: 'flex' }}
          >
            <SlotCard slot={slot} onToggleBlock={onToggleBlock} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
  
  return (
    <Fade in={!loading}>
      <Box sx={{ mt: 3 }}>
        {morningSlots.length > 0 && renderSlotSection(
          'Morning Slots (12 AM - 12 PM)', 
          morningSlots,
          <AccessTimeFilledIcon color="primary" />
        )}
        
        {afternoonSlots.length > 0 && renderSlotSection(
          'Afternoon Slots (12 PM - 6 PM)', 
          afternoonSlots,
          <AccessTimeFilledIcon color="secondary" />
        )}
        
        {eveningSlots.length > 0 && renderSlotSection(
          'Evening Slots (6 PM - 12 AM)', 
          eveningSlots,
          <AccessTimeFilledIcon color="error" />
        )}
      </Box>
    </Fade>
  );
};

export default SlotGrid; 