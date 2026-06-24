import { Box, Avatar, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  HomeOutlined, ExploreOutlined, NotificationsOutlined,
  BookmarkOutlined, PersonOutlined, BoltOutlined
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: <HomeOutlined />, label: 'Home' },
  { icon: <ExploreOutlined />, label: 'Explore' },
  { icon: <NotificationsOutlined />, label: 'Notifications' },
  { icon: <BookmarkOutlined />, label: 'Bookmarks' },
  { icon: <PersonOutlined />, label: 'Profile' },
];

export default function LeftSidebar() {
  const { user } = useAuth();

  return (
    <Box sx={{
      width: 260,
      flexShrink: 0,
      position: 'sticky',
      top: 80,
      height: 'fit-content',
      display: { xs: 'none', lg: 'block' },
    }}>

      {/* Profile Card */}
      <Box sx={{
        background: 'rgba(18,18,35,0.7)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '20px',
        p: 2.5,
        mb: 2,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        {/* Cover gradient */}
        <Box sx={{
          height: 64, borderRadius: '12px', mb: 2,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(6,182,212,0.4))',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)',
          }} />
        </Box>

        {/* Avatar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: -5, mb: 1.5, px: 0.5 }}>
          <Box sx={{
            p: '2.5px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
          }}>
            <Avatar sx={{
              width: 52, height: 52,
              bgcolor: '#12121E',
              color: '#A78BFA',
              fontWeight: 800,
              fontSize: 20,
              border: '2px solid #080810',
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{
            px: 1.5, py: 0.4,
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '20px',
          }}>
            <Typography variant="caption" sx={{ color: '#A78BFA', fontWeight: 700, fontSize: 10 }}>
              ACTIVE
            </Typography>
          </Box>
        </Box>

        <Typography fontWeight={800} color="#F1F1F3" fontSize={15}>{user?.name}</Typography>
        <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 600 }}>{user?.handle}</Typography>

        <Divider sx={{ borderColor: 'rgba(124,58,237,0.15)', my: 1.5 }} />

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { label: 'Posts', value: '—' },
            { label: 'Likes', value: '—' },
          ].map((s) => (
            <Box key={s.label} sx={{ textAlign: 'center' }}>
              <Typography fontWeight={800} color="#F1F1F3" fontSize={16}>{s.value}</Typography>
              <Typography variant="caption" color="#6B7280">{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Nav Links */}
      <Box sx={{
        background: 'rgba(18,18,35,0.7)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '20px',
        p: 1.5,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <List dense disablePadding>
          {navItems.map((item, i) => (
            <ListItem key={item.label} sx={{
              borderRadius: '12px', mb: 0.5, cursor: 'pointer',
              background: i === 0 ? 'rgba(124,58,237,0.12)' : 'transparent',
              border: i === 0 ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
              '&:hover': {
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.15)',
              },
              transition: 'all 0.2s ease',
            }}>
              <ListItemIcon sx={{
                color: i === 0 ? '#A78BFA' : '#6B7280',
                minWidth: 36,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? '#F1F1F3' : '#9CA3AF',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Brand Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, px: 1 }}>
        <BoltOutlined sx={{ color: '#7C3AED', fontSize: 16 }} />
        <Typography variant="caption" sx={{ color: '#374151', fontSize: 11 }}>
          PulseBoard © 2024
        </Typography>
      </Box>
    </Box>
  );
}