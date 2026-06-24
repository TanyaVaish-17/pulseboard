import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Tabs, Tab, Typography,
  CircularProgress, Button
} from '@mui/material';
import { AutoAwesomeOutlined, WhatshotOutlined } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
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
        radial-gradient(ellipse at 15% 15%, rgba(124,58,237,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 85%, rgba(6,182,212,0.05) 0%, transparent 50%)
      `,
    }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>

          {/* Left Sidebar */}
          <LeftSidebar />

          {/* Center Feed */}
          <Box sx={{ flex: 1, maxWidth: 600, minWidth: 0 }}>

            {/* Hero Banner */}
            <Box sx={{
              mb: 2.5, p: 2.5, borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))',
              border: '1px solid rgba(124,58,237,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', gap: 2,
            }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: '14px', flexShrink: 0,
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              }}>
                <WhatshotOutlined sx={{ color: '#fff', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography fontWeight={800} fontSize={16} sx={{
                  background: 'linear-gradient(90deg, #A78BFA, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Welcome to PulseBoard
                </Typography>
                <Typography variant="caption" color="#6B7280">
                  Share your thoughts, ideas and moments ✨
                </Typography>
              </Box>
            </Box>

            {/* Create Post */}
            <CreatePost onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />

            {/* Filter Tabs */}
            <Box sx={{
              background: 'rgba(18,18,35,0.8)',
              borderRadius: '16px',
              border: '1px solid rgba(124,58,237,0.2)',
              mb: 2.5, overflow: 'hidden',
              backdropFilter: 'blur(10px)',
            }}>
              <Tabs
                value={filter}
                onChange={handleFilterChange}
                variant="fullWidth"
                TabIndicatorProps={{
                  style: {
                    background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                    height: 3, borderRadius: 2,
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
                borderRadius: '20px',
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
                {/* Pagination Footer — always visible */}
                <Box sx={{
                  mt: 3, p: 2.5,
                  background: 'rgba(18,18,35,0.7)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  {/* Page indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Box
                        key={p}
                        onClick={() => {
                          if (p !== page) fetchPosts(p, filter, true);
                        }}
                        sx={{
                          width: p === page ? 28 : 10,
                          height: 10,
                          borderRadius: '5px',
                          cursor: p === page ? 'default' : 'pointer',
                          background: p === page
                            ? 'linear-gradient(90deg, #7C3AED, #06B6D4)'
                            : 'rgba(124,58,237,0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': p !== page ? { background: 'rgba(124,58,237,0.4)' } : {},
                        }}
                      />
                    ))}
                  </Box>

                  {/* Page text */}
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    Page <Box component="span" sx={{ color: '#A78BFA', fontWeight: 700 }}>{page}</Box>
                    {' '}of{' '}
                    <Box component="span" sx={{ color: '#A78BFA', fontWeight: 700 }}>{totalPages || 1}</Box>
                    {' · '}
                    <Box component="span" sx={{ color: '#6B7280' }}>
                      {posts.length} posts loaded
                    </Box>
                  </Typography>

                  {/* Load More button */}
                  {page < totalPages && (
                    <Button
                      variant="outlined"
                      onClick={() => fetchPosts(page + 1, filter, false)}
                      disabled={loadingMore}
                      fullWidth
                      sx={{
                        borderColor: 'rgba(124,58,237,0.3)',
                        color: '#A78BFA',
                        borderRadius: '12px',
                        fontWeight: 700,
                        py: 1,
                        '&:hover': {
                          borderColor: '#7C3AED',
                          background: 'rgba(124,58,237,0.08)',
                        },
                        '&:disabled': { opacity: 0.4 },
                      }}
                    >
                      {loadingMore ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={14} sx={{ color: '#A78BFA' }} />
                          Loading more...
                        </Box>
                      ) : `Load More (Page ${page + 1})`}
                    </Button>
                  )}

                  {page >= totalPages && posts.length > 0 && (
                    <Typography variant="caption" sx={{
                      color: '#374151',
                      display: 'flex', alignItems: 'center', gap: 0.5,
                    }}>
                      ✨ You're all caught up!
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Box>

          {/* Right Sidebar */}
          <RightSidebar />
        </Box>
      </Container>
    </Box>
  );
}