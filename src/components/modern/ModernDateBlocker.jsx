import React, { useState } from 'react';
import { 
  Box, 
  Card,
  CardContent,
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  CircularProgress,
  Alert, 
  Chip, 
  Stack,
  Grid,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  EventBusy as EventBusyIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { formatDate } from '../../utils/slotUtils';

const ModernDateBlocker = ({ onBlockDates, isLoading }) => {
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
    setError('');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setReason('');
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
    setError('');
  };

  const quickReasons = [
    'Maintenance',
    'Private Event',
    'Holiday',
    'Equipment Repair',
    'Weather Conditions',
    'Staff Training',
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Date Selection Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1976d215 0%, #1976d205 100%)',
              border: '1px solid #1976d220',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Select Dates to Block
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose multiple dates for bulk blocking
                  </Typography>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <DatePicker
                  label="Select Date"
                  value={currentDate}
                  onChange={(newValue) => setCurrentDate(newValue)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      sx: { mb: 2 }
                    } 
                  }}
                  disablePast
                />
                
                <Button 
                  variant="contained"
                  onClick={handleAddDate}
                  disabled={!currentDate}
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Add Date
                </Button>
              </Box>

              {selectedDates.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Selected Dates ({selectedDates.length}):
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedDates.map(date => (
                      <Chip
                        key={date}
                        label={format(new Date(date), 'MMM d, yyyy')}
                        onDelete={() => handleRemoveDate(date)}
                        deleteIcon={<DeleteIcon />}
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ed6c0215 0%, #ed6c0205 100%)',
              border: '1px solid #ed6c0220',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'warning.main',
                    mr: 2,
                    width: 48,
                    height: 48,
                  }}
                >
                  <EventBusyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Bulk Date Blocking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Block all slots for selected dates
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                This will block all 24-hour slots for the selected dates. Existing bookings will not be affected.
              </Alert>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="warning"
                  onClick={handleOpenDialog}
                  disabled={selectedDates.length === 0 || isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EventBusyIcon />}
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? 'Processing...' : `Block ${selectedDates.length} Date${selectedDates.length !== 1 ? 's' : ''}`}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
              <WarningIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Confirm Bulk Date Blocking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action will block all slots for the selected dates
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              You are about to block <strong>{selectedDates.length} date(s)</strong> with all their time slots.
              This action cannot be undone easily.
            </Typography>
          </Alert>

          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            mb: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Dates to be blocked:
            </Typography>
            {selectedDates.map(date => (
              <Typography key={date} variant="body2" sx={{ mb: 0.5 }}>
                • {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </Typography>
            ))}
          </Box>

          <TextField
            autoFocus
            fullWidth
            label="Reason for blocking *"
            placeholder="Enter the reason for blocking these dates..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Quick reasons:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {quickReasons.map((quickReason) => (
                <Chip
                  key={quickReason}
                  label={quickReason}
                  onClick={() => setReason(quickReason)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      borderColor: 'primary.main',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleBlockDates} 
            color="warning" 
            variant="contained"
            disabled={!reason.trim()}
            startIcon={<EventBusyIcon />}
          >
            Confirm Block
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModernDateBlocker;