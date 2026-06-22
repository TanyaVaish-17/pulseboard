import { useState } from 'react';
import {
  Card, CardContent, Box, Avatar, Typography, IconButton,
  Chip, Collapse, TextField, Button, Divider
} from '@mui/material';
import {
  FavoriteBorderOutlined, FavoriteOutlined,
  ChatBubbleOutlineOutlined, ShareOutlined, SendOutlined
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLiked = post.likes?.includes(user?._id);

  const handleLike = async () => {
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      onUpdate(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      onUpdate(data);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontWeight: 700 }}>
              {post.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={700}>{post.username}</Typography>
              <Typography variant="caption" color="text.secondary">
                {post.handle} · {timeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label="Follow"
            size="small"
            variant="outlined"
            sx={{ borderColor: 'primary.main', color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
          />
        </Box>

        {/* Text Content */}
        {post.text && (
          <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, color: 'text.primary' }}>
            {post.text}
          </Typography>
        )}

        {/* Image */}
        {post.image && (
          <Box sx={{ borderRadius: 3, overflow: 'hidden', mb: 1.5 }}>
            <img
              src={post.image}
              alt="post"
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }}
            />
          </Box>
        )}

        <Divider sx={{ borderColor: '#2D2D3D', mb: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLike} size="small" sx={{ color: isLiked ? '#EF4444' : 'text.secondary' }}>
              {isLiked ? <FavoriteOutlined fontSize="small" /> : <FavoriteBorderOutlined fontSize="small" />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">{post.likes?.length || 0}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setShowComments(!showComments)} size="small" sx={{ color: 'text.secondary' }}>
              <ChatBubbleOutlineOutlined fontSize="small" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">{post.comments?.length || 0}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <ShareOutlined fontSize="small" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">0</Typography>
          </Box>
        </Box>

        {/* Comments Section */}
        <Collapse in={showComments}>
          <Box sx={{ mt: 1.5 }}>
            {post.comments?.length > 0 && (
              <Box sx={{ mb: 1.5, maxHeight: 200, overflowY: 'auto' }}>
                {post.comments.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: 12 }}>
                      {c.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ background: '#252535', borderRadius: 2, px: 1.5, py: 0.8, flex: 1 }}>
                      <Typography variant="caption" fontWeight={700} color="primary.main">
                        {c.username}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 13 }}>{c.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Add Comment */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment}
                disabled={submitting || !commentText.trim()}
                sx={{ minWidth: 40, px: 1.5, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
              >
                <SendOutlined fontSize="small" />
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}