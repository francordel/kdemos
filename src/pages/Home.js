import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Stack,
  IconButton,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Login as LoginIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Share as ShareIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Groups as GroupsIcon,
  ChatBubble as ChatIcon,
  Work as WorkIcon,
  Celebration as CelebrationIcon,
  Public as PublicIcon,
  AccessTime as AccessTimeIcon,
  Lock as LockIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";
import { calendarExists, createCalendar, generateUniqueCalendarId } from "../services";

const CONTENT = {
  es: {
    stats: [
      { value: '100%', label: 'Gratis', sub: 'Sin planes de pago ni anuncios' },
      { value: '0', label: 'Registros', sub: 'Solo escribe tu nombre y listo' },
      { value: '∞', label: 'Calendarios', sub: 'Sin límites ni caducidad' },
    ],
    whyTitle: '¿Por qué KDEMOS?',
    why: [
      { icon: null, iconKey: 'bolt', title: 'Listo en 30 segundos', body: 'Sin crear cuenta. Sin instalar nada. Escribe tu nombre, elige los días candidatos y comparte el enlace en el grupo. Así de simple.' },
      { iconKey: 'groups', title: 'Pensado para WhatsApp y Telegram', body: 'Un clic y el enlace se abre en el chat de tu grupo. Cada persona marca su disponibilidad en cualquier dispositivo, sin fricción.' },
      { iconKey: 'lock', title: 'Tiempo real sin cuentas', body: 'Todos ven las disponibilidades actualizarse al instante. No hace falta que nadie se registre ni descargue nada.' },
      { iconKey: 'access', title: 'Disponibilidad por franjas horarias', body: 'Además del día, cada persona puede indicar opcionalmente en qué franjas puede quedar: por la mañana, a media mañana, a la hora de la comida, por la tarde, por la noche o de madrugada. Así encontráis no solo el mejor día, sino también la mejor hora.' },
      { iconKey: 'public', title: 'Alternativa a Doodle, gratis de verdad', body: 'Doodle tiene límites y anuncios en el plan gratuito. KDEMOS es 100% gratis para siempre: encuestas ilimitadas, sin sorpresas.' },
    ],
    useCasesTitle: '¿Para qué puedes usarlo?',
    useCases: [
      { iconKey: 'celebration', title: 'Quedadas de amigos', body: 'Organiza cenas, viajes o escapadas de fin de semana sin que el grupo de WhatsApp acabe en caos. Comparte el enlace y deja que cada uno marque cuándo puede.' },
      { iconKey: 'work', title: 'Reuniones de equipo', body: 'Coordina equipos remotos sin obligar a nadie a crear una cuenta. Comparte en Slack, Teams o por correo y decide el horario de la semana que viene.' },
      { iconKey: 'groups', title: 'Eventos de comunidad', body: 'Asociaciones, clubs deportivos, clases particulares: comparte el enlace en el grupo de Telegram o en redes y recoge disponibilidades de 10 o de 100 personas.' },
      { iconKey: 'chat', title: 'Familias que coordinan', body: 'Organiza la reunión de Navidad, el cumpleaños del abuelo o las vacaciones de verano sin que la mitad de la familia diga que "no sabe si puede".' },
      { iconKey: 'access', title: 'Clases y actividades grupales', body: 'Profesores, entrenadores, monitores: crea un calendario para encontrar el horario que mejor le viene a todos tus alumnos.' },
      { iconKey: 'public', title: 'Cualquier cosa, en cualquier idioma', body: 'KDEMOS funciona igual en español que en inglés. Comparte el enlace con personas de cualquier país y el calendario se entiende solo.' },
    ],
    compareTitle: 'KDEMOS vs la competencia',
    compareHeaders: ['Característica', 'KDEMOS', 'Doodle', 'When2meet'],
    compareRows: [
      ['Precio', '✅ Gratis siempre', 'Limitado / de pago', '✅ Gratis'],
      ['Registro necesario', '✅ No', '❌ Sí (organizador)', '✅ No'],
      ['Anuncios', '✅ Sin anuncios', '❌ Sí (plan gratis)', '✅ Sin anuncios'],
      ['Uso en móvil', '✅ Excelente', '✅ Bueno', '❌ Difícil (táctil)'],
      ['Idioma español', '✅ Sí', '✅ Sí', '❌ Solo inglés'],
      ['Tiempo real', '✅ Sí', '✅ Sí', '✅ Sí'],
      ['Encuestas ilimitadas', '✅ Sí', '❌ Limitadas (gratis)', '✅ Sí'],
    ],
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿Cómo organizo una quedada por WhatsApp?', a: 'Crea un calendario en KDEMOS, comparte el enlace en el grupo de WhatsApp y cada persona marca los días que le vienen bien. El mejor día para quedar sale solo.' },
      { q: '¿KDEMOS es gratis? ¿Necesito registrarme?', a: 'Es gratis y sin registro: solo escribes tu nombre y ya puedes crear o unirte a un calendario. No hay plan de pago ni límites.' },
      { q: '¿Es una alternativa a Doodle en español?', a: 'Sí. KDEMOS hace lo esencial de Doodle, encontrar el día que mejor le viene a todos, gratis, en español y sin crear cuenta. Sin anuncios ni restricciones.' },
      { q: '¿Sirve para reuniones de trabajo?', a: 'Claro: comparte el enlace del calendario por Slack, Teams o correo, igual que harías con tus amigos por WhatsApp.' },
      { q: '¿Cuántas personas pueden participar en un calendario?', a: 'No hay límite. Puedes compartir el enlace con 5 amigos o con un grupo de 100 personas de una asociación.' },
      { q: '¿Puedo indicar también la hora, no solo el día?', a: 'Sí. De forma opcional, al marcar un día como disponible puedes elegir en qué franjas puedes quedar: por la mañana, a media mañana, a la hora de la comida, por la tarde, por la noche o de madrugada. La recomendación te dirá el mejor día y también la mejor franja horaria.' },
      { q: '¿Los calendarios caducan?', a: 'No. Tu calendario permanece activo indefinidamente y cualquiera con el enlace puede seguir marcando disponibilidad.' },
    ],
  },
  en: {
    stats: [
      { value: '100%', label: 'Free', sub: 'No paid plans, no ads ever' },
      { value: '0', label: 'Sign-ups', sub: 'Just type your name and go' },
      { value: '∞', label: 'Calendars', sub: 'No limits, no expiry' },
    ],
    whyTitle: 'Why KDEMOS?',
    why: [
      { iconKey: 'bolt', title: 'Ready in 30 seconds', body: 'No account. No install. Type your name, pick candidate days and share the link in your group. That simple.' },
      { iconKey: 'groups', title: 'Built for WhatsApp and Telegram', body: 'One tap and the link opens in your group chat. Everyone marks their availability on any device, zero friction.' },
      { iconKey: 'lock', title: 'Real-time without accounts', body: 'Everyone sees availability update instantly. Nobody needs to register or download anything.' },
      { iconKey: 'access', title: 'Availability by time of day', body: 'On top of the day, each person can optionally mark which time slots work: morning, mid-morning, lunch time, afternoon, evening or late night. So you find not just the best day, but the best time too.' },
      { iconKey: 'public', title: 'A Doodle alternative that is actually free', body: "Doodle has limits and ads on its free plan. KDEMOS is 100% free forever: unlimited polls, no surprises." },
    ],
    useCasesTitle: 'What can you use it for?',
    useCases: [
      { iconKey: 'celebration', title: 'Friend meetups', body: 'Organize dinners, trips or weekend getaways without the WhatsApp group turning into chaos. Share the link and let everyone mark when they can.' },
      { iconKey: 'work', title: 'Team meetings', body: 'Coordinate remote teams without forcing anyone to create an account. Share in Slack, Teams or email and decide next week\'s meeting time.' },
      { iconKey: 'groups', title: 'Community events', body: 'Associations, sports clubs, private classes: share the link in a Telegram group or on social media and collect availability from 10 or 100 people.' },
      { iconKey: 'chat', title: 'Family coordination', body: 'Organize Christmas dinner, grandpa\'s birthday or summer holidays without half the family saying "not sure if I can make it."' },
      { iconKey: 'access', title: 'Classes and group activities', body: 'Teachers, coaches, instructors: create a calendar to find the time slot that works best for all your students.' },
      { iconKey: 'public', title: 'Anything, in any language', body: 'KDEMOS works the same in English as in Spanish. Share the link with people from any country and the calendar speaks for itself.' },
    ],
    compareTitle: 'KDEMOS vs the competition',
    compareHeaders: ['Feature', 'KDEMOS', 'Doodle', 'When2meet'],
    compareRows: [
      ['Price', '✅ Always free', 'Limited / paid', '✅ Free'],
      ['Sign-up required', '✅ No', '❌ Yes (organizer)', '✅ No'],
      ['Ads', '✅ No ads', '❌ Yes (free plan)', '✅ No ads'],
      ['Mobile usability', '✅ Excellent', '✅ Good', '❌ Poor (touch)'],
      ['Spanish language', '✅ Yes', '✅ Yes', '❌ English only'],
      ['Real-time updates', '✅ Yes', '✅ Yes', '✅ Yes'],
      ['Unlimited polls', '✅ Yes', '❌ Limited (free)', '✅ Yes'],
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'How do I plan a meetup over WhatsApp?', a: 'Create a calendar on KDEMOS, share the link in your WhatsApp group and everyone marks the days that work for them. The best day pops out on its own.' },
      { q: 'Is KDEMOS free? Do I need an account?', a: 'It is free and requires no sign-up: just type your name and create or join a calendar. No paid plan, no limits.' },
      { q: 'Is it a Doodle alternative?', a: 'Yes. KDEMOS does the essential part of Doodle, finding the day that works for everyone, for free and without an account. No ads, no restrictions.' },
      { q: 'Does it work for team meetings?', a: 'Sure: share the calendar link over Slack, Teams or email, just like you would with friends over WhatsApp.' },
      { q: 'How many people can join a calendar?', a: 'There is no limit. Share the link with 5 friends or a group of 100 people from an association.' },
      { q: 'Can I set the time of day, not just the day?', a: 'Yes. Optionally, when you mark a day as available you can choose which time slots work for you: morning, mid-morning, lunch time, afternoon, evening or late night. The recommendation shows the best day and the best time slot too.' },
      { q: 'Do calendars expire?', a: 'No. Your calendar stays active indefinitely and anyone with the link can keep marking their availability.' },
    ],
  },
};

const ICON_MAP = {
  bolt: <BoltIcon sx={{ fontSize: 28 }} />,
  groups: <GroupsIcon sx={{ fontSize: 28 }} />,
  lock: <LockIcon sx={{ fontSize: 28 }} />,
  public: <PublicIcon sx={{ fontSize: 28 }} />,
  celebration: <CelebrationIcon sx={{ fontSize: 28 }} />,
  work: <WorkIcon sx={{ fontSize: 28 }} />,
  chat: <ChatIcon sx={{ fontSize: 28 }} />,
  access: <AccessTimeIcon sx={{ fontSize: 28 }} />,
};

function Home() {
  const { t, language } = useLanguage();
  const [name, setName] = useState("");
  const [calendarId, setCalendarId] = useState("");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedCalendarId, setGeneratedCalendarId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const navigate = useNavigate();

  const handleCreateCalendarClick = () => {
    setShowCreateDialog(true);
  };

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleCreateCalendarSubmit = async () => {
    if (!name.trim()) {
      setErrorMessage(t('enterName'));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Generate a unique calendar ID
      const idResult = await generateUniqueCalendarId();
      
      if (!idResult.success) {
        setErrorMessage(idResult.error || t('errorCreatingCalendar'));
        setIsLoading(false);
        return;
      }

      // Create the calendar
      const createResult = await createCalendar(idResult.calendarId);
      
      if (!createResult.success) {
        setErrorMessage(createResult.error || t('errorCreatingCalendar'));
        setIsLoading(false);
        return;
      }

      // Success!
      setGeneratedCalendarId(idResult.calendarId);
      setShowCreateDialog(false);
      setShowSuccessDialog(true);
      setIsLoading(false);

    } catch (error) {
      console.error("Error creating calendar:", error);
      setErrorMessage(t('errorUnexpected'));
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!name.trim() || !calendarId.trim()) {
      setErrorMessage(t('enterNameAndId'));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const exists = await calendarExists(calendarId);
      if (!exists) {
        setErrorMessage(t('calendarNotExists'));
        setIsLoading(false);
        return;
      }

      // Calendar exists, navigate to it
      navigate(`/${calendarId}?name=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error("Error checking calendar:", error);
      setErrorMessage(t('errorCheckingCalendar'));
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Navigate to the created calendar
    navigate(`/${generatedCalendarId}?name=${encodeURIComponent(name)}`);
  };

  const resetForm = () => {
    setName("");
    setCalendarId("");
    setErrorMessage("");
    setGeneratedCalendarId("");
    setIsLoading(false);
  };

  const handleDialogClose = (dialogSetter) => {
    dialogSetter(false);
    resetForm();
  };

  const getShareableLink = () => {
    return `${window.location.origin}/${generatedCalendarId}`;
  };

  const getShareMessage = () => {
    return `${t('shareMessage')} ${generatedCalendarId} ${t('shareMessageEnd')}\n\n${getShareableLink()}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShareableLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(getShareMessage());
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareTelegram = () => {
    const message = encodeURIComponent(getShareMessage());
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(getShareableLink())}&text=${message}`;
    window.open(telegramUrl, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('appTitle'),
          text: t('shareMessage'),
          url: getShareableLink(),
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: { xs: 1, md: 2 }, // antes: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 2, md: 4 }, // antes: { xs: 4, md: 8 }
          }}
        >
          {/* Hero Section */}
          <Box sx={{ mb: 3 }}> {/* antes: mb: 6 */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.1,
                mb: 2,
                letterSpacing: "-0.02em",
              }}
            >
              {t('appTitle')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#8E8E93",
                fontWeight: 400,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.5,
                maxWidth: 600,
                mx: "auto",
                mb: 4, // antes: mb: 6
              }}
            >
              {t('appSubtitle')}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateCalendarClick}
              sx={{
                backgroundColor: "#007AFF",
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "#0056CC",
                  boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
                },
                minWidth: 200,
              }}
            >
              {t('createCalendar')}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLoginClick}
              sx={{
                borderColor: "#007AFF",
                color: "#007AFF",
                fontWeight: 500,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#0056CC",
                  backgroundColor: "rgba(0, 122, 255, 0.04)",
                },
                minWidth: 200,
              }}
            >
              {t('joinCalendar')}
            </Button>
          </Stack>

          {/* Stats Band */}
          {(() => {
            // Contenido de marketing solo en es/en; el resto de idiomas ven la
            // versión inglesa (sus landings /de/, /fr/... ya están traducidas).
            const c = CONTENT[language] || (language === 'es' ? CONTENT.es : CONTENT.en);
            return (
              <>
                <Stack
                  component="section"
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="center"
                  divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'divider', display: { xs: 'none', sm: 'block' } }} />}
                  sx={{ mt: 5, mb: 6, gap: { xs: 2, sm: 0 } }}
                >
                  {c.stats.map((s) => (
                    <Box key={s.label} sx={{ flex: 1, textAlign: 'center', px: 3, py: { xs: 1, sm: 0 } }}>
                      <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, color: '#007AFF', lineHeight: 1 }}>{s.value}</Typography>
                      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>{s.label}</Typography>
                      <Typography variant="body2" sx={{ color: '#8E8E93', mt: 0.25 }}>{s.sub}</Typography>
                    </Box>
                  ))}
                </Stack>

                {/* Why KDEMOS */}
                <Box component="section" sx={{ mb: 7 }}>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 3 }}>
                    {c.whyTitle}
                  </Typography>
                  <Grid container spacing={2}>
                    {c.why.map((item) => (
                      <Grid item xs={12} sm={6} key={item.title}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ color: '#007AFF' }}>{ICON_MAP[item.iconKey]}</Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.title}</Typography>
                          <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.6 }}>{item.body}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Use Cases */}
                <Box component="section" sx={{ mb: 7 }}>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 3 }}>
                    {c.useCasesTitle}
                  </Typography>
                  <Grid container spacing={2}>
                    {c.useCases.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.title}>
                        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ color: '#007AFF' }}>{ICON_MAP[item.iconKey]}</Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.title}</Typography>
                          <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.6 }}>{item.body}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Comparison Table */}
                <Box component="section" sx={{ mb: 7, textAlign: 'left' }}>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 3 }}>
                    {c.compareTitle}
                  </Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#007AFF' }}>
                          {c.compareHeaders.map((h) => (
                            <TableCell key={h} sx={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {c.compareRows.map((row, i) => (
                          <TableRow key={i} sx={{ '&:nth-of-type(even)': { backgroundColor: 'rgba(0,0,0,0.02)' } }}>
                            {row.map((cell, j) => (
                              <TableCell key={j} sx={{ color: j === 0 ? 'text.primary' : '#8E8E93', fontWeight: j === 0 ? 600 : 400, whiteSpace: 'nowrap' }}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* FAQ */}
                <Box component="section" sx={{ mb: 4, textAlign: 'left', maxWidth: 700, mx: 'auto' }}>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, fontWeight: 700, color: 'text.primary', textAlign: 'center', mb: 3 }}>
                    {c.faqTitle}
                  </Typography>
                  <Stack spacing={2}>
                    {c.faq.map((item) => (
                      <Paper key={item.q} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{item.q}</Typography>
                        <Typography variant="body2" sx={{ color: '#8E8E93', lineHeight: 1.6 }}>{item.a}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </>
            );
          })()}
        </Box>
      </Container>

      {/* Create Calendar Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => handleDialogClose(setShowCreateDialog)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {t('createNewCalendar')}
            </Typography>
            <IconButton 
              onClick={() => handleDialogClose(setShowCreateDialog)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 3 }}>
            {t('enterNameToStart')}
          </Typography>
          
          <TextField
            label={t('yourName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover fieldset": {
                  borderColor: "#007AFF",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#007AFF",
                },
              },
            }}
          />
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowCreateDialog)} 
            disabled={isLoading}
            sx={{ 
              color: "#8E8E93",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleCreateCalendarSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 3,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056CC",
              },
              "&:disabled": {
                backgroundColor: "#C7C7CC",
              },
            }}
          >
            {isLoading ? t('creating') : t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Dialog */}
      <Dialog 
        open={showLoginDialog} 
        onClose={() => handleDialogClose(setShowLoginDialog)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              {t('joinCalendarTitle')}
            </Typography>
            <IconButton 
              onClick={() => handleDialogClose(setShowLoginDialog)}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 3 }}>
            {t('enterNameAndId')}
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              label={t('yourName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
            
            <TextField
              label={t('calendarId')}
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={isLoading}
              placeholder="ejemplo: amazing-calendar-123"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#007AFF",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#007AFF",
                  },
                },
              }}
            />
          </Stack>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => handleDialogClose(setShowLoginDialog)} 
            disabled={isLoading}
            sx={{ 
              color: "#8E8E93",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
            }}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleLoginSubmit} 
            variant="contained"
            disabled={isLoading || !name.trim() || !calendarId.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: 1.5,
              px: 3,
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0056CC",
              },
              "&:disabled": {
                backgroundColor: "#C7C7CC",
              },
            }}
          >
            {isLoading ? t('verifying') : t('join')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleSuccessDialogClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid #E5E5EA",
          }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
          <Typography variant="h5" fontWeight={700} color="#1C1C1E" sx={{ mb: 1 }}>
            {t('calendarCreated')}
          </Typography>
          <Typography variant="body2" color="#8E8E93">
            {t('calendarCreatedDesc')}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: "center", pt: 2 }}>
          {/* Link Display */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#F0F9FF",
              border: "1px solid #007AFF",
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Typography variant="body2" sx={{ color: "#007AFF", mb: 1, fontWeight: 500 }}>
              {t('calendarLink')}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#1C1C1E", 
                fontWeight: 500, 
                fontSize: "0.9rem",
                wordBreak: "break-all",
                mb: 2,
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 2,
              }}
            >
              {getShareableLink()}
            </Typography>
            
            {/* Sharing Buttons */}
            <Stack direction="row" spacing={1} justifyContent="center">
              <IconButton
                onClick={copyToClipboard}
                sx={{
                  color: copySuccess ? "#28A745" : "#007AFF",
                  backgroundColor: copySuccess ? "rgba(40, 167, 69, 0.1)" : "rgba(0, 122, 255, 0.1)",
                  "&:hover": { 
                    backgroundColor: copySuccess ? "rgba(40, 167, 69, 0.2)" : "rgba(0, 122, 255, 0.2)" 
                  },
                  width: 44,
                  height: 44,
                }}
              >
                {copySuccess ? <CheckIcon /> : <CopyIcon />}
              </IconButton>
              
              <IconButton
                onClick={shareWhatsApp}
                sx={{
                  color: "#25D366",
                  backgroundColor: "rgba(37, 211, 102, 0.1)",
                  "&:hover": { backgroundColor: "rgba(37, 211, 102, 0.2)" },
                  width: 44,
                  height: 44,
                }}
              >
                <WhatsAppIcon />
              </IconButton>
              
              <IconButton
                onClick={shareTelegram}
                sx={{
                  color: "#0088CC",
                  backgroundColor: "rgba(0, 136, 204, 0.1)",
                  "&:hover": { backgroundColor: "rgba(0, 136, 204, 0.2)" },
                  width: 44,
                  height: 44,
                }}
              >
                <TelegramIcon />
              </IconButton>
              
              {navigator.share && (
                <IconButton
                  onClick={shareNative}
                  sx={{
                    color: "#8E8E93",
                    backgroundColor: "rgba(142, 142, 147, 0.1)",
                    "&:hover": { backgroundColor: "rgba(142, 142, 147, 0.2)" },
                    width: 44,
                    height: 44,
                  }}
                >
                  <ShareIcon />
                </IconButton>
              )}
            </Stack>
          </Paper>
          
          <Typography variant="body2" color="#8E8E93" sx={{ mb: 2 }}>
            {t('shareInstructions')}
          </Typography>
          
          <Typography variant="body2" color="#616161" sx={{ fontSize: "0.8rem" }}>
            {t('mobileAppsHint')}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: "center" }}>
          <Button 
            onClick={handleSuccessDialogClose} 
            variant="contained"
            size="large"
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
            {t('continue')}
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}

export default Home;