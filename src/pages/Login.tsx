import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { CircularProgress, Box, Stack, Paper, Button } from '@mui/material'
import { GoogleLogin } from '@react-oauth/google'

const Login: React.FC = () => {
  const { login, googleSignIn, loading, error, setError, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return loading ? (
    <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />
  ) : (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f4f6fa">
      <Paper elevation={4} sx={{ p: 4, minWidth: { xs: '90vw', sm: 400 }, maxWidth: 400 }}>
        <Stack spacing={2}>
          <AuthForm
            title="Sign In"
            fields={[
              { name: 'email', label: 'Email', type: 'email', value: email, onChange: e => setEmail(e.target.value) },
              { name: 'password', label: 'Password', type: 'password', value: password, onChange: e => setPassword(e.target.value) },
            ]}
            onSubmit={handleSubmit}
            error={error || undefined}
            submitLabel="Login"
            googleLabel="Sign in with Google"
            onGoogle={() => {}}
          />
          <Box display="flex" justifyContent="center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  await googleSignIn(credentialResponse.credential)
                } else {
                  setError('Google sign-in failed')
                }
              }}
              onError={() => setError('Google sign-in failed')}
              width="100%"
            />
          </Box>
        </Stack>
        <Box display="flex" justifyContent="center" mt={2}>
          <span>Don't have an account?</span>
          <Button variant="text" onClick={() => navigate('/register')} sx={{ ml: 1 }}>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login 