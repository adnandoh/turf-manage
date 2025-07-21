import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Button, 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Box, Chip
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatTimeDisplay } from '../utils/slotUtils';

const SlotCard = ({ slot, onToggleBlock }) => {
  const { start_time, end_time, is_blocked, block_reason } = slot;
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(block_reason || 'Blocked by admin');

  const handleOpen = () => {
    if (!is_blocked) {
      setOpen(true);
    } else {
      // If already blocked, show confirmation dialog
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBlock = () => {
    onToggleBlock(slot, reason);
    setOpen(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: 2,
          bgcolor: is_blocked ? '#ffebee' : '#e8f5e9',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 3
          },
          position: 'relative',
          width: '100%',
          borderRadius: 2,
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ 
          p: { xs: 2, sm: 3 },
          '&:last-child': { pb: { xs: 2, sm: 3 } },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon 
              color={is_blocked ? "error" : "success"} 
              sx={{ mr: 1, fontSize: '1.2rem' }}
            />
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {formatTimeDisplay(start_time)} - {formatTimeDisplay(end_time)}
            </Typography>
          </Box>
          
          {is_blocked && block_reason && (
            <Chip 
              label={`Reason: ${block_reason}`}
              size="small"
              color="error"
              variant="outlined"
              sx={{ mt: 1, mb: 1 }}
            />
          )}
          
          <Button
            variant={is_blocked ? "contained" : "contained"}
            color={is_blocked ? "error" : "success"}
            startIcon={is_blocked ? <BlockIcon /> : <CheckCircleIcon />}
            onClick={handleOpen}
            fullWidth
            size="large"
            sx={{ 
              mt: 'auto',
              py: 1,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 2,
              fontSize: '0.95rem'
            }}
          >
            {is_blocked ? 'UNBLOCK SLOT' : 'BLOCK SLOT'}
          </Button>
        </CardContent>
      </Card>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>
          {is_blocked ? 'Unblock Time Slot' : 'Block Time Slot'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {is_blocked 
              ? 'Are you sure you want to unblock this slot?' 
              : 'Are you sure you want to block this slot?'
            }
          </Typography>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: 'background.default', 
            borderRadius: 1,
            mb: 2
          }}>
            <Typography variant="subtitle2" color="text.secondary">
              Date: {slot.date}
            </Typography>
            <Typography variant="subtitle1" fontWeight={500}>
              Time: {formatTimeDisplay(start_time)} - {formatTimeDisplay(end_time)}
            </Typography>
          </Box>
          
          {!is_blocked && (
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
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleBlock} 
            color={is_blocked ? "error" : "success"} 
            variant="contained"
            startIcon={is_blocked ? <BlockIcon /> : <CheckCircleIcon />}
          >
            {is_blocked ? 'Confirm Unblock' : 'Confirm Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SlotCard; 