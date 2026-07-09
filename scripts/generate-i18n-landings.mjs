// Genera landings SEO estáticas por idioma en public/{lang}/index.html.
// La raíz (/) queda en español (la app React); cada landing enlaza a la app.
// Ejecutar: node scripts/generate-i18n-landings.mjs  (antes de npm run build)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC = path.join(ROOT, 'public');
const SITE = 'https://kdemos.com';

const LANGS = {
  en: {
    name: 'English',
    title: 'KDEMOS: Find the best date for your group, free and no sign-up',
    desc: 'Create an availability poll, share the link in your group chat and find the day that works for everyone. Free Doodle alternative with no account needed.',
    h1: 'Find the best date for your group meetup',
    sub: 'Create a calendar, share the link on WhatsApp and everyone marks the days they can. The best day pops out on its own. Free, no sign-up.',
    cta: 'Create free calendar',
    join: 'Join a calendar',
    stats: [['100%', 'Free', 'No paid plans, no ads ever'], ['0', 'Sign-ups', 'Just type your name and go'], ['∞', 'Calendars', 'No limits, no expiry']],
    whyT: 'Why KDEMOS?',
    why: [['Ready in 30 seconds', 'No account, no install. Type your name, pick candidate days and share the link.'], ['Built for group chats', 'One-click sharing to WhatsApp and Telegram. Works on any phone.'], ['Real-time results', 'Everyone sees availability update instantly, without refreshing.'], ['A truly free Doodle alternative', 'No limited free plan, no ads: unlimited polls forever.']],
    howT: 'How it works',
    how: [['Create the calendar', 'Type your name and select the candidate days.'], ['Share the link', 'Paste it in your WhatsApp, Telegram or Slack group.'], ['Pick the winner', 'Each person marks their days; the best date shows in real time.']],
    faqT: 'Frequently asked questions',
    faq: [['Is KDEMOS free? Do I need an account?', 'It is 100% free with no sign-up: just type your name and create or join a calendar.'], ['Is it a Doodle alternative?', 'Yes, KDEMOS does the essential part of Doodle, finding the day that works for everyone, free and without an account.'], ['How many people can join?', 'There is no limit: the same link works for 5 friends or a group of 100.'], ['Does it work for team meetings?', 'Sure: share the calendar link over Slack, Teams or email, just like with friends.']],
    ctaEndT: 'Ready to find your date?',
    ctaEnd: 'Free, no sign-up, in under a minute.',
    alt: 'Free alternative to Doodle, When2meet and Rallly.',
    langLabel: 'Language',
  },
  de: {
    name: 'Deutsch',
    title: 'KDEMOS: Finde den besten Termin für deine Gruppe, kostenlos & ohne Anmeldung',
    desc: 'Erstelle eine Terminumfrage, teile den Link in deiner Gruppe und finde den Tag, der allen passt. Kostenlose Doodle-Alternative ohne Konto.',
    h1: 'Finde den besten Termin für euer Treffen',
    sub: 'Kalender erstellen, Link per WhatsApp teilen, jeder markiert seine Tage. Der beste Termin ergibt sich von selbst. Kostenlos, ohne Anmeldung.',
    cta: 'Kalender kostenlos erstellen',
    join: 'Kalender beitreten',
    stats: [['100%', 'Kostenlos', 'Keine Bezahlpläne, keine Werbung'], ['0', 'Anmeldungen', 'Einfach Namen eingeben und los'], ['∞', 'Kalender', 'Ohne Limits, ohne Ablauf']],
    whyT: 'Warum KDEMOS?',
    why: [['In 30 Sekunden startklar', 'Kein Konto, keine Installation. Name eingeben, Tage auswählen, Link teilen.'], ['Gemacht für Gruppenchats', 'Teilen mit einem Klick über WhatsApp und Telegram. Läuft auf jedem Handy.'], ['Ergebnisse in Echtzeit', 'Alle sehen die Verfügbarkeiten sofort, ohne neu zu laden.'], ['Eine wirklich kostenlose Doodle-Alternative', 'Kein eingeschränkter Gratis-Plan, keine Werbung: unbegrenzte Umfragen, für immer.']],
    howT: 'So funktioniert es',
    how: [['Kalender erstellen', 'Namen eingeben und die möglichen Tage auswählen.'], ['Link teilen', 'In die WhatsApp-, Telegram- oder Slack-Gruppe einfügen.'], ['Termin festlegen', 'Jeder markiert seine Tage; der beste Termin erscheint in Echtzeit.']],
    faqT: 'Häufige Fragen',
    faq: [['Ist KDEMOS kostenlos? Brauche ich ein Konto?', 'KDEMOS ist 100 % kostenlos und ohne Registrierung: einfach den Namen eingeben und einen Kalender erstellen oder beitreten.'], ['Ist es eine Doodle-Alternative?', 'Ja, KDEMOS erledigt das Wesentliche von Doodle: den Tag finden, der allen passt. Kostenlos und ohne Konto.'], ['Wie viele Personen können teilnehmen?', 'Es gibt kein Limit: derselbe Link funktioniert für 5 Freunde oder eine Gruppe von 100.'], ['Eignet es sich für Team-Meetings?', 'Klar: teile den Kalender-Link über Slack, Teams oder E-Mail.']],
    ctaEndT: 'Bereit, euren Termin zu finden?',
    ctaEnd: 'Kostenlos, ohne Anmeldung, in unter einer Minute.',
    alt: 'Kostenlose Alternative zu Doodle, When2meet und Rallly.',
    langLabel: 'Sprache',
  },
  fr: {
    name: 'Français',
    title: 'KDEMOS: Trouvez la meilleure date pour votre groupe, gratuit et sans inscription',
    desc: 'Créez un sondage de disponibilités, partagez le lien dans votre groupe et trouvez le jour qui convient à tous. Alternative gratuite à Doodle, sans compte.',
    h1: 'Trouvez la meilleure date pour votre rencontre',
    sub: 'Créez un calendrier, partagez le lien sur WhatsApp et chacun coche ses jours. La meilleure date ressort toute seule. Gratuit, sans inscription.',
    cta: 'Créer un calendrier gratuit',
    join: 'Rejoindre un calendrier',
    stats: [['100%', 'Gratuit', 'Pas de forfait payant, pas de pub'], ['0', 'Inscription', 'Tapez votre prénom et c’est parti'], ['∞', 'Calendriers', 'Sans limite, sans expiration']],
    whyT: 'Pourquoi KDEMOS ?',
    why: [['Prêt en 30 secondes', 'Pas de compte, rien à installer. Tapez votre prénom, choisissez les jours, partagez le lien.'], ['Conçu pour les groupes', 'Partage en un clic sur WhatsApp et Telegram. Fonctionne sur tous les téléphones.'], ['Résultats en temps réel', 'Tout le monde voit les disponibilités se mettre à jour instantanément.'], ['Une alternative à Doodle vraiment gratuite', 'Pas de plan gratuit limité, pas de pub : sondages illimités, pour toujours.']],
    howT: 'Comment ça marche',
    how: [['Créez le calendrier', 'Tapez votre prénom et sélectionnez les jours possibles.'], ['Partagez le lien', 'Collez-le dans votre groupe WhatsApp, Telegram ou Slack.'], ['Choisissez la date', 'Chacun coche ses jours ; la meilleure date apparaît en temps réel.']],
    faqT: 'Questions fréquentes',
    faq: [['KDEMOS est-il gratuit ? Faut-il un compte ?', 'C’est 100 % gratuit et sans inscription : tapez votre prénom et créez ou rejoignez un calendrier.'], ['Est-ce une alternative à Doodle ?', 'Oui, KDEMOS fait l’essentiel de Doodle : trouver le jour qui convient à tous, gratuitement et sans compte.'], ['Combien de personnes peuvent participer ?', 'Aucune limite : le même lien fonctionne pour 5 amis ou un groupe de 100.'], ['Ça marche pour les réunions d’équipe ?', 'Bien sûr : partagez le lien via Slack, Teams ou e-mail.']],
    ctaEndT: 'Prêt à trouver votre date ?',
    ctaEnd: 'Gratuit, sans inscription, en moins d’une minute.',
    alt: 'Alternative gratuite à Doodle, When2meet et Rallly.',
    langLabel: 'Langue',
  },
  it: {
    name: 'Italiano',
    title: 'KDEMOS: Trova la data migliore per il tuo gruppo, gratis e senza registrazione',
    desc: 'Crea un sondaggio di disponibilità, condividi il link nel gruppo e trova il giorno che va bene a tutti. Alternativa gratuita a Doodle, senza account.',
    h1: 'Trova la data migliore per il vostro incontro',
    sub: 'Crea un calendario, condividi il link su WhatsApp e ognuno segna i suoi giorni. La data migliore emerge da sola. Gratis, senza registrazione.',
    cta: 'Crea calendario gratis',
    join: 'Unisciti a un calendario',
    stats: [['100%', 'Gratuito', 'Nessun piano a pagamento, niente pubblicità'], ['0', 'Registrazioni', 'Scrivi il tuo nome e via'], ['∞', 'Calendari', 'Senza limiti, senza scadenza']],
    whyT: 'Perché KDEMOS?',
    why: [['Pronto in 30 secondi', 'Niente account, niente installazioni. Scrivi il nome, scegli i giorni, condividi il link.'], ['Fatto per i gruppi', 'Condivisione con un clic su WhatsApp e Telegram. Funziona su qualsiasi telefono.'], ['Risultati in tempo reale', 'Tutti vedono le disponibilità aggiornarsi all’istante.'], ['Un’alternativa a Doodle davvero gratuita', 'Nessun piano gratuito limitato, niente pubblicità: sondaggi illimitati, per sempre.']],
    howT: 'Come funziona',
    how: [['Crea il calendario', 'Scrivi il tuo nome e seleziona i giorni possibili.'], ['Condividi il link', 'Incollalo nel gruppo WhatsApp, Telegram o Slack.'], ['Scegli la data', 'Ognuno segna i suoi giorni; la data migliore appare in tempo reale.']],
    faqT: 'Domande frequenti',
    faq: [['KDEMOS è gratuito? Serve un account?', 'È gratuito al 100 % e senza registrazione: scrivi il tuo nome e crea o unisciti a un calendario.'], ['È un’alternativa a Doodle?', 'Sì, KDEMOS fa l’essenziale di Doodle: trovare il giorno che va bene a tutti, gratis e senza account.'], ['Quante persone possono partecipare?', 'Nessun limite: lo stesso link funziona per 5 amici o un gruppo di 100.'], ['Funziona per le riunioni di lavoro?', 'Certo: condividi il link via Slack, Teams o e-mail.']],
    ctaEndT: 'Pronto a trovare la vostra data?',
    ctaEnd: 'Gratis, senza registrazione, in meno di un minuto.',
    alt: 'Alternativa gratuita a Doodle, When2meet e Rallly.',
    langLabel: 'Lingua',
  },
  pt: {
    name: 'Português',
    title: 'KDEMOS: Encontre a melhor data para o seu grupo, grátis e sem cadastro',
    desc: 'Crie uma enquete de disponibilidade, compartilhe o link no grupo e encontre o dia que funciona para todos. Alternativa gratuita ao Doodle, sem conta.',
    h1: 'Encontre a melhor data para o seu encontro',
    sub: 'Crie um calendário, compartilhe o link no WhatsApp e cada um marca os dias que pode. O melhor dia aparece sozinho. Grátis, sem cadastro.',
    cta: 'Criar calendário grátis',
    join: 'Entrar em um calendário',
    stats: [['100%', 'Grátis', 'Sem planos pagos, sem anúncios'], ['0', 'Cadastros', 'Digite seu nome e pronto'], ['∞', 'Calendários', 'Sem limites, sem expiração']],
    whyT: 'Por que o KDEMOS?',
    why: [['Pronto em 30 segundos', 'Sem conta, sem instalação. Digite seu nome, escolha os dias e compartilhe o link.'], ['Feito para grupos', 'Compartilhamento em um clique no WhatsApp e Telegram. Funciona em qualquer celular.'], ['Resultados em tempo real', 'Todos veem as disponibilidades atualizarem na hora.'], ['Uma alternativa ao Doodle realmente gratuita', 'Sem plano grátis limitado, sem anúncios: enquetes ilimitadas, para sempre.']],
    howT: 'Como funciona',
    how: [['Crie o calendário', 'Digite seu nome e selecione os dias possíveis.'], ['Compartilhe o link', 'Cole no grupo do WhatsApp, Telegram ou Slack.'], ['Escolha a data', 'Cada um marca seus dias; a melhor data aparece em tempo real.']],
    faqT: 'Perguntas frequentes',
    faq: [['O KDEMOS é grátis? Preciso de conta?', 'É 100 % gratuito e sem cadastro: digite seu nome e crie ou entre em um calendário.'], ['É uma alternativa ao Doodle?', 'Sim, o KDEMOS faz o essencial do Doodle: encontrar o dia que serve para todos, grátis e sem conta.'], ['Quantas pessoas podem participar?', 'Sem limite: o mesmo link funciona para 5 amigos ou um grupo de 100.'], ['Funciona para reuniões de trabalho?', 'Claro: compartilhe o link pelo Slack, Teams ou e-mail.']],
    ctaEndT: 'Pronto para encontrar a data?',
    ctaEnd: 'Grátis, sem cadastro, em menos de um minuto.',
    alt: 'Alternativa gratuita ao Doodle, When2meet e Rallly.',
    langLabel: 'Idioma',
  },
  nl: {
    name: 'Nederlands',
    title: 'KDEMOS: Vind de beste datum voor je groep, gratis en zonder registratie',
    desc: 'Maak een beschikbaarheidspoll, deel de link in je groep en vind de dag die iedereen past. Gratis Doodle-alternatief zonder account.',
    h1: 'Vind de beste datum voor jullie afspraak',
    sub: 'Maak een kalender, deel de link via WhatsApp en iedereen markeert zijn dagen. De beste datum komt vanzelf bovendrijven. Gratis, zonder registratie.',
    cta: 'Gratis kalender maken',
    join: 'Deelnemen aan kalender',
    stats: [['100%', 'Gratis', 'Geen betaalde plannen, geen advertenties'], ['0', 'Registraties', 'Typ je naam en ga'], ['∞', 'Kalenders', 'Geen limieten, geen vervaldatum']],
    whyT: 'Waarom KDEMOS?',
    why: [['Klaar in 30 seconden', 'Geen account, geen installatie. Typ je naam, kies de dagen en deel de link.'], ['Gemaakt voor groepschats', 'Delen met één klik via WhatsApp en Telegram. Werkt op elke telefoon.'], ['Resultaten in realtime', 'Iedereen ziet de beschikbaarheid direct bijwerken.'], ['Een écht gratis Doodle-alternatief', 'Geen beperkt gratis plan, geen advertenties: onbeperkte polls, voor altijd.']],
    howT: 'Zo werkt het',
    how: [['Maak de kalender', 'Typ je naam en selecteer de mogelijke dagen.'], ['Deel de link', 'Plak hem in je WhatsApp-, Telegram- of Slack-groep.'], ['Kies de datum', 'Iedereen markeert zijn dagen; de beste datum verschijnt in realtime.']],
    faqT: 'Veelgestelde vragen',
    faq: [['Is KDEMOS gratis? Heb ik een account nodig?', 'Het is 100 % gratis en zonder registratie: typ je naam en maak of join een kalender.'], ['Is het een Doodle-alternatief?', 'Ja, KDEMOS doet de kern van Doodle: de dag vinden die iedereen past, gratis en zonder account.'], ['Hoeveel mensen kunnen meedoen?', 'Geen limiet: dezelfde link werkt voor 5 vrienden of een groep van 100.'], ['Werkt het voor teamvergaderingen?', 'Zeker: deel de link via Slack, Teams of e-mail.']],
    ctaEndT: 'Klaar om jullie datum te vinden?',
    ctaEnd: 'Gratis, zonder registratie, in minder dan een minuut.',
    alt: 'Gratis alternatief voor Doodle, When2meet en Rallly.',
    langLabel: 'Taal',
  },
  ca: {
    name: 'Català',
    title: 'KDEMOS: Troba el millor dia per quedar amb el teu grup, gratis i sense registre',
    desc: 'Crea una enquesta de disponibilitat, comparteix l’enllaç al grup i troba el dia que va bé a tothom. Alternativa gratuïta a Doodle, sense compte.',
    h1: 'Troba el millor dia per a la vostra quedada',
    sub: 'Crea un calendari, comparteix l’enllaç per WhatsApp i cadascú marca els seus dies. El millor dia surt sol. Gratis, sense registre.',
    cta: 'Crear calendari gratis',
    join: 'Unir-me a un calendari',
    stats: [['100%', 'Gratuït', 'Sense plans de pagament ni anuncis'], ['0', 'Registres', 'Escriu el teu nom i llestos'], ['∞', 'Calendaris', 'Sense límits ni caducitat']],
    whyT: 'Per què KDEMOS?',
    why: [['A punt en 30 segons', 'Sense compte, sense instal·lar res. Escriu el nom, tria els dies i comparteix l’enllaç.'], ['Pensat per a grups de WhatsApp', 'Compartir amb un clic per WhatsApp i Telegram. Funciona a qualsevol mòbil.'], ['Resultats en temps real', 'Tothom veu les disponibilitats actualitzar-se a l’instant.'], ['Una alternativa a Doodle gratuïta de debò', 'Sense pla gratuït limitat ni anuncis: enquestes il·limitades, per sempre.']],
    howT: 'Com funciona',
    how: [['Crea el calendari', 'Escriu el teu nom i selecciona els dies possibles.'], ['Comparteix l’enllaç', 'Enganxa’l al grup de WhatsApp, Telegram o Slack.'], ['Tria el dia', 'Cadascú marca els seus dies; el millor dia apareix en temps real.']],
    faqT: 'Preguntes freqüents',
    faq: [['KDEMOS és gratuït? Necessito un compte?', 'És 100 % gratuït i sense registre: escriu el teu nom i crea o uneix-te a un calendari.'], ['És una alternativa a Doodle?', 'Sí, KDEMOS fa l’essencial de Doodle: trobar el dia que va bé a tothom, gratis i sense compte.'], ['Quanta gent pot participar?', 'Sense límit: el mateix enllaç serveix per a 5 amics o un grup de 100.'], ['Serveix per a reunions de feina?', 'És clar: comparteix l’enllaç per Slack, Teams o correu.']],
    ctaEndT: 'A punt per trobar el vostre dia?',
    ctaEnd: 'Gratis, sense registre, en menys d’un minut.',
    alt: 'Alternativa gratuïta a Doodle, When2meet i Rallly.',
    langLabel: 'Idioma',
  },
  pl: {
    name: 'Polski',
    title: 'KDEMOS: Znajdź najlepszy termin dla swojej grupy, za darmo i bez rejestracji',
    desc: 'Stwórz ankietę dostępności, udostępnij link w grupie i znajdź dzień pasujący wszystkim. Darmowa alternatywa dla Doodle, bez konta.',
    h1: 'Znajdź najlepszy termin na wasze spotkanie',
    sub: 'Stwórz kalendarz, udostępnij link na WhatsAppie, a każdy zaznaczy swoje dni. Najlepszy termin wyłoni się sam. Za darmo, bez rejestracji.',
    cta: 'Stwórz darmowy kalendarz',
    join: 'Dołącz do kalendarza',
    stats: [['100%', 'Za darmo', 'Bez płatnych planów i reklam'], ['0', 'Rejestracji', 'Wpisz imię i działaj'], ['∞', 'Kalendarzy', 'Bez limitów i terminu ważności']],
    whyT: 'Dlaczego KDEMOS?',
    why: [['Gotowe w 30 sekund', 'Bez konta i instalacji. Wpisz imię, wybierz dni i udostępnij link.'], ['Stworzony dla czatów grupowych', 'Udostępnianie jednym kliknięciem na WhatsApp i Telegram. Działa na każdym telefonie.'], ['Wyniki w czasie rzeczywistym', 'Wszyscy widzą dostępność aktualizującą się na bieżąco.'], ['Naprawdę darmowa alternatywa dla Doodle', 'Bez ograniczonego darmowego planu i reklam: nielimitowane ankiety, na zawsze.']],
    howT: 'Jak to działa',
    how: [['Stwórz kalendarz', 'Wpisz swoje imię i wybierz możliwe dni.'], ['Udostępnij link', 'Wklej go do grupy na WhatsAppie, Telegramie lub Slacku.'], ['Wybierz termin', 'Każdy zaznacza swoje dni; najlepszy termin pojawia się w czasie rzeczywistym.']],
    faqT: 'Najczęstsze pytania',
    faq: [['Czy KDEMOS jest darmowy? Czy potrzebuję konta?', 'Jest w 100 % darmowy i bez rejestracji: wpisz imię i stwórz kalendarz lub dołącz do istniejącego.'], ['Czy to alternatywa dla Doodle?', 'Tak, KDEMOS robi to, co najważniejsze w Doodle: znajduje dzień pasujący wszystkim, za darmo i bez konta.'], ['Ile osób może wziąć udział?', 'Bez limitu: ten sam link działa dla 5 znajomych i grupy 100 osób.'], ['Czy nadaje się do spotkań zespołu?', 'Jasne: udostępnij link przez Slack, Teams lub e-mail.']],
    ctaEndT: 'Gotowi znaleźć termin?',
    ctaEnd: 'Za darmo, bez rejestracji, w mniej niż minutę.',
    alt: 'Darmowa alternatywa dla Doodle, When2meet i Rallly.',
    langLabel: 'Język',
  },
  da: {
    name: 'Dansk',
    title: 'KDEMOS: Find den bedste dato for din gruppe, gratis og uden tilmelding',
    desc: 'Opret en afstemning om ledige dage, del linket i din gruppe og find den dag, der passer alle. Gratis Doodle-alternativ uden konto.',
    h1: 'Find den bedste dato til jeres aftale',
    sub: 'Opret en kalender, del linket på WhatsApp, og alle markerer deres dage. Den bedste dato viser sig selv. Gratis, uden tilmelding.',
    cta: 'Opret gratis kalender',
    join: 'Deltag i kalender',
    stats: [['100%', 'Gratis', 'Ingen betalte planer, ingen reklamer'], ['0', 'Tilmeldinger', 'Skriv dit navn og kom i gang'], ['∞', 'Kalendere', 'Ingen grænser, ingen udløb']],
    whyT: 'Hvorfor KDEMOS?',
    why: [['Klar på 30 sekunder', 'Ingen konto, ingen installation. Skriv dit navn, vælg dage og del linket.'], ['Bygget til gruppechats', 'Del med ét klik via WhatsApp og Telegram. Virker på alle telefoner.'], ['Resultater i realtid', 'Alle ser tilgængeligheden opdatere sig med det samme.'], ['Et ægte gratis Doodle-alternativ', 'Ingen begrænset gratis plan, ingen reklamer: ubegrænsede afstemninger, for altid.']],
    howT: 'Sådan virker det',
    how: [['Opret kalenderen', 'Skriv dit navn og vælg de mulige dage.'], ['Del linket', 'Indsæt det i din WhatsApp-, Telegram- eller Slack-gruppe.'], ['Vælg datoen', 'Alle markerer deres dage; den bedste dato vises i realtid.']],
    faqT: 'Ofte stillede spørgsmål',
    faq: [['Er KDEMOS gratis? Skal jeg have en konto?', 'Det er 100 % gratis og uden tilmelding: skriv dit navn og opret eller deltag i en kalender.'], ['Er det et Doodle-alternativ?', 'Ja, KDEMOS gør det vigtigste fra Doodle: finder den dag, der passer alle, gratis og uden konto.'], ['Hvor mange kan deltage?', 'Ingen grænse: det samme link virker for 5 venner eller en gruppe på 100.'], ['Virker det til teammøder?', 'Selvfølgelig: del linket via Slack, Teams eller e-mail.']],
    ctaEndT: 'Klar til at finde jeres dato?',
    ctaEnd: 'Gratis, uden tilmelding, på under et minut.',
    alt: 'Gratis alternativ til Doodle, When2meet og Rallly.',
    langLabel: 'Sprog',
  },
  sv: {
    name: 'Svenska',
    title: 'KDEMOS: Hitta bästa datumet för din grupp, gratis och utan registrering',
    desc: 'Skapa en tillgänglighetsomröstning, dela länken i din grupp och hitta dagen som passar alla. Gratis Doodle-alternativ utan konto.',
    h1: 'Hitta bästa datumet för er träff',
    sub: 'Skapa en kalender, dela länken på WhatsApp och alla markerar sina dagar. Bästa dagen dyker upp av sig själv. Gratis, utan registrering.',
    cta: 'Skapa gratis kalender',
    join: 'Gå med i kalender',
    stats: [['100%', 'Gratis', 'Inga betalplaner, ingen reklam'], ['0', 'Registreringar', 'Skriv ditt namn och kör'], ['∞', 'Kalendrar', 'Inga gränser, inget utgångsdatum']],
    whyT: 'Varför KDEMOS?',
    why: [['Klart på 30 sekunder', 'Inget konto, ingen installation. Skriv ditt namn, välj dagar och dela länken.'], ['Byggt för gruppchattar', 'Dela med ett klick via WhatsApp och Telegram. Funkar på alla mobiler.'], ['Resultat i realtid', 'Alla ser tillgängligheten uppdateras direkt.'], ['Ett riktigt gratis Doodle-alternativ', 'Ingen begränsad gratisplan, ingen reklam: obegränsade omröstningar, för alltid.']],
    howT: 'Så funkar det',
    how: [['Skapa kalendern', 'Skriv ditt namn och välj möjliga dagar.'], ['Dela länken', 'Klistra in den i din WhatsApp-, Telegram- eller Slack-grupp.'], ['Välj datumet', 'Alla markerar sina dagar; bästa datumet visas i realtid.']],
    faqT: 'Vanliga frågor',
    faq: [['Är KDEMOS gratis? Behöver jag ett konto?', 'Det är 100 % gratis och utan registrering: skriv ditt namn och skapa eller gå med i en kalender.'], ['Är det ett Doodle-alternativ?', 'Ja, KDEMOS gör det viktigaste från Doodle: hittar dagen som passar alla, gratis och utan konto.'], ['Hur många kan delta?', 'Ingen gräns: samma länk funkar för 5 vänner eller en grupp på 100.'], ['Funkar det för teammöten?', 'Absolut: dela länken via Slack, Teams eller e-post.']],
    ctaEndT: 'Redo att hitta ert datum?',
    ctaEnd: 'Gratis, utan registrering, på under en minut.',
    alt: 'Gratis alternativ till Doodle, When2meet och Rallly.',
    langLabel: 'Språk',
  },
  no: {
    name: 'Norsk',
    title: 'KDEMOS: Finn den beste datoen for gruppen din, gratis og uten registrering',
    desc: 'Lag en tilgjengelighetsavstemning, del lenken i gruppen og finn dagen som passer alle. Gratis Doodle-alternativ uten konto.',
    h1: 'Finn den beste datoen for treffet deres',
    sub: 'Lag en kalender, del lenken på WhatsApp, og alle markerer dagene sine. Den beste datoen dukker opp av seg selv. Gratis, uten registrering.',
    cta: 'Lag gratis kalender',
    join: 'Bli med i kalender',
    stats: [['100%', 'Gratis', 'Ingen betalte planer, ingen reklame'], ['0', 'Registreringer', 'Skriv navnet ditt og sett i gang'], ['∞', 'Kalendere', 'Ingen grenser, ingen utløpsdato']],
    whyT: 'Hvorfor KDEMOS?',
    why: [['Klar på 30 sekunder', 'Ingen konto, ingen installasjon. Skriv navnet ditt, velg dager og del lenken.'], ['Laget for gruppechatter', 'Del med ett klikk via WhatsApp og Telegram. Funker på alle telefoner.'], ['Resultater i sanntid', 'Alle ser tilgjengeligheten oppdatere seg umiddelbart.'], ['Et ekte gratis Doodle-alternativ', 'Ingen begrenset gratisplan, ingen reklame: ubegrensede avstemninger, for alltid.']],
    howT: 'Slik fungerer det',
    how: [['Lag kalenderen', 'Skriv navnet ditt og velg mulige dager.'], ['Del lenken', 'Lim den inn i WhatsApp-, Telegram- eller Slack-gruppen.'], ['Velg datoen', 'Alle markerer dagene sine; den beste datoen vises i sanntid.']],
    faqT: 'Ofte stilte spørsmål',
    faq: [['Er KDEMOS gratis? Trenger jeg konto?', 'Det er 100 % gratis og uten registrering: skriv navnet ditt og lag eller bli med i en kalender.'], ['Er det et Doodle-alternativ?', 'Ja, KDEMOS gjør det viktigste fra Doodle: finner dagen som passer alle, gratis og uten konto.'], ['Hvor mange kan delta?', 'Ingen grense: samme lenke funker for 5 venner eller en gruppe på 100.'], ['Funker det for teammøter?', 'Klart: del lenken via Slack, Teams eller e-post.']],
    ctaEndT: 'Klar til å finne datoen deres?',
    ctaEnd: 'Gratis, uten registrering, på under ett minutt.',
    alt: 'Gratis alternativ til Doodle, When2meet og Rallly.',
    langLabel: 'Språk',
  },
};

const ALL_CODES = Object.keys(LANGS);
const hreflangs = () => {
  const links = [`  <link rel="alternate" hreflang="es" href="${SITE}/"/>`,
                 `  <link rel="alternate" hreflang="x-default" href="${SITE}/"/>`];
  for (const c of ALL_CODES) links.push(`  <link rel="alternate" hreflang="${c}" href="${SITE}/${c}/"/>`);
  return links.join('\n');
};

const switcher = (current) => {
  const items = [`<a href="/"${current === 'es' ? ' class="on"' : ''}>Español</a>`];
  for (const c of ALL_CODES) items.push(`<a href="/${c}/"${c === current ? ' class="on"' : ''}>${LANGS[c].name}</a>`);
  return items.join(' · ');
};

const esc = (s) => s.replace(/"/g, '\\"');

const page = (code, t) => `<!DOCTYPE html>
<html lang="${code}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${t.title}</title>
  <meta name="description" content="${t.desc}"/>
  <meta name="robots" content="index, follow"/>
  <link rel="canonical" href="${SITE}/${code}/"/>
${hreflangs()}
  <meta property="og:type" content="website"/>
  <meta property="og:url" content="${SITE}/${code}/"/>
  <meta property="og:title" content="${t.title}"/>
  <meta property="og:description" content="${t.desc}"/>
  <meta property="og:image" content="${SITE}/images/og.png"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:image" content="${SITE}/images/og.png"/>
  <link rel="icon" type="image/png" href="/images/KDEMOS_logo.png"/>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "KDEMOS",
    "url": "${SITE}/",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "inLanguage": "${code}",
    "description": "${esc(t.desc)}",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${t.faq.map(([q, a]) => `      { "@type": "Question", "name": "${esc(q)}", "acceptedAnswer": { "@type": "Answer", "text": "${esc(a)}" } }`).join(',\n')}
    ]
  }
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f1117; color: #e0e0e0; line-height: 1.7; }
    a { color: #1a73e8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    header { background: #1a1a2e; border-bottom: 1px solid #1a73e8; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
    header .logo { font-size: 1.3rem; font-weight: 700; color: #fff; letter-spacing: 1px; }
    .hero { background: linear-gradient(135deg, #0d1b2a 0%, #1a1a2e 100%); padding: 60px 24px 48px; text-align: center; }
    .hero h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); color: #fff; font-weight: 800; max-width: 760px; margin: 0 auto 16px; }
    .hero p { font-size: 1.1rem; color: #aaa; max-width: 600px; margin: 0 auto 32px; }
    .btn { display: inline-block; background: #1a73e8; color: #fff; padding: 14px 32px; border-radius: 8px; font-size: 1rem; font-weight: 600; margin: 4px; }
    .btn:hover { background: #1558b0; text-decoration: none; }
    .btn.ghost { background: transparent; border: 1px solid #1a73e8; color: #1a73e8; }
    .container { max-width: 860px; margin: 0 auto; padding: 48px 24px; }
    h2 { font-size: 1.5rem; color: #fff; margin: 40px 0 18px; text-align: center; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 8px 0 8px; }
    .stat { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; padding: 18px; text-align: center; }
    .stat .n { display: block; font-size: 1.7rem; font-weight: 800; color: #1a73e8; }
    .stat .l { display: block; font-weight: 700; color: #fff; margin-top: 2px; }
    .stat .s { font-size: 0.82rem; color: #888; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    .card { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px; padding: 20px; }
    .card h3 { color: #1a73e8; font-size: 1rem; margin-bottom: 8px; }
    .card p { color: #aaa; font-size: 0.92rem; margin: 0; }
    .steps { counter-reset: step; list-style: none; padding: 0; max-width: 620px; margin: 0 auto; }
    .steps li { counter-increment: step; display: flex; gap: 16px; margin-bottom: 18px; }
    .steps li::before { content: counter(step); background: #1a73e8; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .steps h3 { color: #fff; font-size: 1rem; margin-bottom: 2px; }
    .steps p { color: #aaa; font-size: 0.92rem; margin: 0; }
    details { background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; max-width: 700px; margin-left: auto; margin-right: auto; }
    summary { color: #fff; font-weight: 600; cursor: pointer; }
    details p { color: #aaa; margin-top: 8px; font-size: 0.93rem; }
    .cta { background: linear-gradient(135deg, #0d1b2a, #1a1a2e); text-align: center; padding: 48px 24px; border-top: 1px solid #2a2a3e; }
    .altnote { text-align: center; color: #667; font-size: 0.85rem; margin-top: 24px; }
    footer { background: #0a0a14; text-align: center; padding: 24px; color: #555; font-size: 0.82rem; border-top: 1px solid #1a1a2e; line-height: 2; }
    footer .on { color: #1a73e8; font-weight: 700; }
    @media (max-width: 640px) {
      .hero { padding: 36px 16px 28px; }
      .container { padding: 32px 16px; }
      .stats { grid-template-columns: 1fr; }
      h2 { font-size: 1.25rem; }
    }
  </style>
</head>
<body>
<header>
  <a href="/" class="logo">KDEMOS</a>
  <nav><a href="/?lang=${code}">${t.cta}</a></nav>
</header>

<div class="hero">
  <h1>${t.h1}</h1>
  <p>${t.sub}</p>
  <a href="/?lang=${code}" class="btn">${t.cta} →</a>
  <a href="/?lang=${code}" class="btn ghost">${t.join}</a>
</div>

<div class="container">

  <div class="stats">
${t.stats.map(([n, l, s]) => `    <div class="stat"><span class="n">${n}</span><span class="l">${l}</span><span class="s">${s}</span></div>`).join('\n')}
  </div>

  <h2>${t.whyT}</h2>
  <div class="grid">
${t.why.map(([h, b]) => `    <div class="card"><h3>${h}</h3><p>${b}</p></div>`).join('\n')}
  </div>

  <h2>${t.howT}</h2>
  <ol class="steps">
${t.how.map(([h, b]) => `    <li><div><h3>${h}</h3><p>${b}</p></div></li>`).join('\n')}
  </ol>

  <h2>${t.faqT}</h2>
${t.faq.map(([q, a]) => `  <details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}

  <p class="altnote">${t.alt}</p>

</div>

<div class="cta">
  <h2 style="margin-top:0;">${t.ctaEndT}</h2>
  <p style="color:#aaa;margin:10px 0 26px;">${t.ctaEnd}</p>
  <a href="/?lang=${code}" class="btn">${t.cta} →</a>
</div>

<footer>
  <div>${t.langLabel}: ${switcher(code)}</div>
  <div>© 2025 KDEMOS, <a href="/">kdemos.com</a></div>
</footer>
</body>
</html>
`;

let count = 0;
for (const [code, t] of Object.entries(LANGS)) {
  const dir = path.join(PUBLIC, code);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(code, t));
  count++;
  console.log(`  ✓ public/${code}/index.html (${t.name})`);
}
console.log(`${count} landings generadas.`);
