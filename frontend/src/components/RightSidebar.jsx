import { Box, Typography, Divider, Avatar, Chip } from '@mui/material';
import { TrendingUpOutlined, LocalFireDepartmentOutlined } from '@mui/icons-material';

const trendingTags = [
  { tag: '#PulseBoard', posts: '1.2k posts' },
  { tag: '#WebDev', posts: '8.4k posts' },
  { tag: '#ReactJS', posts: '5.1k posts' },
  { tag: '#MERN', posts: '3.7k posts' },
  { tag: '#OpenSource', posts: '2.9k posts' },
];

const suggestions = [
  { name: 'Rahul Dev', handle: '@rahuldev99', letter: 'R', color: '#7C3AED' },
  { name: 'Priya Singh', handle: '@priyasingh', letter: 'P', color: '#06B6D4' },
  { name: 'Aryan Shah', handle: '@aryanshah', letter: 'A', color: '#10B981' },
];

export default function RightSidebar() {
  return (
    <Box sx={{
      width: 280,
      flexShrink: 0,
      position: 'sticky',
      top: 80,
      height: 'fit-content',
      display: { xs: 'none', lg: 'block' },
    }}>

      {/* App Stats */}
      <Box sx={{
        background: 'rgba(18,18,35,0.7)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '20px',
        p: 2.5, mb: 2,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LocalFireDepartmentOutlined sx={{ color: '#F59E0B', fontSize: 18 }} />
          <Typography fontWeight={800} color="#F1F1F3" fontSize={14}>PulseBoard Live</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { value: '🟢', label: 'Live' },
            { value: '∞', label: 'Posts' },
            { value: '24/7', label: 'Active' },
          ].map((s) => (
            <Box key={s.label} sx={{
              textAlign: 'center', px: 1.5, py: 1,
              background: 'rgba(124,58,237,0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(124,58,237,0.12)',
            }}>
              <Typography fontWeight={800} color="#A78BFA" fontSize={15}>{s.value}</Typography>
              <Typography variant="caption" color="#6B7280" fontSize={10}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Trending Tags */}
      <Box sx={{
        background: 'rgba(18,18,35,0.7)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '20px',
        p: 2.5, mb: 2,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUpOutlined sx={{ color: '#06B6D4', fontSize: 18 }} />
          <Typography fontWeight={800} color="#F1F1F3" fontSize={14}>Trending</Typography>
        </Box>
        {trendingTags.map((t, i) => (
          <Box key={t.tag} sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            py: 1, px: 1.5, mb: 0.5, borderRadius: '10px', cursor: 'pointer',
            '&:hover': { background: 'rgba(124,58,237,0.08)' },
            transition: 'all 0.2s ease',
          }}>
            <Box>
              <Typography fontSize={13} fontWeight={700} sx={{ color: '#A78BFA' }}>{t.tag}</Typography>
              <Typography variant="caption" color="#6B7280">{t.posts}</Typography>
            </Box>
            <Typography variant="caption" sx={{
              color: '#374151', fontWeight: 700,
              background: 'rgba(124,58,237,0.08)',
              px: 1, py: 0.3, borderRadius: '8px', fontSize: 11,
            }}>
              #{i + 1}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Who to Follow */}
      <Box sx={{
        background: 'rgba(18,18,35,0.7)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '20px',
        p: 2.5,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        <Typography fontWeight={800} color="#F1F1F3" fontSize={14} mb={2}>
          Who to follow
        </Typography>
        {suggestions.map((s) => (
          <Box key={s.handle} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            mb: 1.5,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{
                width: 36, height: 36,
                bgcolor: `${s.color}22`,
                color: s.color,
                fontWeight: 800, fontSize: 14,
                border: `1px solid ${s.color}44`,
              }}>
                {s.letter}
              </Avatar>
              <Box>
                <Typography fontSize={13} fontWeight={700} color="#F1F1F3">{s.name}</Typography>
                <Typography variant="caption" color="#6B7280">{s.handle}</Typography>
              </Box>
            </Box>
            <Chip label="Follow" size="small" sx={{
              height: 26, fontSize: 11, fontWeight: 700,
              background: 'rgba(124,58,237,0.12)',
              color: '#A78BFA',
              border: '1px solid rgba(124,58,237,0.25)',
              cursor: 'pointer',
              '&:hover': { background: 'rgba(124,58,237,0.25)' },
            }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}