import { AppBar, Toolbar, Typography, Box, Avatar, Button, IconButton } from '@mui/material';
import { BoltOutlined, LogoutOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: 'rgba(15,15,19,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #2D2D3D',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BoltOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{
            background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
          }}>
            PulseBoard
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.handle}</Typography>
          </Box>
          <IconButton onClick={handleLogout} size="small" sx={{ color: 'text.secondary' }}>
            <LogoutOutlined fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}