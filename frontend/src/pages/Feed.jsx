import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Tabs, Tab, Typography,
  CircularProgress, Button
} from '@mui/material';
import { AutoAwesomeOutlined, WhatshotOutlined } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import api from '../utils/api';

const FILTERS = ['All Posts', 'Most Liked', 'Most Commented'];
const FILTER_KEYS = ['all', 'mostLiked', 'mostCommented'];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1, filterIdx = filter, replace = true) => {
    replace ? setLoading(true) : setLoadingMore(true);
    try {
      const { data } = await api.get('/posts', {
        params: { filter: FILTER_KEYS[filterIdx], page: pageNum, limit: 10 },
      });
      setPosts((prev) => replace ? data.posts : [...prev, ...data.posts]);
      setTotalPages(data.pages);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      replace ? setLoading(false) : setLoadingMore(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts(1, filter, true);
  }, [filter]);

  const handleFilterChange = (_, newVal) => {
    setFilter(newVal);
    setPage(1);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => p._id === updatedPost._id ? updatedPost : p));
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#080810',
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 50%)
      `,
    }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 4 }}>

        {/* Hero Banner */}
        <Box sx={{
          mb: 3, p: 3, borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
          border: '1px solid rgba(124,58,237,0.25)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}>
            <WhatshotOutlined sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{
              background: 'linear-gradient(90deg, #A78BFA, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Welcome to PulseBoard
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Share your thoughts, ideas and moments with the world ✨
            </Typography>
          </Box>
        </Box>

        {/* Create Post */}
        <CreatePost onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />

        {/* Filter Tabs */}
        <Box sx={{
          background: 'rgba(18,18,30,0.8)',
          borderRadius: 3,
          border: '1px solid rgba(124,58,237,0.2)',
          mb: 3,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}>
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            variant="fullWidth"
            TabIndicatorProps={{
              style: {
                background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                height: 3,
                borderRadius: 2,
              }
            }}
            sx={{
              '& .MuiTab-root': { color: '#6B7280', fontWeight: 600 },
              '& .Mui-selected': { color: '#A78BFA !important' },
            }}
          >
            {FILTERS.map((f) => (
              <Tab key={f} label={f} sx={{ fontSize: 13, textTransform: 'none', py: 1.5 }} />
            ))}
          </Tabs>
        </Box>

        {/* Posts */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">Loading posts...</Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{
            textAlign: 'center', py: 10,
            border: '1px dashed rgba(124,58,237,0.3)',
            borderRadius: 4,
          }}>
            <AutoAwesomeOutlined sx={{ fontSize: 52, color: 'primary.main', mb: 1.5, opacity: 0.7 }} />
            <Typography fontWeight={700} color="text.primary" mb={0.5}>No posts yet</Typography>
            <Typography variant="body2" color="text.secondary">Be the first to post something amazing!</Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
            ))}
            {page < totalPages && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => fetchPosts(page + 1, filter, false)}
                  disabled={loadingMore}
                  sx={{
                    borderColor: 'rgba(124,58,237,0.4)',
                    color: '#A78BFA',
                    borderRadius: 3,
                    px: 4,
                    '&:hover': {
                      borderColor: '#7C3AED',
                      background: 'rgba(124,58,237,0.1)',
                    },
                  }}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}