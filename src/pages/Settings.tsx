import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Box, Typography, TextField, Button, Avatar, CircularProgress, Alert, Stack } from '@mui/material'
import axios from 'axios'

const API_URL = 'https://todo-full-stack-1-9ewe.onrender.com/api'

const Settings: React.FC = () => {
  const { user, token, setError } = useAuth()
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
    setPhoto(file || null)
    if (file) {
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
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (photo) formData.append('photo', photo)
      await axios.put(`${API_URL}/users/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess('Profile updated successfully!')
    } catch (e: any) {
      setLocalError(e.response?.data?.message || 'Update failed')
      setError(e.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} bgcolor="#fff" sx={{ transition: 'box-shadow 0.2s', minWidth: { xs: '90vw', sm: 400 } }}>
      <Typography variant="h5" mb={2}>Settings</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required variant="outlined" helperText="Update your display name" />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required variant="outlined" helperText="Update your email address" />
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="outlined" component="label">
              {photoUrl ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </Button>
            {photoUrl && <Avatar src={photoUrl} alt="User Photo" />}
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ transition: 'all 0.2s' }}>
            {loading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default Settings 