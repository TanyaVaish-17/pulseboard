import { useState, useRef } from 'react';
import {
  Card, CardContent, Box, Avatar, TextField, Button,
  Typography, IconButton, Chip, CircularProgress, Collapse
} from '@mui/material';
import {
  ImageOutlined, CloseOutlined, SendOutlined,
  EmojiEmotionsOutlined, FormatListBulletedOutlined
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const MAX_CHARS = 500;

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (image) formData.append('image', image);
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onPostCreated(data);
      setText('');
      setImage(null);
      setPreview('');
      setExpanded(false);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const charsLeft = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;
  const canPost = (text.trim() || image) && !isOverLimit && !loading;

  return (
    <Card sx={{
      mb: 3,
      border: expanded
        ? '1px solid rgba(124,58,237,0.5)'
        : '1px solid rgba(124,58,237,0.15)',
      boxShadow: expanded
        ? '0 0 30px rgba(124,58,237,0.12)'
        : 'none',
      transition: 'all 0.3s ease',
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Box sx={{
            p: '2px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            mt: 0.5,
          }}>
            <Avatar sx={{
              width: 40, height: 40,
              bgcolor: '#12121E',
              color: '#A78BFA',
              fontWeight: 800,
              fontSize: 15,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={expanded ? 3 : 1}
              maxRows={6}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (!expanded) setExpanded(true);
              }}
              onFocus={() => setExpanded(true)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(124,58,237,0.04)',
                  borderRadius: 3,
                  fontSize: 15,
                  '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                },
              }}
            />
          </Box>
        </Box>

        {/* Image Preview */}
        <Collapse in={!!preview}>
          <Box sx={{ mt: 2, position: 'relative' }}>
            <Box sx={{
              borderRadius: 3, overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.3)',
              boxShadow: '0 0 20px rgba(124,58,237,0.1)',
            }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '320px',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                  borderRadius: '12px',
                }}
              />
            </Box>
            <IconButton
              onClick={handleRemoveImage}
              size="small"
              sx={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                '&:hover': { background: '#EF4444' },
              }}
            >
              <CloseOutlined fontSize="small" />
            </IconButton>
          </Box>
        </Collapse>

        {/* Bottom Actions */}
        <Collapse in={expanded}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <IconButton size="small" onClick={() => fileRef.current.click()} sx={{
                color: '#7C3AED',
                '&:hover': { background: 'rgba(124,58,237,0.1)' },
              }}>
                <ImageOutlined />
              </IconButton>
              <IconButton size="small" sx={{
                color: '#06B6D4',
                '&:hover': { background: 'rgba(6,182,212,0.1)' },
              }}>
                <EmojiEmotionsOutlined />
              </IconButton>
              <IconButton size="small" sx={{
                color: '#6B7280',
                '&:hover': { background: 'rgba(124,58,237,0.1)' },
              }}>
                <FormatListBulletedOutlined />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {text.length > 0 && (
                <Typography variant="caption" sx={{
                  color: isOverLimit ? '#EF4444' : charsLeft < 50 ? '#F59E0B' : '#6B7280',
                  fontWeight: 600,
                }}>
                  {charsLeft}
                </Typography>
              )}
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                disabled={!canPost}
                endIcon={loading
                  ? <CircularProgress size={13} color="inherit" />
                  : <SendOutlined fontSize="small" />}
                sx={{
                  px: 2.5, py: 0.9,
                  background: canPost
                    ? 'linear-gradient(135deg, #7C3AED, #06B6D4)'
                    : 'rgba(124,58,237,0.2)',
                  fontWeight: 700,
                  '&:hover': { opacity: 0.9 },
                  '&:disabled': { color: '#6B7280' },
                }}
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={user?.handle}
              size="small"
              sx={{
                background: 'rgba(124,58,237,0.1)',
                color: '#A78BFA',
                fontSize: 11,
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            />
            <Chip
              label="🌍 Public"
              size="small"
              sx={{
                background: 'rgba(6,182,212,0.08)',
                color: '#06B6D4',
                fontSize: 11,
                border: '1px solid rgba(6,182,212,0.2)',
              }}
            />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}