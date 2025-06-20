import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Box,
  Divider,
  Paper,
  Chip,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  SelectAll as SelectAllIcon
} from '@mui/icons-material';

const UnlimitedPackageModal = ({ open, onClose, onSubmit, packageData = [] }) => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState('');
  const [packageAmount, setPackageAmount] = useState('');
  console.log(packageData,"modal")
  
  const handleAddActivity = () => {
    if (currentActivity && !selectedActivities.find(item => item.id === currentActivity._id)) {
      setSelectedActivities([
        ...selectedActivities,
        {
          id: currentActivity._id,
          name: currentActivity.name,
          coins_required: currentActivity.coins_required,
          count: 1,
          amount: 0,
          isUnlimited: false
        }
      ]);
      setCurrentActivity('');
    }
  };

  const handleSelectAllActivities = () => {
    const allActivities = packageData.map(pkg => ({
      id: pkg._id,
      name: pkg.name,
      coins_required: pkg.coins_required,
      count: 1,
      amount: 0,
      isUnlimited: false
    }));
    setSelectedActivities(allActivities);
    setCurrentActivity('');
  };

  const handleCountChange = (activityId, increment) => {
    setSelectedActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? {
              ...activity,
              count: Math.max(1, activity.count + (increment ? 1 : -1))
            }
          : activity
      )
    );
  };

  const handleAmountChange = (activityId, amount) => {
    const numAmount = parseFloat(amount) || 0;
    setSelectedActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, amount: numAmount }
          : activity
      )
    );
  };

  const handleUnlimitedChange = (activityId, isUnlimited) => {
    setSelectedActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              isUnlimited,
              count: isUnlimited ? 1000 : 1
            }
          : activity
      )
    );
  };

  const handleRemoveActivity = (activityId) => {
    setSelectedActivities(prev =>
      prev.filter(activity => activity.id !== activityId)
    );
  };

  const handleSubmit = () => {
    if (selectedActivities.length > 0 && packageAmount) {
      onSubmit({
        activities: selectedActivities,
        packageAmount: parseFloat(packageAmount),
        isUnlimited:true
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedActivities([]);
    setCurrentActivity('');
    setPackageAmount('');
    onClose();
  };

  const getTotalAmount = () => {
    return parseFloat(packageAmount) || 0;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h5" fontWeight="600">
          Book Unlimited Package
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          Select activities and customize your package
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Add Activity Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: '12px',
            border: '1px solid #e3f2fd'
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: '#1976d2',
              fontWeight: '600',
              mb: 2
            }}
          >
            Add Activity
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Select Activity</InputLabel>
                <Select
                  value={currentActivity}
                  onChange={(e) => setCurrentActivity(e.target.value)}
                  label="Select Activity"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Choose an activity</em>
                  </MenuItem>
                  <MenuItem value="select_all">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SelectAllIcon color="primary" />
                      <Typography variant="body1" fontWeight="600" color="primary">
                        Select All Activities
                      </Typography>
                    </Box>
                  </MenuItem>
                  {packageData.map((pkg) => (
                    <MenuItem key={pkg._id} value={pkg}>
                      <Box>
                        <Typography variant="body1" fontWeight="500">
                          {pkg.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={currentActivity === 'select_all' ? handleSelectAllActivities : handleAddActivity}
                disabled={!currentActivity}
                startIcon={currentActivity === 'select_all' ? <SelectAllIcon /> : <AddIcon />}
                fullWidth
                sx={{
                  borderRadius: '8px',
                  py: 1.5,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                  }
                }}
              >
                {currentActivity === 'select_all' ? 'Select All' : 'Add Activity'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Package Amount Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: '12px',
            border: '1px solid #fff3e0'
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: '#f57c00',
              fontWeight: '600',
              mb: 2
            }}
          >
            Package Amount
          </Typography>
          
          <TextField
            fullWidth
            label="Enter Package Amount"
            value={packageAmount}
            onChange={(e) => setPackageAmount(e.target.value)}
            type="number"
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            placeholder="0.00"
          />
        </Paper>

        {/* Selected Activities */}
        {selectedActivities.length > 0 && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              border: '1px solid #e8f5e8'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#2e7d32',
                fontWeight: '600',
                mb: 2
              }}
            >
              Selected Activities ({selectedActivities.length})
            </Typography>
            
            <Grid container spacing={2}>
              {selectedActivities.map((activity, index) => (
                <Grid item xs={12} key={activity.id}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: '10px',
                      backgroundColor: '#fafafa',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      {/* Activity Info */}
                      <Grid item xs={12} sm={4}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {activity.name}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Unlimited Checkbox */}
                      <Grid item xs={12} sm={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={activity.isUnlimited}
                              onChange={(e) => handleUnlimitedChange(activity.id, e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Unlimited"
                        />
                      </Grid>

                      {/* Count Controls */}
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Count
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 1
                          }}>
                            <IconButton
                              onClick={() => handleCountChange(activity.id, false)}
                              disabled={activity.count <= 1 || activity.isUnlimited}
                              size="small"
                              sx={{
                                backgroundColor: '#ffebee',
                                color: '#d32f2f',
                                '&:hover': { backgroundColor: '#ffcdd2' }
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                minWidth: '60px', 
                                textAlign: 'center',
                                fontWeight: '600',
                                color: activity.isUnlimited ? '#ff9800' : 'inherit'
                              }}
                            >
                              {activity.isUnlimited ? '∞' : activity.count}
                            </Typography>
                            
                            <IconButton
                              onClick={() => handleCountChange(activity.id, true)}
                              disabled={activity.isUnlimited}
                              size="small"
                              sx={{
                                backgroundColor: '#e8f5e8',
                                color: '#2e7d32',
                                '&:hover': { backgroundColor: '#c8e6c9' }
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Delete Button */}
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={() => handleRemoveActivity(activity.id)}
                            color="error"
                            size="small"
                            sx={{
                              backgroundColor: '#ffebee',
                              '&:hover': { backgroundColor: '#ffcdd2' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            {/* Total Summary */}
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              backgroundColor: '#e3f2fd',
              borderRadius: '8px'
            }}>
              <Typography variant="h5" color="primary" fontWeight="700">
                Total Package Amount: ₹{getTotalAmount().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedActivities.length} activities selected
              </Typography>
            </Box>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={selectedActivities.length === 0 || !packageAmount}
          sx={{
            borderRadius: '8px',
            px: 4,
            background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #45a049 30%, #3d8b40 90%)',
            }
          }}
        >
          Submit Package (₹{getTotalAmount().toFixed(2)})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnlimitedPackageModal;