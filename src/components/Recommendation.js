import React, { useEffect, useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  CircularProgress, 
  Box, 
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { formatDayLong } from '../i18n/locales';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchCalendarSelections } from '../services';
import { TIME_SLOTS } from '../pages/CalendarUtils';
import { buildRecommendations } from '../utils/recommendation';
import { useTheme } from '@mui/material/styles';

const Recommendation = ({ calendarId, currentUserName, currentUserSelections, onClose }) => {
    const { t, language } = useLanguage();
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [recommendedDates, setRecommendedDates] = useState([]);
    const [currentDateIndex, setCurrentDateIndex] = useState(0);

    const handlePrevDate = () => {
        setCurrentDateIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextDate = () => {
        setCurrentDateIndex((prev) => (prev < recommendedDates.length - 1 ? prev + 1 : prev));
    };

    const analyzeDates = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch all user selections
            let allUserSelections = await fetchCalendarSelections(calendarId);
            // Remove any existing entry for the current user
            allUserSelections = allUserSelections.filter(user => user.userId !== currentUserName);

            // Include current user selections
            const currentUserData = {
                userId: currentUserName,
                selectedDays: currentUserSelections
            };

            const completeSelections = [...allUserSelections, currentUserData];

            // Ranking de fechas recomendadas (fecha + mejor franja)
            setRecommendedDates(buildRecommendations(completeSelections));
            setLoading(false);
        } catch (error) {
            console.error('Error analyzing dates:', error);
            setLoading(false);
        }
    }, [calendarId, currentUserName, currentUserSelections]);

    useEffect(() => {
        analyzeDates();
    }, [analyzeDates]);

    const currentRecommendation = recommendedDates[currentDateIndex];

    // Helper to ensure unique users in breakdown
    const unique = arr => Array.from(new Set(arr));

    return (
        <Dialog 
            open={true} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            fullScreen={{ xs: true, sm: false }}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, sm: 2 },
                    border: { xs: "none", sm: "1px solid #E5E5EA" },
                    maxHeight: { xs: "100vh", sm: "90vh" },
                    margin: { xs: 0, sm: 2 },
                    width: { xs: "100vw", sm: "auto" }
                }
            }}
        >
            {/* Header */}
            <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
                        <Box
                            sx={{
                                width: { xs: 40, sm: 48 },
                                height: { xs: 40, sm: 48 },
                                borderRadius: 2,
                                backgroundColor: "#F0F9FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #007AFF"
                            }}
                        >
                            <TrendingUpIcon sx={{ color: "#007AFF", fontSize: { xs: 20, sm: 24 } }} />
                        </Box>
                        <Box>
                            <Typography 
                                variant="h5" 
                                fontWeight={600} 
                                color={theme.palette.mode === 'dark' ? '#FFF' : '#1C1C1E'}
                                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                            >
                                {t('recommendedDates')}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="#8E8E93"
                                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                            >
                                {t('basedOnAvailability')}
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Box>

            <Divider />

            <DialogContent sx={{ p: 0, overflow: "auto" }}>
                {loading ? (
                    <Box sx={{ p: { xs: 4, sm: 6 }, textAlign: "center" }}>
                        <CircularProgress sx={{ color: "#007AFF", mb: 2 }} />
                        <Typography 
                            color="#8E8E93"
                            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                            {t('analyzingAvailabilities')}
                        </Typography>
                    </Box>
                ) : recommendedDates.length === 0 ? (
                    <Box sx={{ p: { xs: 4, sm: 6 }, textAlign: "center" }}>
                        <CalendarIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: "#C7C7CC", mb: 2 }} />
                        <Typography 
                            variant="h6" 
                            color="#1C1C1E" 
                            sx={{ mb: 1, fontSize: { xs: "1.125rem", sm: "1.25rem" } }}
                        >
                            {t('noAvailableDates')}
                        </Typography>
                        <Typography 
                            color="#8E8E93"
                            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                        >
                            {t('noPositiveAvailability')}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        {/* Date Navigation */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                mb: { xs: 2, sm: 3 },
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#FAFAFA",
                                border: "1px solid #E5E5EA",
                                borderRadius: 2,
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <IconButton
                                    onClick={handlePrevDate}
                                    disabled={currentDateIndex === 0}
                                    size={window.innerWidth < 600 ? "small" : "medium"}
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : "white",
                                        border: "1px solid #E0E0E0",
                                        "&:hover": { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.action.hover : "#F5F5F5" },
                                        "&:disabled": { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#FAFAFA", color: "#C7C7CC" },
                                        width: { xs: 36, sm: 44 },
                                        height: { xs: 36, sm: 44 }
                                    }}
                                >
                                    <NavigateBeforeIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                                </IconButton>

                                <Box textAlign="center" sx={{ flex: 1, mx: { xs: 1, sm: 2 } }}>
                                    <Typography 
                                        variant="h4" 
                                        fontWeight={700} 
                                        color={theme.palette.mode === 'dark' ? '#FFF' : '#1C1C1E'}
                                        sx={{ 
                                            mb: 0.5,
                                            fontSize: { xs: "1rem", sm: "1.5rem" },
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {currentRecommendation && formatDayLong(new Date(currentRecommendation.date), language)}
                                    </Typography>
                                    <Stack 
                                        direction={{ xs: "column", sm: "row" }} 
                                        alignItems="center" 
                                        justifyContent="center" 
                                        spacing={1}
                                        sx={{ flexWrap: "wrap" }}
                                    >
                                        <Typography 
                                            variant="body2" 
                                            color="#8E8E93"
                                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                        >
                                            {t('recommendation')} {currentDateIndex + 1} {t('of')} {recommendedDates.length}
                                        </Typography>
                                        <Chip
                                            label={`${t('score')}: ${currentRecommendation?.score.toFixed(1)}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#E8F5E8",
                                                color: "#2E7D32",
                                                fontWeight: 500,
                                                fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                                height: { xs: 20, sm: 24 }
                                            }}
                                        />
                                        {currentRecommendation?.bestSlot && (
                                            <Chip
                                                label={`🕐 ${t('bestTimeSlot')}: ${t('slot_' + currentRecommendation.bestSlot)}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#E3F2FD",
                                                    color: "#1565C0",
                                                    fontWeight: 600,
                                                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                                    height: { xs: 20, sm: 24 }
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Box>

                                <IconButton
                                    onClick={handleNextDate}
                                    disabled={currentDateIndex === recommendedDates.length - 1}
                                    size={window.innerWidth < 600 ? "small" : "medium"}
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : "white",
                                        border: "1px solid #E0E0E0",
                                        "&:hover": { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.action.hover : "#F5F5F5" },
                                        "&:disabled": { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#FAFAFA", color: "#C7C7CC" },
                                        width: { xs: 36, sm: 44 },
                                        height: { xs: 36, sm: 44 }
                                    }}
                                >
                                    <NavigateNextIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                                </IconButton>
                            </Stack>
                        </Paper>

                        {/* Summary Cards */}
                        {currentRecommendation && (
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
                                <Card elevation={0} sx={{ flex: 1, border: "1px solid #E8F5E8" }}>
                                    <CardContent sx={{ 
                                        textAlign: "center", 
                                        p: { xs: 1.5, sm: 2 },
                                        "&:last-child": { pb: { xs: 1.5, sm: 2 } }
                                    }}>
                                        <CheckIcon sx={{ 
                                            fontSize: { xs: 24, sm: 32 }, 
                                            color: "#28A745", 
                                            mb: { xs: 0.5, sm: 1 } 
                                        }} />
                                        <Typography 
                                            variant="h3" 
                                            fontWeight={700} 
                                            color="#28A745"
                                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                                        >
                                            {currentRecommendation.counts.yes}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="#155724"
                                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                        >
                                            {t('available')}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card elevation={0} sx={{ flex: 1, border: "1px solid #FFF3CD" }}>
                                    <CardContent sx={{ 
                                        textAlign: "center", 
                                        p: { xs: 1.5, sm: 2 },
                                        "&:last-child": { pb: { xs: 1.5, sm: 2 } }
                                    }}>
                                        <HelpIcon sx={{ 
                                            fontSize: { xs: 24, sm: 32 }, 
                                            color: "#FF9500", 
                                            mb: { xs: 0.5, sm: 1 } 
                                        }} />
                                        <Typography 
                                            variant="h3" 
                                            fontWeight={700} 
                                            color="#FF9500"
                                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                                        >
                                            {currentRecommendation.counts.maybe}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="#856404"
                                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                        >
                                            {t('maybe')}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card elevation={0} sx={{ flex: 1, border: "1px solid #F8D7DA" }}>
                                    <CardContent sx={{ 
                                        textAlign: "center", 
                                        p: { xs: 1.5, sm: 2 },
                                        "&:last-child": { pb: { xs: 1.5, sm: 2 } }
                                    }}>
                                        <CancelIcon sx={{ 
                                            fontSize: { xs: 24, sm: 32 }, 
                                            color: "#FF3B30", 
                                            mb: { xs: 0.5, sm: 1 } 
                                        }} />
                                        <Typography 
                                            variant="h3" 
                                            fontWeight={700} 
                                            color="#FF3B30"
                                            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                                        >
                                            {currentRecommendation.counts.no}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="#721C24"
                                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                                        >
                                            {t('notAvailable')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Stack>
                        )}

                        {/* Time-slot breakdown */}
                        {currentRecommendation?.anySlots && (
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "1px solid #E5E5EA",
                                    borderRadius: 2,
                                    p: { xs: 2, sm: 2.5 },
                                    mb: { xs: 2, sm: 3 }
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    sx={{ mb: 1.5, color: theme.palette.mode === 'dark' ? '#FFF' : '#1C1C1E' }}
                                >
                                    {t('timeSlotsBreakdown')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {TIME_SLOTS.filter(s => currentRecommendation.slotCounts[s] > 0).map(s => {
                                        const isBest = s === currentRecommendation.bestSlot;
                                        return (
                                            <Chip
                                                key={s}
                                                label={`${t('slot_' + s)} · ${currentRecommendation.slotCounts[s]}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: isBest ? '#007AFF' : '#F0F9FF',
                                                    color: isBest ? '#fff' : '#1565C0',
                                                    fontWeight: isBest ? 700 : 500,
                                                    border: '1px solid #007AFF'
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            </Paper>
                        )}

                        {/* Detailed Breakdown */}
                        {currentRecommendation && (
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "1px solid #E5E5EA",
                                    borderRadius: 2,
                                    overflow: "hidden"
                                }}
                            >
                                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : "#FAFAFA", borderBottom: "1px solid #E5E5EA" }}>
                                    <Typography variant="h6" fontWeight={600} color={theme.palette.mode === 'dark' ? '#FFF' : '#1C1C1E'}>
                                        {t('breakdownByPerson')}
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 0 }}>
                                    {unique(currentRecommendation.details.available).length > 0 && (
                                        <Box>
                                            <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : "#F8F9FA" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <CheckIcon sx={{ fontSize: 20, color: "#28A745" }} />
                                                    <Typography variant="subtitle1" fontWeight={600} color="#28A745">
                                                        {t('available')}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <List sx={{ py: 0 }}>
                                                {unique(currentRecommendation.details.available).map((user, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: "1px solid #F2F2F7" }}>
                                                        <ListItemIcon>
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#28A745",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontSize: 12,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {user.charAt(0).toUpperCase()}
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText primary={user} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}

                                    {unique(currentRecommendation.details.maybe).length > 0 && (
                                        <Box>
                                            <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : "#F8F9FA" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <HelpIcon sx={{ fontSize: 20, color: "#FF9500" }} />
                                                    <Typography variant="subtitle1" fontWeight={600} color="#FF9500">
                                                        {t('maybe')}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <List sx={{ py: 0 }}>
                                                {unique(currentRecommendation.details.maybe).map((user, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: "1px solid #F2F2F7" }}>
                                                        <ListItemIcon>
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#FF9500",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontSize: 12,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {user.charAt(0).toUpperCase()}
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText primary={user} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}

                                    {unique(currentRecommendation.details.unavailable).length > 0 && (
                                        <Box>
                                            <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : "#F8F9FA" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <CancelIcon sx={{ fontSize: 20, color: "#FF3B30" }} />
                                                    <Typography variant="subtitle1" fontWeight={600} color="#FF3B30">
                                                        {t('notAvailable')}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <List sx={{ py: 0 }}>
                                                {unique(currentRecommendation.details.unavailable).map((user, index) => (
                                                    <ListItem key={index} sx={{ borderBottom: "1px solid #F2F2F7" }}>
                                                        <ListItemIcon>
                                                            <Box
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#FF3B30",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "white",
                                                                    fontSize: 12,
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {user.charAt(0).toUpperCase()}
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText primary={user} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        )}
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3 }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
                    sx={{
                        backgroundColor: "#007AFF",
                        borderRadius: 1.5,
                        px: 4,
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#0056CC",
                        },
                    }}
                >
                    {t('close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Recommendation;
