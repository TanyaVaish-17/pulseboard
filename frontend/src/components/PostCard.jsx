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

const renderText = (text) => {
  if (!text) return null;
  return text.split(' ').map((word, i) => {
    if (word.startsWith('#')) {
      return (
        <Box key={i} component="span" sx={{
          color: '#A78BFA',
          fontWeight: 600,
          cursor: 'pointer',
          '&:hover': { color: '#06B6D4' },
        }}>
          {word}{' '}
        </Box>
      );
    }
    if (word.startsWith('@')) {
      return (
        <Box key={i} component="span" sx={{ color: '#06B6D4', fontWeight: 600 }}>
          {word}{' '}
        </Box>
      );
    }
    return word + ' ';
  });
};

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [showLikers, setShowLikers] = useState(false);

  const isLiked = post.likes?.includes(user?._id);

  const handleLike = async () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);
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
    <Card sx={{
      mb: 2.5,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        border: '1px solid rgba(124,58,237,0.4)',
        boxShadow: '0 8px 32px rgba(124,58,237,0.15)',
      },
    }}>
      <CardContent sx={{ p: 2.5 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {/* Gradient Avatar Ring */}
            <Box sx={{
              p: '2px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              boxShadow: '0 0 12px rgba(124,58,237,0.4)',
            }}>
              <Avatar sx={{
                width: 42, height: 42,
                bgcolor: '#12121E',
                color: '#A78BFA',
                fontWeight: 800,
                fontSize: 16,
              }}>
                {post.username?.[0]?.toUpperCase()}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={700} color="text.primary">
                {post.username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                <Box component="span" sx={{ color: '#7C3AED' }}>{post.handle}</Box>
                {' '}· {timeAgo(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label="Follow"
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(124,58,237,0.5)',
              color: '#A78BFA',
              fontWeight: 600,
              fontSize: 11,
              height: 26,
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(124,58,237,0.1)',
                borderColor: '#7C3AED',
              },
            }}
          />
        </Box>

        {/* Text */}
        {post.text && (
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.75, fontSize: 15 }}>
            {renderText(post.text)}
          </Typography>
        )}

        {/* Image */}
        {post.image && (
          <Box sx={{
            borderRadius: 3, overflow: 'hidden', mb: 2,
            border: '1px solid rgba(124,58,237,0.15)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <img
              src={post.image}
              alt="post"
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }}
            />
          </Box>
        )}

        <Divider sx={{ borderColor: 'rgba(124,58,237,0.1)', mb: 1.5 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
              onClick={handleLike}
              size="small"
              sx={{
                color: isLiked ? '#EF4444' : '#6B7280',
                transform: likeAnim ? 'scale(1.4)' : 'scale(1)',
                transition: 'all 0.2s ease',
                '&:hover': { color: '#EF4444', background: 'rgba(239,68,68,0.1)' },
              }}
              >
                {isLiked ? <FavoriteOutlined fontSize="small" /> : <FavoriteBorderOutlined fontSize="small" />}
              </IconButton>
              <Typography
              variant="caption"
              fontWeight={600}
              color={isLiked ? '#EF4444' : 'text.secondary'}
              onClick={() => post.likedUsernames?.length > 0 && setShowLikers(!showLikers)}
              sx={{ cursor: post.likedUsernames?.length > 0 ? 'pointer' : 'default' }}
              >
                {post.likes?.length || 0}
              </Typography>
            </Box>

            {/* Likers Dropdown */}
            <Collapse in={showLikers && post.likedUsernames?.length > 0}>
              <Box sx={{
                mt: 1, p: 1.5,
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: '12px',
                maxWidth: 220,
              }}>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#EF4444', display: 'block', mb: 1 }}>
                  ❤️ Liked by
                </Typography>
                {post.likedUsernames?.slice(0, 5).map((name, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Avatar sx={{
                    width: 20, height: 20,
                    bgcolor: 'rgba(239,68,68,0.2)',
                    color: '#EF4444',
                    fontSize: 10, fontWeight: 800,
                  }}>
                    {name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography variant="caption" color="#D1D5DB" fontWeight={500}>{name}</Typography>
                    </Box>
                  ))}
                  {post.likedUsernames?.length > 5 && (
                  <Typography variant="caption" sx={{ color: '#6B7280', mt: 0.5, display: 'block' }}>
                    +{post.likedUsernames.length - 5} more
                  </Typography>
                )}
                </Box>
            </Collapse>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={() => setShowComments(!showComments)}
              size="small"
              sx={{
                color: showComments ? '#06B6D4' : '#6B7280',
                '&:hover': { color: '#06B6D4', background: 'rgba(6,182,212,0.1)' },
              }}
            >
              <ChatBubbleOutlineOutlined fontSize="small" />
            </IconButton>
            <Typography variant="caption" fontWeight={600} color={showComments ? '#06B6D4' : 'text.secondary'}>
              {post.comments?.length || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{
              color: '#6B7280',
              '&:hover': { color: '#A78BFA', background: 'rgba(124,58,237,0.1)' },
            }}>
              <ShareOutlined fontSize="small" />
            </IconButton>
            <Typography variant="caption" fontWeight={600} color="text.secondary">0</Typography>
          </Box>
        </Box>

        {/* Comments */}
        <Collapse in={showComments}>
          <Box sx={{
            mt: 2, p: 2,
            background: 'rgba(124,58,237,0.04)',
            borderRadius: 3,
            border: '1px solid rgba(124,58,237,0.1)',
          }}>
            {post.comments?.length > 0 && (
              <Box sx={{ mb: 2, maxHeight: 220, overflowY: 'auto' }}>
                {post.comments.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <Box sx={{
                      p: '1.5px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                      flexShrink: 0,
                    }}>
                      <Avatar sx={{
                        width: 28, height: 28,
                        bgcolor: '#12121E',
                        color: '#06B6D4',
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {c.username?.[0]?.toUpperCase()}
                      </Avatar>
                    </Box>
                    <Box sx={{
                      background: 'rgba(18,18,30,0.8)',
                      borderRadius: 2,
                      px: 1.5, py: 1,
                      flex: 1,
                      border: '1px solid rgba(124,58,237,0.1)',
                    }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: '#A78BFA' }}>
                        {c.username}
                        <Box component="span" sx={{ color: '#6B7280', fontWeight: 400, ml: 0.5 }}>
                          {c.handle}
                        </Box>
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 13, mt: 0.3, color: '#D1D5DB' }}>
                        {c.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Add Comment Input */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    background: 'rgba(18,18,30,0.8)',
                    fontSize: 13,
                    '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment}
                disabled={submitting || !commentText.trim()}
                sx={{
                  minWidth: 42,
                  px: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                  '&:hover': { opacity: 0.9 },
                  '&:disabled': { opacity: 0.4 },
                }}
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