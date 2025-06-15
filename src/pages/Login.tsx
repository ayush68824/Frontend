import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { CircularProgress, Box, Stack, Paper, Button, Container, Typography, TextField, Link, Alert } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import { styled } from '@mui/material/styles'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
}))

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, googleSignIn, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await googleSignIn(credentialResponse.credential)
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Google login failed')
    }
  }

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
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
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed')}
          />
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="/register" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Box>
      </StyledPaper>
    </Container>
  )
}

export default Login 