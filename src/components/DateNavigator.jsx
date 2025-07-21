import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DateNavigator = ({ currentDate, onPrevDay, onNextDay }) => {
  return (
    <Paper 
      elevation={1}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3, 
        py: 2, 
        px: { xs: 1, sm: 2 },
        borderRadius: 2,
        bgcolor: '#f9f9f9',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}
    >
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />} 
        onClick={onPrevDay}
        size="small"
        fullWidth={false}
        sx={{ 
          minWidth: { xs: '100%', sm: 'auto' },
          whiteSpace: 'nowrap'
        }}
      >
        PREVIOUS DAY
      </Button>
      
      <Typography 
        variant="h6" 
        component="div"
        align="center"
        sx={{
          fontWeight: 500,
          fontSize: { xs: '1rem', sm: '1.25rem' }
        }}
      >
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </Typography>
      
      <Button 
        variant="outlined" 
        endIcon={<ArrowForwardIcon />} 
        onClick={onNextDay}
        size="small"
        fullWidth={false}
        sx={{ 
          minWidth: { xs: '100%', sm: 'auto' },
          whiteSpace: 'nowrap'
        }}
      >
        NEXT DAY
      </Button>
    </Paper>
  );
};

export default DateNavigator; 