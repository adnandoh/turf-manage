import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Grid,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as ThemeIcon,
  Language as LanguageIcon,
  Storage as BackupIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingAlerts: true,
      maintenanceAlerts: true,
    },
    general: {
      siteName: 'TurfBook Admin',
      timezone: 'Asia/Kolkata',
      language: 'English',
      dateFormat: 'DD/MM/YYYY',
    },
    booking: {
      autoConfirm: false,
      allowCancellation: true,
      cancellationWindow: 24,
      maxAdvanceBooking: 30,
    },
    pricing: {
      cricketMorning: 1500,
      cricketEvening: 2000,
      pickleballMorning: 800,
      pickleballEvening: 1200,
    },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    enqueueSnackbar('Settings saved successfully!', { variant: 'success' });
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your application preferences and configurations.
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab label="General" />
          <Tab label="Notifications" />
          <Tab label="Booking Rules" />
          <Tab label="Pricing" />
          <Tab label="Backup & Export" />
        </Tabs>

        {/* General Settings */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Site Information
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Site Name"
                        value={settings.general.siteName}
                        onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Timezone"
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Language"
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Date Format"
                        value={settings.general.dateFormat}
                        onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Admin Profile
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
                        A
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Admin User
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          admin@turfbook.com
                        </Typography>
                        <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                          Edit Profile
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ px: 3 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Notification Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive notifications via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="SMS Notifications"
                      secondary="Receive notifications via SMS"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive browser push notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Booking Alerts"
                      secondary="Get notified about new bookings"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.bookingAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'bookingAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Maintenance Alerts"
                      secondary="Get notified about maintenance schedules"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications.maintenanceAlerts}
                        onChange={(e) => handleSettingChange('notifications', 'maintenanceAlerts', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Booking Rules */}
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ px: 3 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Booking Configuration
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.booking.autoConfirm}
                          onChange={(e) => handleSettingChange('booking', 'autoConfirm', e.target.checked)}
                        />
                      }
                      label="Auto-confirm bookings"
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.booking.allowCancellation}
                          onChange={(e) => handleSettingChange('booking', 'allowCancellation', e.target.checked)}
                        />
                      }
                      label="Allow booking cancellation"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Cancellation Window (hours)"
                      type="number"
                      value={settings.booking.cancellationWindow}
                      onChange={(e) => handleSettingChange('booking', 'cancellationWindow', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Max Advance Booking (days)"
                      type="number"
                      value={settings.booking.maxAdvanceBooking}
                      onChange={(e) => handleSettingChange('booking', 'maxAdvanceBooking', parseInt(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Pricing */}
        <TabPanel value={activeTab} index={3}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Cricket Pricing
                    </Typography>
                    <TextField
                      fullWidth
                      label="Morning Rate (₹/hour)"
                      type="number"
                      value={settings.pricing.cricketMorning}
                      onChange={(e) => handleSettingChange('pricing', 'cricketMorning', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Evening Rate (₹/hour)"
                      type="number"
                      value={settings.pricing.cricketEvening}
                      onChange={(e) => handleSettingChange('pricing', 'cricketEvening', parseInt(e.target.value))}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Pickleball Pricing
                    </Typography>
                    <TextField
                      fullWidth
                      label="Morning Rate (₹/hour)"
                      type="number"
                      value={settings.pricing.pickleballMorning}
                      onChange={(e) => handleSettingChange('pricing', 'pickleballMorning', parseInt(e.target.value))}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Evening Rate (₹/hour)"
                      type="number"
                      value={settings.pricing.pickleballEvening}
                      onChange={(e) => handleSettingChange('pricing', 'pickleballEvening', parseInt(e.target.value))}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Backup & Export */}
        <TabPanel value={activeTab} index={4}>
          <Box sx={{ px: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Data Export
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Export your booking data for backup or analysis purposes.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Export Bookings (CSV)
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Export Users (CSV)
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Export Full Backup
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Data Import
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Import data from backup files or external sources.
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Importing data will overwrite existing records. Please backup your data first.
                    </Alert>
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      fullWidth
                      color="warning"
                    >
                      Import Backup File
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Save Button */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            sx={{ minWidth: 120 }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;