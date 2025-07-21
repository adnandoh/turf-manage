import React, { useState } from 'react';
import { 
  Box, Paper, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, CircularProgress,
  Alert, Chip, Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../utils/slotUtils';

const DateBlocker = ({ onBlockDates, isLoading }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleAddDate = () => {
    if (!currentDate) return;
    
    const formattedDate = formatDate(currentDate);
    
    // Check if date already exists in the array
    if (selectedDates.some(date => date === formattedDate)) {
      setError('This date is already selected');
      return;
    }
    
    setSelectedDates([...selectedDates, formattedDate]);
    setCurrentDate(null);
    setError('');
  };

  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
  };

  const handleOpenDialog = () => {
    if (selectedDates.length === 0) {
      setError('Please select at least one date to block');
      return;
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleBlockDates = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for blocking these dates');
      return;
    }
    
    onBlockDates(selectedDates, reason);
    setOpen(false);
    // Clear selections after successful blocking
    setSelectedDates([]);
    setReason('');
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <EventBusyIcon sx={{ mr: 1 }} /> Block Multiple Dates
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Select dates to block all slots for those days
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: 2,
        mb: 3,
        alignItems: { xs: 'stretch', sm: 'flex-start' }
      }}>
        <DatePicker
          label="Select Date"
          value={currentDate}
          onChange={(newValue) => setCurrentDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
          disablePast
          sx={{ flexGrow: 1 }}
        />
        
        <Button 
          variant="outlined" 
          onClick={handleAddDate}
          sx={{ 
            minWidth: { xs: '100%', sm: '120px' },
            height: { sm: '56px' }
          }}
        >
          Add Date
        </Button>
      </Box>
      
      {selectedDates.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Dates:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedDates.map(date => (
              <Chip
                key={date}
                label={date}
                onDelete={() => handleRemoveDate(date)}
                deleteIcon={<DeleteIcon />}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}
      
      <Button 
        variant="contained" 
        color="error" 
        onClick={handleOpenDialog}
        disabled={selectedDates.length === 0 || isLoading}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EventBusyIcon />}
        fullWidth
        sx={{ mt: 1 }}
      >
        {isLoading ? 'Processing...' : 'Block Selected Dates'}
      </Button>
      
      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>Block Multiple Dates</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to block all slots for the following dates?
          </Typography>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 1,
            mb: 3
          }}>
            {selectedDates.map(date => (
              <Typography key={date} variant="body2">
                • {date}
              </Typography>
            ))}
          </Box>
          
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason for blocking"
            type="text"
            fullWidth
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleCloseDialog} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleBlockDates} 
            color="error" 
            variant="contained"
            startIcon={<EventBusyIcon />}
          >
            Confirm Block
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DateBlocker; 