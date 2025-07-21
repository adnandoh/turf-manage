import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  SportsBaseball as PickleballIcon,
  CalendarToday as CalendarIcon,
  Block as BlockIcon,
  EventAvailable as AvailableIcon,
  EventBusy as BookedIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import ModernDateNavigator from '../components/modern/ModernDateNavigator';
import ModernSlotGrid from '../components/modern/ModernSlotGrid';
import ModernDateBlocker from '../components/modern/ModernDateBlocker';
import { formatDate, getNextDay, getPreviousDay, generateEmptySlots, createBlockData, mergeSlots } from '../utils/slotUtils';
import { pickleballService } from '../api/api';

const Pickleball = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockingDates, setBlockingDates] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalSlots: 24,
    availableSlots: 0,
    bookedSlots: 0,
    blockedSlots: 0,
  });
  
  const formattedDate = formatDate(currentDate);
  
  const fetchSlots = useCallback(async () => {
    console.log('🏓 PICKLEBALL: fetchSlots called with date:', formattedDate);
    setLoading(true);
    try {
      console.log('🏓 PICKLEBALL: Making API call to:', `/api/pickleball/slots/?date=${formattedDate}`);
      
      // Fetch slots from API (admin gets all slots including blocked ones)
      const response = await pickleballService.getSlots(formattedDate);
      console.log('🏓 PICKLEBALL API Response:', response.data);
      console.log('🏓 PICKLEBALL Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing');
      
      // Use actual API data instead of merging with empty slots
      const apiSlots = response.data || [];
      setSlots(apiSlots);
      
      // Calculate stats from actual API data
      const available = apiSlots.filter(slot => !slot.is_blocked && !slot.is_booked).length;
      const blocked = apiSlots.filter(slot => slot.is_blocked).length;
      const booked = apiSlots.filter(slot => slot.is_booked).length;
      const total = apiSlots.length;
      
      setStats({
        totalSlots: total,
        availableSlots: available,
        bookedSlots: booked,
        blockedSlots: blocked,
      });

      // Debug logging
      console.log('🏓 PICKLEBALL Stats calculated:', {
        total,
        available,
        blocked,
        booked,
        apiSlotsCount: apiSlots.length
      });
      
    } catch (error) {
      console.error('🏓 PICKLEBALL Error fetching slots:', error);
      enqueueSnackbar('Failed to load slots. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [formattedDate, enqueueSnackbar]);
  
  useEffect(() => {
    console.log('🏓 PICKLEBALL: Component mounted/updated, calling fetchSlots');
    fetchSlots();
  }, [fetchSlots]);

  useEffect(() => {
    console.log('🏓 PICKLEBALL: Component mounted');
    return () => {
      console.log('🏓 PICKLEBALL: Component unmounted');
    };
  }, []);
  
  const handlePrevDay = () => {
    setCurrentDate(getPreviousDay(currentDate));
  };
  
  const handleNextDay = () => {
    setCurrentDate(getNextDay(currentDate));
  };
  
  const handleToggleBlock = async (slot, reason = 'Blocked by admin') => {
    try {
      if (slot.is_blocked) {
        // Unblock the slot
        await pickleballService.removeBlock(slot.id);
        enqueueSnackbar('Slot unblocked successfully!', { variant: 'success' });
      } else {
        // Block the slot
        const blockData = createBlockData(
          formattedDate,
          slot.start_time,
          slot.end_time,
          reason
        );
        
        await pickleballService.createBlock(blockData);
        enqueueSnackbar('Slot blocked successfully!', { variant: 'success' });
      }
      
      // Refresh slots after toggling
      fetchSlots();
    } catch (error) {
      console.error('Error toggling slot:', error);
      enqueueSnackbar(
        `Failed to ${slot.is_blocked ? 'unblock' : 'block'} slot. ${error.response?.data?.error || ''}`,
        { variant: 'error' }
      );
    }
  };
  
  const handleBlockDates = async (dates, reason) => {
    setBlockingDates(true);
    try {
      await pickleballService.blockDates(dates, reason);
      enqueueSnackbar(`Successfully blocked ${dates.length} date(s)!`, { variant: 'success' });
      
      // If current date is one of the blocked dates, refresh the slots
      if (dates.includes(formattedDate)) {
        fetchSlots();
      }
    } catch (error) {
      console.error('Error blocking dates:', error);
      enqueueSnackbar('Failed to block dates. Please try again.', { variant: 'error' });
    } finally {
      setBlockingDates(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <PickleballIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Pickleball Court Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage pickleball bookings, slots, and availability for {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSlots}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Slots"
            value={stats.totalSlots}
            subtitle="Available today"
            icon={<CalendarIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available"
            value={stats.availableSlots}
            subtitle="Ready to book"
            icon={<AvailableIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Booked"
            value={stats.bookedSlots}
            subtitle="Reserved slots"
            icon={<BookedIcon />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Blocked"
            value={stats.blockedSlots}
            subtitle="Maintenance/Events"
            icon={<BlockIcon />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 64,
              },
            }}
          >
            <Tab label="Daily Slot Management" />
            <Tab label="Bulk Date Blocking" />
          </Tabs>
        </Box>

        {/* Daily Slot Management */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
            {loading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress />
              </Box>
            )}
            
            <ModernDateNavigator 
              currentDate={currentDate}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
            />
            
            <ModernSlotGrid 
              slots={slots}
              onToggleBlock={handleToggleBlock}
              loading={loading}
              sportType="pickleball"
            />
          </Box>
        </TabPanel>

        {/* Bulk Date Blocking */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Use this feature to block multiple dates at once for maintenance, events, or holidays.
            </Alert>
            <ModernDateBlocker onBlockDates={handleBlockDates} isLoading={blockingDates} />
          </Box>
        </TabPanel>
      </Card>
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={blockingDates}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography sx={{ mt: 2, fontSize: '1.1rem' }}>Processing bulk date blocking...</Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default Pickleball;