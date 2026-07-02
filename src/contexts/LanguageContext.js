import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    
    // Home page
    appTitle: 'Calendario de Quedadas',
    appSubtitle: 'Coordina reuniones de manera eficiente. Simplifica la organización de eventos compartiendo disponibilidades con tu equipo.',
    createCalendar: 'Crear Calendario',
    joinCalendar: 'Unirse a Calendario',
    
    // Features
    noPasswords: 'Sin contraseñas',
    noPasswordsDesc: 'Acceso simple con IDs únicos generados automáticamente',
    intuitiveInterface: 'Interfaz intuitiva',
    intuitiveInterfaceDesc: 'Diseño limpio y profesional optimizado para cualquier dispositivo',
    immediateResults: 'Resultados inmediatos',
    immediateResultsDesc: 'Visualiza disponibilidades y encuentra la mejor fecha al instante',
    
    // Dialogs
    createNewCalendar: 'Crear Nuevo Calendario',
    joinCalendarTitle: 'Unirse a Calendario',
    yourName: 'Tu nombre',
    calendarId: 'ID del calendario',
    calendarCreated: '¡Calendario creado!',
    calendarCreatedDesc: 'Tu calendario se ha creado exitosamente',
    calendarLink: 'Enlace del calendario',
    shareCalendar: '¡Comparte el calendario!',
    shareCalendarDesc: 'Invita a más personas a participar',
    
    // Calendar page
    step: 'Paso',
    stepOf: 'de',
    stepOneDesc: 'Selecciona tu disponibilidad haciendo clic en cada día. En móvil, simplemente toca el día.',
    stepTwoDesc: 'Revisa tus selecciones y finaliza cuando estés conforme.',
    available: 'Disponible',
    availablePlural: 'Disponibles',
    maybe: 'Quizás',
    maybeDesc: 'Con esfuerzo',
    notAvailable: 'No disponible',
    notAvailablePlural: 'No disponibles',
    unavailable: 'No disponible',
    
    // Buttons
    cancel: 'Cancelar',
    continue: 'Continuar',
    recommendation: 'Recomendar',
    close: 'Cerrar',
    contact: 'Contacto',
    create: 'Crear',
    join: 'Unirse',
    back: 'Volver',
    backToHome: 'Volver al inicio',
    previousStep: 'Paso anterior',
    finish: 'Finalizar',
    
    // Messages
    enterName: 'Por favor, introduce tu nombre',
    enterNameAndId: 'Por favor, introduce tu nombre y el ID del calendario',
    calendarNotExists: 'El calendario no existe. Verifica el ID o crea un nuevo calendario.',
    errorCheckingCalendar: 'Error al verificar el calendario',
    errorCreatingCalendar: 'Error al crear el calendario',
    errorUnexpected: 'Error inesperado al crear el calendario',
    
    // Recommendations
    recommendedDates: 'Fechas Recomendadas',
    recommendedDatesDesc: 'Basado en las disponibilidades del equipo',
    analyzing: 'Analizando disponibilidades...', 
    analyzingAvailabilities: 'Analizando disponibilidades...', 
    noAvailableDates: 'No hay fechas disponibles',
    noAvailableDatesDesc: 'No se encontraron fechas con disponibilidad positiva.',
    noPositiveAvailability: 'No se encontraron fechas con disponibilidad positiva.',
    of: 'de',
    score: 'Puntuación',
    detailedBreakdown: 'Desglose por persona',
    breakdownByPerson: 'Desglose por persona',
    availableWithEffort: 'Disponibles con esfuerzo',
    
    // Footer
    madeWith: 'Hecho con',
    by: 'por Fran Cortés-Delgado',
    advertising: '¿Tu empresa quiere publicitarse aquí?',
    copyright: '© 2024 Calendario de Quedadas',
    
    // Welcome dialog
    welcomeToCalendar: '¡Bienvenido al calendario!',
    enterNameToStart: 'Para comenzar, por favor introduce tu nombre',
    autoRecover: '💡 Si ya has participado antes, recuperaremos tus selecciones automáticamente',
    
    // Share messages
    shareMessage: '¡Te invito a coordinar nuestra reunión! 📅\n\nÚnete al calendario',
    shareMessageEnd: 'para elegir las fechas que mejor te vayan.\n\n¡Es súper fácil y rápido! 🚀',
    shareInstructions: 'Comparte este enlace para que otros se unan al calendario',
    mobileAppsHint: '💡 En móvil, los iconos abrirán las aplicaciones correspondientes',
    
    // Loading states
    creating: 'Creando...', 
    accessing: 'Accediendo...', 
    verifying: 'Verificando...', 
    
    // Calendar vote display
    you: 'tú',
    more: 'más',
    othersVoted: 'Otros han votado',
    clearVote: 'Borrar voto',
    removeVote: 'Voto en blanco',
    blankVote: 'Voto en blanco',

    // Time slots (franjas horarias)
    timeSlotsTitle: '¿En qué franjas puedes? (opcional)',
    slot_morning: 'Por la mañana',
    slot_midMorning: 'A media mañana',
    slot_midday: 'A la hora de la comida',
    slot_afternoon: 'Por la tarde',
    slot_night: 'Por la noche',
    slot_dawn: 'De madrugada',
    save: 'Guardar',
    saving: 'Guardando...',
    bestTimeSlot: 'Mejor franja',
    timeSlotsBreakdown: 'Disponibilidad por franja'
  },
  
  en: {
    // Navigation
    home: 'Home',
    
    // Home page
    appTitle: 'Meeting Calendar',
    appSubtitle: 'Coordinate meetings efficiently. Simplify event organization by sharing availability with your team.',
    createCalendar: 'Create Calendar',
    joinCalendar: 'Join Calendar',
    
    // Features
    noPasswords: 'No passwords',
    noPasswordsDesc: 'Simple access with automatically generated unique IDs',
    intuitiveInterface: 'Intuitive interface',
    intuitiveInterfaceDesc: 'Clean and professional design optimized for any device',
    immediateResults: 'Immediate results',
    immediateResultsDesc: 'Visualize availability and find the best date instantly',
    
    // Dialogs
    createNewCalendar: 'Create New Calendar',
    joinCalendarTitle: 'Join Calendar',
    yourName: 'Your name',
    calendarId: 'Calendar ID',
    calendarCreated: 'Calendar created!',
    calendarCreatedDesc: 'Your calendar has been created successfully',
    calendarLink: 'Calendar link',
    shareCalendar: 'Share the calendar!',
    shareCalendarDesc: 'Invite more people to participate',
    
    // Calendar page
    step: 'Step',
    stepOf: 'of',
    stepOneDesc: 'Select your availability by clicking on each day. On mobile, simply tap the day.',
    stepTwoDesc: 'Review your selections and recommendation when you are satisfied.',
    available: 'Available',
    availablePlural: 'Available',
    maybe: 'Maybe',
    maybeDesc: 'With effort',
    notAvailable: 'Not available',
    notAvailablePlural: 'Not available',
    unavailable: 'Unavailable',
    
    // Buttons
    cancel: 'Cancel',
    continue: 'Continue',
    recommendation: 'Recommendation',
    saving: 'Saving',
    close: 'Close',
    contact: 'Contact',
    create: 'Create',
    join: 'Join',
    back: 'Back',
    backToHome: 'Back to home',
    previousStep: 'Previous step',
    finish: 'Finish',
    
    // Messages
    enterName: 'Please enter your name',
    enterNameAndId: 'Please enter your name and calendar ID',
    calendarNotExists: 'Calendar does not exist. Check the ID or create a new calendar.',
    errorCheckingCalendar: 'Error checking calendar',
    errorCreatingCalendar: 'Error creating calendar',
    errorUnexpected: 'Unexpected error creating calendar',
    
    // Recommendations
    recommendedDates: 'Recommended Dates',
    recommendedDatesDesc: 'Based on team availability',
    analyzing: 'Analyzing availability...', 
    analyzingAvailabilities: 'Analyzing availabilities...', 
    noAvailableDates: 'No available dates',
    noAvailableDatesDesc: 'No dates with positive availability found.',
    noPositiveAvailability: 'No dates with positive availability found.',
    of: 'of',
    score: 'Score',
    detailedBreakdown: 'Breakdown by person',
    breakdownByPerson: 'Breakdown by person',
    availableWithEffort: 'Available with effort',
    
    // Footer
    madeWith: 'Made with',
    by: 'by Fran Cortés-Delgado',
    advertising: 'Want your company to advertise here?',
    copyright: '© 2024 Meeting Calendar',
    
    // Welcome dialog
    welcomeToCalendar: 'Welcome to the calendar!',
    enterNameToStart: 'To get started, please enter your name',
    autoRecover: '💡 If you have participated before, we will automatically recover your selections',
    
    // Share messages
    shareMessage: 'I invite you to coordinate our meeting! 📅\n\nJoin the calendar',
    shareMessageEnd: 'to choose the dates that work best for you.\n\nIt\'s super easy and fast! 🚀',
    shareInstructions: 'Share this link so others can join the calendar',
    mobileAppsHint: '💡 On mobile, the icons will open the corresponding apps',
    
    // Loading states
    creating: 'Creating...', 
    accessing: 'Accessing...', 
    verifying: 'Verifying...', 
    
    // Calendar vote display
    you: 'you',
    more: 'more',
    othersVoted: 'Others voted',
    clearVote: 'Clear vote',
    removeVote: 'Remove vote',
    blankVote: 'Blank vote'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    // Get language from localStorage or use browser language
    const savedLanguage = localStorage.getItem('calendar-language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.slice(0, 2);
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('calendar-language', newLanguage);
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['es'][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};