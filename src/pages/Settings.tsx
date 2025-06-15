import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Box, Typography, Paper, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Settings: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Account Settings
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  )
}

export default Settings 