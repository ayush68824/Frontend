import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Box, Typography, TextField, Button, Avatar, CircularProgress, Alert, Stack } from '@mui/material'
import { updateProfile } from '../utils/api'

const Settings: React.FC = () => {
  const { user, token, setError, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.photo || null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setLocalError] = useState('')

  if (!user || !token) return null

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = ev => setPhotoUrl(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setLocalError('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('email', email.trim())
      if (photo) {
        formData.append('photo', photo)
      }
      
      const response = await updateProfile(formData)
      
      if (response.user) {
        // Update user in localStorage and context
        localStorage.setItem('user', JSON.stringify(response.user))
        updateUser(response.user)
        setSuccess('Profile updated successfully!')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (e: any) {
      console.error('Profile update error:', e)
      const errorMessage = e.message || 'Failed to update profile'
      setLocalError(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth={600} mx="auto" p={4}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={photoUrl || undefined}
              alt={user.name}
              sx={{ width: 100, height: 100 }}
            />
            <Button variant="outlined" component="label">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
              />
            </Button>
          </Box>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            error={!!error}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            error={!!error}
          />
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default Settings 