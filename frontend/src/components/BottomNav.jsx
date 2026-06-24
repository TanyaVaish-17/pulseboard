import { Box, Typography } from '@mui/material';
import {
  HomeOutlined, ExploreOutlined,
  NotificationsOutlined, PersonOutlined
} from '@mui/icons-material';

const navItems = [
  { icon: <HomeOutlined />, label: 'Home' },
  { icon: <ExploreOutlined />, label: 'Explore' },
  { icon: <NotificationsOutlined />, label: 'Alerts' },
  { icon: <PersonOutlined />, label: 'Profile' },
];

export default function BottomNav({ active = 0 }) {
  return (
    <Box sx={{
      display: { xs: 'flex', lg: 'none' },
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: 64,
      background: 'rgba(8,8,16,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(124,58,237,0.2)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
      zIndex: 1000,
      justifyContent: 'space-around',
      alignItems: 'center',
      px: 1,
    }}>
      {navItems.map((item, i) => (
        <Box key={item.label} sx={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          flex: 1, py: 1, cursor: 'pointer',
          borderRadius: '12px',
          color: i === active ? '#A78BFA' : '#6B7280',
          position: 'relative',
          '&:hover': { color: '#A78BFA' },
          transition: 'color 0.2s ease',
        }}>
          {i === active && (
            <Box sx={{
              position: 'absolute', top: 0,
              width: 32, height: 2, borderRadius: '0 0 4px 4px',
              background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
            }} />
          )}
          <Box sx={{
            p: 0.8, borderRadius: '10px',
            background: i === active ? 'rgba(124,58,237,0.15)' : 'transparent',
            transition: 'all 0.2s ease',
          }}>
            {item.icon}
          </Box>
          <Typography sx={{ fontSize: 10, fontWeight: i === active ? 700 : 500 }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}