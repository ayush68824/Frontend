import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { CircularProgress, Box, Stack, Divider, Paper, Alert } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { Container, Typography, TextField, Button, Link } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}))

const Register: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const { register, googleSignIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      if (photo) {
        formData.append('photo', photo)
      }
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed')
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await googleSignIn(credentialResponse.credential)
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Google sign-up failed')
    }
  }

  return loading ? (
    <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />
  ) : (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-up failed')}
          />
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Box>
      </StyledPaper>
    </Container>
  )
}

export default Register 