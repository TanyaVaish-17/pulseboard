import { useState } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, BoltOutlined } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    background: '#1a1a2e',
    borderRadius: 2,
    '& fieldset': { borderColor: 'rgba(124,58,237,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.6)' },
    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
    '& input': { color: '#F1F1F3' },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #1a1a2e inset',
      WebkitTextFillColor: '#F1F1F3',
      caretColor: '#F1F1F3',
    },
  },
  '& .MuiInputLabel-root': { color: '#6B7280' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#A78BFA' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#080810' }}>

      {/* Left Branding Panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #0d0720 0%, #1a0a3c 40%, #0a1225 100%)',
        borderRight: '1px solid rgba(124,58,237,0.2)',
        p: 6,
      }}>
        {/* Glow orbs */}
        <Box sx={{
          position: 'absolute', top: '10%', left: '10%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <Box sx={{ position: 'relative', textAlign: 'center', zIndex: 1, maxWidth: 420 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 88, height: 88, borderRadius: '28px', mb: 3,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            boxShadow: '0 0 50px rgba(124,58,237,0.55), 0 0 100px rgba(124,58,237,0.2)',
          }}>
            <BoltOutlined sx={{ color: '#fff', fontSize: 48 }} />
          </Box>

          <Typography variant="h2" fontWeight={900} sx={{
            background: 'linear-gradient(90deg, #C4B5FD, #67E8F9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1.5, letterSpacing: '-1.5px', fontSize: { md: 52, lg: 60 },
          }}>
            PulseBoard
          </Typography>

          <Typography sx={{ color: '#9CA3AF', mb: 5, fontSize: 17, lineHeight: 1.6 }}>
            Your social space to share thoughts, ideas and moments with the world.
          </Typography>

          {[
            { icon: '⚡', text: 'Real-time likes & comments' },
            { icon: '🖼️', text: 'Share images & text posts' },
            { icon: '🔥', text: 'Trending post filters' },
          ].map((f) => (
            <Box key={f.text} sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              mb: 1.5, px: 3, py: 1.4,
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.18)',
              borderRadius: '14px',
              backdropFilter: 'blur(10px)',
            }}>
              <Typography fontSize={22}>{f.icon}</Typography>
              <Typography sx={{ color: '#D1D5DB', fontSize: 15, fontWeight: 500 }}>{f.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box sx={{
        width: { xs: '100%', md: '500px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080810',
        p: { xs: 3, sm: 5 },
        position: 'relative',
      }}>
        {/* subtle top glow */}
        <Box sx={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 200,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <Box sx={{
          width: '100%', maxWidth: 380,
          position: 'relative', zIndex: 1,
          background: 'rgba(18,18,35,0.7)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '24px',
          p: { xs: 3, sm: 4 },
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{
              width: 34, height: 34, borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BoltOutlined sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography fontWeight={800} fontSize={18} sx={{
              background: 'linear-gradient(90deg, #A78BFA, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>PulseBoard</Typography>
          </Box>

          <Typography variant="h5" fontWeight={800} color="#F1F1F3" mb={0.5}>
            Welcome back 👋
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mb: 3.5 }}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{
              mb: 2.5, borderRadius: 2,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#FCA5A5',
              '& .MuiAlert-icon': { color: '#EF4444' },
            }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email address" name="email" type="email"
              value={form.email} onChange={handleChange} required fullWidth sx={inputSx} />

            <TextField label="Password" name="password"
              type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange} required fullWidth sx={inputSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end"
                      sx={{ color: '#6B7280', '&:hover': { color: '#A78BFA' } }}>
                      {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading}
              sx={{
                py: 1.5, mt: 1, fontSize: 15, fontWeight: 700, borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #06B6D4 100%)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                '&:hover': { opacity: 0.9, boxShadow: '0 4px 28px rgba(124,58,237,0.6)' },
                '&:disabled': { opacity: 0.45, color: '#fff' },
              }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" mt={2.5} sx={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: 700 }}>
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}