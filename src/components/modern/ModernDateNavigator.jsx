import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

const ModernDateNavigator = ({ currentDate, onPrevDay, onNextDay }) => {
  const theme = useTheme();

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE');
  };

  const getDateChipColor = (date) => {
    if (isToday(date)) return 'primary';
    if (isTomorrow(date)) return 'success';
    return 'default';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TodayIcon sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {format(currentDate, 'MMMM d, yyyy')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getDateLabel(currentDate)}
                color={getDateChipColor(currentDate)}
                size="small"
                sx={{ fontWeight: 500 }}
              />
              <Typography variant="body2" color="text.secondary">
                {format(currentDate, 'EEEE')}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onPrevDay}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.300',
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.main',
                color: 'primary.main',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={onNextDay}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'grey.300',
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.main',
                color: 'primary.main',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ModernDateNavigator;