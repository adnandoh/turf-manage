import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Fade,
  Avatar,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  EventBusy as EventBusyIcon,
  EventAvailable as EventAvailableIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ModernSlotGrid = ({ slots, onToggleBlock, loading, sportType }) => {
  const [confirmDialog, setConfirmDialog] = useState({ open: false, slot: null, action: null });

  const handleBlockClick = (slot) => {
    const action = slot.is_blocked ? 'unblock' : 'block';
    setConfirmDialog({ open: true, slot, action });
  };

  const handleConfirm = () => {
    if (confirmDialog.slot) {
      onToggleBlock(confirmDialog.slot, 'Blocked by admin');
      setConfirmDialog({ open: false, slot: null, action: null });
    }
  };

  const handleCancel = () => {
    setConfirmDialog({ open: false, slot: null, action: null });
  };

  const getSlotStatus = (slot) => {
    if (slot.is_blocked) return 'blocked';
    if (slot.is_booked) return 'booked';
    return 'available';
  };

  const getSlotColor = (status) => {
    switch (status) {
      case 'blocked': return '#ed6c02';
      case 'booked': return '#9c27b0';
      case 'available': return '#2e7d32';
      default: return '#1976d2';
    }
  };

  const getSlotIcon = (status) => {
    switch (status) {
      case 'blocked': return <EventBusyIcon />;
      case 'booked': return <PersonIcon />;
      case 'available': return <EventAvailableIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getSlotLabel = (status) => {
    switch (status) {
      case 'blocked': return 'Blocked';
      case 'booked': return 'Booked';
      case 'available': return 'Available';
      default: return 'Unknown';
    }
  };

  const formatTimeDisplay = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const SlotCard = ({ slot }) => {
    const status = getSlotStatus(slot);
    const color = getSlotColor(status);
    const icon = getSlotIcon(status);
    const label = getSlotLabel(status);

    return (
      <Card
        sx={{
          height: '100%',
          border: '1px solid',
          borderColor: `${color}30`,
          background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${color}20`,
            borderColor: `${color}50`,
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
                {formatTimeDisplay(slot.start_time, slot.end_time)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  icon={icon}
                  label={label}
                  size="small"
                  sx={{
                    bgcolor: `${color}15`,
                    color: color,
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                      color: color,
                    },
                  }}
                />
              </Box>
              {slot.is_blocked && slot.block_reason && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Reason: {slot.block_reason}
                </Typography>
              )}
              {slot.is_booked && slot.user_name && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Booked by: {slot.user_name}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: `${color}20`,
                color: color,
                width: 36,
                height: 36,
              }}
            >
              {icon}
            </Avatar>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {status === 'available' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<BlockIcon />}
                onClick={() => handleBlockClick(slot)}
                sx={{
                  borderColor: 'warning.main',
                  color: 'warning.main',
                  '&:hover': {
                    borderColor: 'warning.dark',
                    bgcolor: 'warning.light',
                  },
                }}
              >
                Block
              </Button>
            )}
            {status === 'blocked' && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleBlockClick(slot)}
                sx={{
                  borderColor: 'success.main',
                  color: 'success.main',
                  '&:hover': {
                    borderColor: 'success.dark',
                    bgcolor: 'success.light',
                  },
                }}
              >
                Unblock
              </Button>
            )}
            {status === 'booked' && (
              <Tooltip title="Cannot modify booked slots">
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled
                    startIcon={<PersonIcon />}
                  >
                    Booked
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

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
        <ScheduleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No slots available for this date
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try selecting a different date
        </Typography>
      </Box>
    );
  }

  // Group slots by time periods
  const groupedSlots = {
    morning: slots.filter(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      return hour >= 6 && hour < 12;
    }),
    afternoon: slots.filter(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      return hour >= 12 && hour < 18;
    }),
    evening: slots.filter(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      return hour >= 18 && hour < 24;
    }),
    night: slots.filter(slot => {
      const hour = parseInt(slot.start_time.split(':')[0]);
      return hour >= 0 && hour < 6;
    }),
  };

  const renderSlotSection = (title, sectionSlots, icon, color) => {
    if (sectionSlots.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color: color,
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, color: color }}>
            {title} ({sectionSlots.length} slots)
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {sectionSlots.map((slot) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={slot.id || `${slot.date}-${slot.start_time}`}>
              <SlotCard slot={slot} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  return (
    <Fade in={!loading}>
      <Box>
        {renderSlotSection('Morning Slots', groupedSlots.morning, '🌅', '#ff9800')}
        {renderSlotSection('Afternoon Slots', groupedSlots.afternoon, '☀️', '#f57c00')}
        {renderSlotSection('Evening Slots', groupedSlots.evening, '🌆', '#1976d2')}
        {renderSlotSection('Night Slots', groupedSlots.night, '🌙', '#673ab7')}

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={handleCancel}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {confirmDialog.action === 'block' ? 'Block Time Slot' : 'Unblock Time Slot'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {confirmDialog.slot && formatTimeDisplay(confirmDialog.slot.start_time, confirmDialog.slot.end_time)}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="body1">
              {confirmDialog.action === 'block' 
                ? 'Are you sure you want to block this time slot? It will become unavailable for booking.'
                : 'Are you sure you want to unblock this time slot? It will become available for booking again.'
              }
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCancel} color="inherit">
              No, Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              variant="contained"
              color={confirmDialog.action === 'block' ? 'warning' : 'success'}
              startIcon={confirmDialog.action === 'block' ? <BlockIcon /> : <CheckCircleIcon />}
            >
              Yes, {confirmDialog.action === 'block' ? 'Block' : 'Unblock'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default ModernSlotGrid;