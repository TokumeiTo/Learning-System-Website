import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Link, IconButton,
  Alert, Stack, useTheme, Divider, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdVisibility, MdVisibilityOff, MdFingerprint,
  MdBusiness, MdDarkMode, MdLightMode
} from 'react-icons/md';
import { CustomThemeContext } from '../../context/theme/ThemeProvider';
import ForgotPassword from '../../components/auth/ForgetPassword';
import { useAuth } from '../../hooks/useAuth';

export default function SignIn() {
  const theme = useTheme();
  const { mode, toggleColorMode } = useContext(CustomThemeContext);

  // States
  const [companyCode, setCompanyCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  // Error States
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ companyCode?: string; password?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    try {
      setIsLoading(true);
      await login(companyCode, password);
      navigate('/home');
    } catch (err: any) {
      // 1. Handle FluentValidation (400 Bad Request)
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        setFieldErrors({
          companyCode: backendErrors.CompanyCode?.[0],
          password: backendErrors.Password?.[0]
        });
      }
      // 2. Handle Custom Backend Messages (401 Unauthorized)
      else if (err.response?.status === 401) {
        // This pulls the "Invalid Company Code or Password" string from your controller
        setGeneralError(err.response.data.message || 'Unauthorized Access');
      }
      // 3. Handle Generic/Network Errors
      else {
        setGeneralError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVars = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box sx={{
      display: 'flex', minHeight: '100vh', width: '100vw',
      bgcolor: 'background.default',
      backgroundImage: theme.palette.background.gradient,
      transition: 'background 0.5s ease-in-out',
      overflow: 'hidden'
    }}>
      {/* Theme Toggle */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
          <IconButton onClick={toggleColorMode} sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            {mode === 'light' ? <MdDarkMode /> : <MdLightMode color={theme.palette.text.tertiary} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* LEFT: Branded Side */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1.1,
        flexDirection: 'column', justifyContent: 'center', px: 8,
        bgcolor: 'background.toolbar', color: 'white', position: 'relative'
      }}>
        <motion.div
          style={{
            position: 'absolute', top: -50, left: -50, width: 300, height: 300,
            borderRadius: '50%', background: theme.palette.text.tertiary, filter: 'blur(120px)'
          }}
        />

        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <Typography variant="overline" sx={{ color: theme.palette.text.tertiary, fontWeight: 900, letterSpacing: 4 }}>
            DAT ECOSYSTEM
          </Typography>
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '4.2rem', lineHeight: 1.1, mb: 2 }}>
            Mastery <br />Starts <span style={{ color: theme.palette.text.tertiary }}>Here.</span>
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.6, maxWidth: 400 }}>
            Secure portal for the Learning Management System.
          </Typography>
        </motion.div>
      </Box>

      {/* RIGHT: Form Side */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box component={motion.div} variants={containerVars} initial="hidden" animate="visible" sx={{ width: '100%', maxWidth: 400 }}>
          <Stack spacing={4}>
            <motion.div variants={itemVars}>
              <img src="/dat logo.png" width={55} alt="Logo" />
              <Typography variant="h4" fontWeight={900} sx={{ mt: 2 }}>Portal Login</Typography>
              <Box sx={{ width: 40, height: 4, bgcolor: theme.palette.text.tertiary, mt: 1, borderRadius: 2 }} />
            </motion.div>

            <AnimatePresence>
              {generalError && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{generalError}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Stack component="form" onSubmit={handleLogin} spacing={2.5}>
              <motion.div variants={itemVars}>
                <TextField
                  fullWidth
                  label="Company ID"
                  variant="filled"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  error={!!fieldErrors.companyCode}
                  helperText={fieldErrors.companyCode}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <MdBusiness size={20} style={{ marginRight: 12, marginTop: 12, opacity: 0.5 }} />
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: fieldErrors.companyCode ? '1px solid red' : `1px solid ${theme.palette.divider}`
                    }
                  }}
                />
              </motion.div>

              <motion.div variants={itemVars}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="filled"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: <MdFingerprint size={20} style={{ marginRight: 12, marginTop: 12, opacity: 0.5 }} />,
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiFilledInput-root': {
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: fieldErrors.password ? '1px solid red' : `1px solid ${theme.palette.divider}`
                    }
                  }}
                />
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Link onClick={() => setOpen(true)} sx={{ cursor: 'pointer', color: 'text.tertiary', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>
                    Forgot Secret?
                  </Link>
                </Box>
              </motion.div>

              <motion.div variants={itemVars} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    py: 1.8, borderRadius: 2, fontWeight: 900,
                    bgcolor: theme.palette.text.tertiary,
                    '&:hover': { bgcolor: theme.palette.text.tertiary, opacity: 0.9 }
                  }}
                >
                  {isLoading ? 'VERIFYING...' : 'ENTER SYSTEM'}
                </Button>
              </motion.div>
            </Stack>

            <motion.div variants={itemVars}>
              <Divider><Typography variant="caption" color="text.disabled">SECURE ACCESS</Typography></Divider>
            </motion.div>
          </Stack>
        </Box>
      </Box>

      <ForgotPassword open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
}