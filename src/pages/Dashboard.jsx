import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  SportsCricket as CricketIcon,
  SportsBaseball as PickleballIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  EventBusy as BlockedIcon,
  Schedule as ScheduleIcon,
  AttachMoney as RevenueIcon,
  MoreVert as MoreIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { dashboardService } from '../api/api';

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayBookings: { cricket: 0, pickleball: 0 },
    weeklyBookings: { cricket: 0, pickleball: 0 },
    availableSlots: { cricket: 0, pickleball: 0 },
    totalSlots: { cricket: 0, pickleball: 0 },
    blockedSlots: { cricket: 0, pickleball: 0 },
    revenue: { today: 0, week: 0 },
    recentBookings: [],
    totalUsers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Fetching dashboard data...');
      console.log('Auth token:', localStorage.getItem('auth_token') ? 'Present' : 'Missing');
      
      const response = await dashboardService.getDashboardData();
      console.log('Dashboard API Response:', response.data);
      
      setDashboardData({
        todayBookings: response.data.todayBookings || { cricket: 0, pickleball: 0 },
        weeklyBookings: response.data.weeklyBookings || { cricket: 0, pickleball: 0 },
        availableSlots: response.data.availableSlots || { cricket: 0, pickleball: 0 },
        totalSlots: response.data.totalSlots || { cricket: 0, pickleball: 0 },
        blockedSlots: response.data.blockedSlots || { cricket: 0, pickleball: 0 },
        revenue: response.data.revenue || { today: 0, week: 0 },
        recentBookings: response.data.recentBookings || [],
        totalUsers: response.data.totalUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`,
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: trend === 'up' ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {trendValue}% from last week
                </Typography>
              </Box>
            )}
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

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Dashboard
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your turf bookings today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
          <StatCard
            title="Today's Bookings"
            value={dashboardData.todayBookings.cricket + dashboardData.todayBookings.pickleball}
            subtitle="Total bookings today"
            icon={<ScheduleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
          <StatCard
            title="Available Slots"
            value={dashboardData.availableSlots.cricket + dashboardData.availableSlots.pickleball}
            subtitle="Ready to book today"
            icon={<CalendarIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
          <StatCard
            title="Weekly Revenue"
            value={`₹${(dashboardData.revenue.week / 1000).toFixed(0)}K`}
            subtitle="This week's earnings"
            icon={<RevenueIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
          <StatCard
            title="Total Users"
            value={dashboardData.totalUsers}
            subtitle="Registered customers"
            icon={<PeopleIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
          <StatCard
            title="Blocked Slots"
            value={dashboardData.blockedSlots.cricket + dashboardData.blockedSlots.pickleball}
            subtitle="Currently blocked"
            icon={<BlockedIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sport-specific Stats */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sport Performance
                </Typography>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'success.50',
                      border: '1px solid',
                      borderColor: 'success.200',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 40, height: 40 }}>
                        <CricketIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Cricket
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Today: {dashboardData.todayBookings.cricket} bookings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available: {dashboardData.availableSlots.cricket}/{dashboardData.totalSlots.cricket} slots
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Slot Utilization</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dashboardData.totalSlots.cricket > 0 
                            ? Math.round(((dashboardData.totalSlots.cricket - dashboardData.availableSlots.cricket) / dashboardData.totalSlots.cricket) * 100)
                            : 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={dashboardData.totalSlots.cricket > 0 
                          ? ((dashboardData.totalSlots.cricket - dashboardData.availableSlots.cricket) / dashboardData.totalSlots.cricket) * 100
                          : 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'success.100',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'success.main',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'secondary.50',
                      border: '1px solid',
                      borderColor: 'secondary.200',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 40, height: 40 }}>
                        <PickleballIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Pickleball
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Today: {dashboardData.todayBookings.pickleball} bookings
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available: {dashboardData.availableSlots.pickleball}/{dashboardData.totalSlots.pickleball} slots
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Slot Utilization</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {dashboardData.totalSlots.pickleball > 0 
                            ? Math.round(((dashboardData.totalSlots.pickleball - dashboardData.availableSlots.pickleball) / dashboardData.totalSlots.pickleball) * 100)
                            : 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={dashboardData.totalSlots.pickleball > 0 
                          ? ((dashboardData.totalSlots.pickleball - dashboardData.availableSlots.pickleball) / dashboardData.totalSlots.pickleball) * 100
                          : 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'secondary.100',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'secondary.main',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <QuickActionCard
                    title="Block Dates"
                    description="Block multiple dates for maintenance"
                    icon={<BlockedIcon />}
                    color={theme.palette.error.main}
                    onClick={() => {/* Navigate to block dates */ }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <QuickActionCard
                    title="View Bookings"
                    description="Check today's bookings"
                    icon={<CalendarIcon />}
                    color={theme.palette.primary.main}
                    onClick={() => {/* Navigate to bookings */ }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <QuickActionCard
                    title="Generate Report"
                    description="Download weekly report"
                    icon={<TrendingUpIcon />}
                    color={theme.palette.success.main}
                    onClick={() => {/* Generate report */ }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Bookings
                </Typography>
                <IconButton size="small">
                  <MoreIcon />
                </IconButton>
              </Box>

              <List sx={{ p: 0 }}>
                {dashboardData.recentBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: booking.sport === 'Cricket' ? 'success.main' : 'secondary.main',
                            width: 36,
                            height: 36,
                          }}
                        >
                          {booking.sport === 'Cricket' ? <CricketIcon /> : <PickleballIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {booking.user}
                          </Typography>
                        }
                        secondary={
                          <Box component="div">
                            <Typography variant="caption" color="text.secondary" component="span">
                              {booking.sport} • {booking.time}
                            </Typography>
                            <Chip
                              label={booking.status}
                              size="small"
                              color={booking.status === 'confirmed' ? 'success' : 'warning'}
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < dashboardData.recentBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {/* Navigate to all bookings */ }}
              >
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;