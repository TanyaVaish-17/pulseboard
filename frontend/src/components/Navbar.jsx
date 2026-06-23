import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Tooltip } from '@mui/material';
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
      background: 'rgba(8,8,16,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,58,237,0.2)',
      boxShadow: '0 0 40px rgba(124,58,237,0.08)',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
          }}>
            <BoltOutlined sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{
            background: 'linear-gradient(90deg, #A78BFA, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '-0.5px',
          }}>
            PulseBoard
          </Typography>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={700} color="text.primary">
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              {user?.handle}
            </Typography>
          </Box>
          <Box sx={{
            p: '2px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          }}>
            <Avatar sx={{
              width: 36, height: 36,
              bgcolor: '#12121E',
              fontWeight: 800,
              fontSize: 15,
              color: '#A78BFA',
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Box>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} size="small" sx={{
              color: 'text.secondary',
              '&:hover': { color: '#EF4444', background: 'rgba(239,68,68,0.1)' },
            }}>
              <LogoutOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}