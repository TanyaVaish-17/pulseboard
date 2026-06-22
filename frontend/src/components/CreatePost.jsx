import { useState, useRef } from 'react';
import {
  Card, CardContent, Box, Avatar, TextField, Button,
  Typography, IconButton, Chip, CircularProgress, Collapse
} from '@mui/material';
import {
  ImageOutlined, EmojiEmotionsOutlined, CloseOutlined,
  SendOutlined, FormatListBulletedOutlined
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
    fileRef.current.value = '';
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
    <Card sx={{ mb: 3, border: '1px solid #2D2D3D' }}>
      <CardContent>
        {/* Top Row */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontWeight: 700, mt: 0.5 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
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
                  background: '#252535',
                  borderRadius: 3,
                  fontSize: 15,
                },
              }}
              inputProps={{ maxLength: MAX_CHARS + 10 }}
            />
          </Box>
        </Box>

        {/* Image Preview */}
        <Collapse in={!!preview}>
          <Box sx={{ mt: 2, position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
            <img
              src={preview}
              alt="preview"
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block', borderRadius: 12 }}
            />
            <IconButton
              onClick={handleRemoveImage}
              size="small"
              sx={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                '&:hover': { background: 'rgba(0,0,0,0.9)' },
              }}
            >
              <CloseOutlined fontSize="small" />
            </IconButton>
          </Box>
        </Collapse>

        {/* Bottom Row */}
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
              <IconButton
                size="small"
                onClick={() => fileRef.current.click()}
                sx={{ color: 'primary.main' }}
              >
                <ImageOutlined />
              </IconButton>
              <IconButton size="small" sx={{ color: 'secondary.main' }}>
                <EmojiEmotionsOutlined />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <FormatListBulletedOutlined />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {text.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: isOverLimit ? '#EF4444' : charsLeft < 50 ? '#F59E0B' : 'text.secondary' }}
                >
                  {charsLeft}
                </Typography>
              )}
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                disabled={!canPost}
                endIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendOutlined />}
                sx={{
                  px: 2.5,
                  py: 0.8,
                  background: canPost
                    ? 'linear-gradient(90deg, #7C3AED, #06B6D4)'
                    : undefined,
                  fontWeight: 600,
                }}
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </Box>
          </Box>

          {/* User info row */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={`@${user?.handle?.replace('@', '')}`}
              size="small"
              sx={{ background: '#252535', color: 'primary.main', fontSize: 11 }}
            />
            <Chip
              label="Public"
              size="small"
              sx={{ background: '#252535', color: 'text.secondary', fontSize: 11 }}
            />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}