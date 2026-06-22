import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Tabs, Tab, Typography,
  CircularProgress, Button
} from '@mui/material';
import { AutoAwesomeOutlined } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import api from '../utils/api';
import CreatePost from '../components/CreatePost';

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

  const handleLoadMore = () => {
    fetchPosts(page + 1, filter, false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'background.default' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 3 }}>
      <CreatePost onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])} />

        {/* Filter Tabs */}
        <Box sx={{
          background: '#1A1A24',
          borderRadius: 3,
          border: '1px solid #2D2D3D',
          mb: 3,
          overflow: 'hidden',
        }}>
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            variant="fullWidth"
            TabIndicatorProps={{ style: { background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', height: 3 } }}
          >
            {FILTERS.map((f) => (
              <Tab key={f} label={f} sx={{ fontWeight: 600, fontSize: 13, textTransform: 'none' }} />
            ))}
          </Tabs>
        </Box>

        {/* Posts */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AutoAwesomeOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography color="text.secondary">No posts yet. Be the first to post!</Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
            ))}

            {page < totalPages && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{ borderColor: 'primary.main', color: 'primary.main', borderRadius: 3 }}
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