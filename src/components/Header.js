import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Divider,
  Chip,
  Avatar,
  Select,
  MenuItem
} from '@mui/material';
import { LANGUAGE_NAMES } from '../i18n/locales';
import {
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeMode } from '../contexts/ThemeContext';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage();
  const { mode, toggleMode, isDark } = useThemeMode();

  const isHomePage = location.pathname === '/';

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(20px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1.5, minHeight: '72px' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
              transition: 'opacity 0.2s ease'
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src="/images/KDEMOS_logo.png"
              alt="Kdemos Logo"
              sx={{
                height: 40,
                width: 'auto',
                mr: 1.5,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
              }}
            >
              Kdemos
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Navigation */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: isHomePage ? '#007AFF' : '#8E8E93',
                fontWeight: 500,
                textTransform: 'none',
                px: 2,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: '#007AFF',
                },
              }}
            >
              {t('home')}
            </Button>

            <Button
              component="a"
              href="/blog/"
              sx={{
                color: '#8E8E93',
                fontWeight: 500,
                textTransform: 'none',
                px: 2,
                borderRadius: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: '#007AFF',
                },
              }}
            >
              Blog
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'divider' }} />

            {/* Language Selector */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <LanguageIcon sx={{ fontSize: 18, color: '#8E8E93' }} />
              <Select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                variant="standard"
                disableUnderline
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#007AFF',
                  '& .MuiSelect-select': { py: 0.5, pr: 3 },
                }}
              >
                {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                  <MenuItem key={code} value={code} sx={{ fontSize: '0.875rem' }}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'divider' }} />

            {/* Theme Toggle */}
            <IconButton
              onClick={toggleMode}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: 'primary.main',
                },
                width: 36,
                height: 36,
              }}
            >
              {isDark ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Stack>

          {/* Developer Section */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ display: { xs: 'none', lg: 'flex' } }}>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'divider' }} />
            
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1}
              component="a"
              href="https://francordel.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
                transition: 'opacity 0.2s ease'
              }}
            >
              <Avatar
                alt="Fran Cortés"
                src="/images/FranCortes2.webp"
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: 2,
                  borderColor: 'divider'
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                by Fran Cortés-Delgado
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton
                href="https://www.linkedin.com/in/francisco-jose-cortes-delgado/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'text.secondary',
                  width: 32,
                  height: 32,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 122, 255, 0.04)',
                    color: 'primary.main' 
                  }
                }}
              >
                <LinkedInIcon sx={{ fontSize: 18 }} />
              </IconButton>

              <IconButton
                href="https://github.com/francordel"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'text.secondary',
                  width: 32,
                  height: 32,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 122, 255, 0.04)',
                    color: 'primary.main' 
                  }
                }}
              >
                <GitHubIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Mobile Navigation */}
          <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                color: isHomePage ? 'primary.main' : 'text.secondary',
                '&:hover': { backgroundColor: 'rgba(0, 122, 255, 0.04)' },
              }}
            >
              <HomeIcon />
            </IconButton>
            
            {/* Mobile Language Selector */}
            <Select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'primary.main',
                '& .MuiSelect-select': { py: 0.5, pr: 2.5 },
              }}
              renderValue={(code) => code.toUpperCase()}
            >
              {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                <MenuItem key={code} value={code} sx={{ fontSize: '0.8rem' }}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            
            {/* Mobile Theme Toggle */}
            <IconButton
              onClick={toggleMode}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 122, 255, 0.04)',
                  color: 'primary.main',
                },
                width: 36,
                height: 36,
              }}
            >
              {isDark ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Stack>
        </Stack>

        {/* Version Badge */}
        <Chip
          label="v1.0"
          size="small"
          sx={{
            backgroundColor: '#F0F9FF',
            color: '#007AFF',
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 24,
            border: '1px solid #007AFF',
            ml: 2,
            display: { xs: 'none', sm: 'inline-flex' }
          }}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Header;

