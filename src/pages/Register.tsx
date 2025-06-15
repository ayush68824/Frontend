import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { CircularProgress, Box, Stack, Divider, Paper } from '@mui/material'

const Register: React.FC = () => {
  const { register, googleSignIn, loading, error, setError, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    if (photo) formData.append('photo', photo)
    await register(formData)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPhoto(file || null)
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setPhotoUrl(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setPhotoUrl(null)
    }
  }

  const handleGoogle = async () => {
    // TODO: Integrate Google OAuth. For now, just show a message.
    setError('Google sign-in not implemented yet')
  }

  return loading ? (
    <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />
  ) : (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f4f6fa">
      <Paper elevation={4} sx={{ p: 4, minWidth: { xs: '90vw', sm: 400 }, maxWidth: 400 }}>
        <Stack spacing={2}>
          <AuthForm
            title="Sign Up"
            fields={[
              { name: 'name', label: 'Name', value: name, onChange: e => setName(e.target.value) },
              { name: 'email', label: 'Email', type: 'email', value: email, onChange: e => setEmail(e.target.value) },
              { name: 'password', label: 'Password', type: 'password', value: password, onChange: e => setPassword(e.target.value) },
            ]}
            onSubmit={handleSubmit}
            error={error || undefined}
            submitLabel="Register"
            googleLabel="Sign up with Google"
            onGoogle={handleGoogle}
            showPhotoUpload
            photoUrl={photoUrl}
            onPhotoChange={handlePhotoChange}
          />
          <Divider>or</Divider>
          <Box display="flex" justifyContent="center">
            {/* GoogleLogin can be added here if needed */}
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Register 