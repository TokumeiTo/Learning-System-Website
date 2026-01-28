import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Divider,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  MdVisibility, 
  MdVisibilityOff, 
  MdFingerprint, 
  MdCorporateFare 
} from 'react-icons/md';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import AuthContainer from './AuthContainer';
import ForgotPassword from '../../components/auth/ForgetPassword';
import { useAuth } from '../../hooks/useAuth';

export default function SignIn() {
  const [companyCode, setCompanyCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyCode) return setError('Company code is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    try {
      setIsLoading(true);
      setError('');
      await login(companyCode, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, md: 6 },
            width: '100%',
            maxWidth: '450px',
            borderRadius: 4,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Logo Section */}
          <Box sx={{ mb: 3 }}>
            <motion.img 
              src="/dat logo.png" 
              width={60} 
              alt="Logo"
              whileHover={{ scale: 1.1 }}
              style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))' }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 2, color: 'primary.main' }}>
              LMS Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your dashboard
            </Typography>
          </Box>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Company ID"
              variant="outlined"
              value={companyCode}
              onChange={(e) => setCompanyCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdCorporateFare color="#666" size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdFingerprint color="#666" size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => setOpen(true)}
                sx={{ fontWeight: 600, textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Diversity3Icon sx={{ color: 'text.disabled', mx: 1 }} />
          </Divider>

          <Typography variant="caption" color="text.secondary">
            © 2026 DAT Learning Management System
          </Typography>
        </Paper>
      </motion.div>

      <ForgotPassword open={open} handleClose={() => setOpen(false)} />
    </AuthContainer>
  );
}