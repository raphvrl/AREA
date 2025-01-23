import React, { createContext, useContext, useState } from 'react';

// Mettre à jour le type Language
type Language = 'fr' | 'en' | 'de' | 'it' | 'es' | 'zh' | 'ja';

// Définir un type pour les clés de traduction
type TranslationKey = 
  | 'nav.home'
  | 'nav.profile'
  | 'nav.logout'
  | 'nav.about'
  | 'nav.contact'
  | 'login.title'
  | 'login.with_linkedin'
  | 'login.with_spotify'
  | 'login.with_discord'
  | 'login.with_github'
  | 'login.or'
  | 'login.welcome_back'
  | 'signup.sign_in'
  | 'signup.already_have_account'
  | 'signup.lastname'
  | 'signup.firstname'
  | 'login.identifier_placeholder'
  | 'login.password_placeholder'
  | 'login.sign_in'
  | 'login.no_account'
  | 'login.create_account' 
  | 'signup.errors.required_firstname'
  | 'signup.errors.required_lastname'
  | 'signup.errors.required_email'
  | 'signup.errors.required_password'
  | 'signup.errors.passwords_match'
  | 'signup.errors.general'
  | 'signup.create_account'
  | 'signup.subtitle'
  | 'signup.password'
  | 'signup.confirm_password'
  | 'signup.email'
  | 'home.title'
  | 'home.spotify.title'
  | 'home.spotify.timer'
  | 'home.spotify.connect'
  | 'home.spotify.connected'
  | 'home.spotify.play'
  | 'home.recognition.title'
  | 'home.recognition.dropzone'
  | 'home.recognition.result'
  | 'home.recognition.artist'
  | 'home.recognition.addToSpotify'
  | 'about.title'
  | 'about.description'
  | 'contact.title'
  | 'contact.description'
  | 'contact.phone'
  | 'contact.address'
  | 'contact.form.name'
  | 'contact.form.email'
  | 'contact.form.subject'
  | 'contact.form.message'
  | 'contact.form.send'
  | 'profile.title'
  | 'profile.info'
  | 'profile.firstname'
  | 'profile.lastname'
  | 'profile.avatar_description'
  | 'profile.edit_profile'
  | 'profile.connected_services'
  | 'footer.description'
  | 'footer.quick_links'
  | 'footer.home'
  | 'footer.about'
  | 'footer.contact'
  | 'footer.contact_us'
  | 'footer.follow_us'
  | 'footer.rights'
  | 'footer.privacy'
  | 'footer.terms'
  | 'home.title_welcome'
  | 'home.subtitle_welcome'
  | 'home.services.title'
  | 'home.areas.title'
  | 'home.areas.create'
  | 'home.areas.empty'
  | 'home.areas.fill_all_fields'
  | 'home.areas.count';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

type TranslationsType = {
  [K in Language]: {
    [K in TranslationKey]: string;
  };
};

const translations: TranslationsType = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    
    // Login
    'login.title': 'Connexion',
    'login.with_linkedin': 'Se connecter avec LinkedIn',
    'login.with_github': 'Se connecter avec GitHub',
    'login.with_spotify': 'Se connecter avec Spotify',
    'login.with_discord': 'Se connecter avec Discord',
    'login.or': 'ou',
    'login.welcome_back': 'Bienvenue de retour !',
    'login.identifier_placeholder': 'Identifiant',
    'login.password_placeholder': 'Mot de passe',
    'login.sign_in': 'Se connecter',
    'login.no_account': 'Pas de compte ?',
    'login.create_account': 'Créer un compte',

    // Signup
    'signup.sign_in': 'Se connecter',
    'signup.already_have_account': 'Vous avez déjà un compte ?',
    'signup.lastname': 'Nom',
    'signup.firstname': 'Prénom',
    'signup.errors.required_firstname': 'Le prénom est requis',
    'signup.errors.required_lastname': 'Le nom est requis',
    'signup.errors.required_email': 'L\'email est requis',
    'signup.errors.required_password': 'Le mot de passe est requis',
    'signup.errors.passwords_match': 'Les mots de passe ne correspondent pas',
    'signup.errors.general': 'Une erreur est survenue',
    'signup.create_account': 'Créer un compte',
    'signup.subtitle': 'Inscrivez-vous pour commencer',
    'signup.password': 'Mot de passe',
    'signup.confirm_password': 'Confirmer le mot de passe',
    'signup.email': 'Email',
    
    // Home
    'home.title': 'Bienvenue',
    'home.spotify.title': 'Intégration Spotify',
    'home.spotify.timer': 'Durée de lecture (secondes)',
    'home.spotify.connect': 'Se connecter à Spotify',
    'home.spotify.connected': 'Connecté à Spotify',
    'home.spotify.play': 'Lancer la musique',
    'home.recognition.title': 'Reconnaissance musicale',
    'home.recognition.dropzone': 'Déposez un fichier audio/vidéo ici pour identifier la musique',
    'home.recognition.result': 'Musique reconnue :',
    'home.recognition.artist': 'Artiste',
    'home.recognition.addToSpotify': 'Ajouter aux favoris Spotify',
    'home.title_welcome': 'Bienvenue sur AREA',
    'home.subtitle_welcome': 'Gérez vos intégrations et automatisez vos tâches',
    'home.services.title': 'Services Disponibles',
    'home.areas.title': 'Mes Automatisations',
    'home.areas.create': 'Créer une nouvelle automatisation',
    'home.areas.empty': 'Aucune automatisation pour le moment',
    'home.areas.fill_all_fields': 'Veuillez remplir tous les champs',
    'home.areas.count': 'automatisations',
    
    // About
    'about.title': 'À propos',
    'about.description': 'Découvrez notre application et ses fonctionnalités.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.description': 'Contactez-nous pour plus d\'informations.',
    'contact.phone': 'Téléphone',
    'contact.address': 'Adresse',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Sujet',
    'contact.form.message': 'Message',
    'contact.form.send': 'Envoyer',
    
    // Profile
    'profile.title': 'Profil',
    'profile.info': 'Informations personnelles',
    'profile.firstname': 'Prénom',
    'profile.lastname': 'Nom',
    'profile.avatar_description': 'Photo de profil de l\'utilisateur',
    'profile.edit_profile': 'Modifier le profil',
    'profile.connected_services': 'Services connectés',

    // Footer
    'footer.description': 'AREA est une plateforme d\'automatisation qui vous permet de connecter vos services préférés.',
    'footer.quick_links': 'Liens rapides',
    'footer.home': 'Accueil',
    'footer.about': 'À propos',
    'footer.contact': 'Contact',
    'footer.contact_us': 'Contactez-nous',
    'footer.follow_us': 'Suivez-nous',
    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': 'Conditions d\'utilisation'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Login
    'login.title': 'Login',
    'login.with_linkedin': 'Sign in with LinkedIn',
    'login.with_spotify': 'Sign in with Spotify',
    'login.with_discord': 'Sign in with Discord',
    'login.with_github': 'Sign in with GitHub',
    'login.or': 'or',
    'login.welcome_back': 'Welcome back!',
    'login.identifier_placeholder': 'Identifier',
    'login.password_placeholder': 'Password',
    'login.sign_in': 'Sign in',
    'login.no_account': 'No account?',
    'login.create_account': 'Create an account',

    // Signup
    'signup.sign_in': 'Sign in',
    'signup.already_have_account': 'Already have an account?',
    'signup.lastname': 'Last Name',
    'signup.firstname': 'First Name',
    'signup.errors.required_firstname': 'First name is required',
    'signup.errors.required_lastname': 'Last name is required',
    'signup.errors.required_email': 'Email is required',
    'signup.errors.required_password': 'Password is required',
    'signup.errors.passwords_match': 'Passwords do not match',
    'signup.errors.general': 'An error occurred',
    'signup.create_account': 'Create an account',
    'signup.subtitle': 'Sign up to get started',
    'signup.password': 'Password',
    'signup.confirm_password': 'Confirm Password',
    'signup.email': 'Email',

    // Home
    'home.title': 'Welcome',
    'home.spotify.title': 'Spotify Integration',
    'home.spotify.timer': 'Playing duration (seconds)',
    'home.spotify.connect': 'Connect to Spotify',
    'home.spotify.connected': 'Connected to Spotify',
    'home.spotify.play': 'Play music',
    'home.recognition.title': 'Music Recognition',
    'home.recognition.dropzone': 'Drop an audio/video file here to identify the music',
    'home.recognition.result': 'Recognized music:',
    'home.recognition.artist': 'Artist',
    'home.recognition.addToSpotify': 'Add to Spotify favorites',
    'home.title_welcome': 'Welcome to AREA',
    'home.subtitle_welcome': 'Manage your integrations and automate your tasks',
    'home.services.title': 'Available Services',
    'home.areas.title': 'My Automations',
    'home.areas.create': 'Create new automation',
    'home.areas.empty': 'No automation yet',
    'home.areas.fill_all_fields': 'Please fill all fields',
    'home.areas.count': 'Number of automations',
    
    // About
    'about.title': 'About',
    'about.description': 'Discover our application and its features.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.description': 'Contact us for more information.',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send',
    
    // Profile
    'profile.title': 'Profile',
    'profile.info': 'Personal Information',
    'profile.firstname': 'First Name',
    'profile.lastname': 'Last Name',
    'profile.avatar_description': 'User profile picture',
    'profile.edit_profile': 'Edit Profile',
    'profile.connected_services': 'Connected Services',

    // Footer
    'footer.description': 'AREA is an automation platform that lets you connect your favorite services.',
    'footer.quick_links': 'Quick Links',
    'footer.home': 'Home',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.contact_us': 'Contact Us',
    'footer.follow_us': 'Follow Us',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service'
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.profile': 'Profil',
    'nav.logout': 'Abmelden',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    
    // Login
    'login.title': 'Anmeldung',
    'login.with_linkedin': 'Mit LinkedIn anmelden',
    'login.with_spotify': 'Mit Spotify anmelden',
    'login.with_discord': 'Mit Discord anmelden',
    'login.with_github': 'Mit GitHub anmelden',
    'login.or': 'oder',
    'login.welcome_back': 'Willkommen zurück!',
    'login.identifier_placeholder': 'Benutzername',
    'login.password_placeholder': 'Passwort',
    'login.sign_in': 'Anmelden',
    'login.no_account': 'Kein Konto?',
    'login.create_account': 'Konto erstellen',

    // Signup
    'signup.sign_in': 'Anmelden',
    'signup.already_have_account': 'Haben Sie bereits ein Konto?',
    'signup.lastname': 'Nachname',
    'signup.firstname': 'Vorname',
    'signup.errors.required_firstname': 'Vorname ist erforderlich',
    'signup.errors.required_lastname': 'Nachname ist erforderlich',
    'signup.errors.required_email': 'E-Mail ist erforderlich',
    'signup.errors.required_password': 'Passwort ist erforderlich',
    'signup.errors.passwords_match': 'Passwörter stimmen nicht überein',
    'signup.errors.general': 'Ein Fehler ist aufgetreten',
    'signup.create_account': 'Konto erstellen',
    'signup.subtitle': 'Registrieren Sie sich, um zu beginnen',
    'signup.password': 'Passwort',
    'signup.confirm_password': 'Passwort bestätigen',
    'signup.email': 'E-Mail',

    // Home
    'home.title': 'Willkommen',
    'home.spotify.title': 'Spotify-Integration',
    'home.spotify.timer': 'Wiedergabedauer (Sekunden)',
    'home.spotify.connect': 'Mit Spotify verbinden',
    'home.spotify.connected': 'Mit Spotify verbunden',
    'home.spotify.play': 'Musik abspielen',
    'home.recognition.title': 'Musikerkennung',
    'home.recognition.dropzone': 'Audio-/Videodatei hier ablegen zur Musikerkennung',
    'home.recognition.result': 'Erkannte Musik:',
    'home.recognition.artist': 'Künstler',
    'home.recognition.addToSpotify': 'Zu Spotify-Favoriten hinzufügen',
    'home.title_welcome': 'Willkommen bei AREA',
    'home.subtitle_welcome': 'Verwalten Sie Ihre Integrationen und automatisieren Sie Ihre Aufgaben',
    'home.services.title': 'Verfügbare Dienste',
    'home.areas.title': 'Meine Automatisierungen',
    'home.areas.create': 'Neue Automatisierung erstellen',
    'home.areas.empty': 'Noch keine Automatisierung vorhanden',
    'home.areas.fill_all_fields': 'Bitte füllen Sie alle Felder aus',
    'home.areas.count': 'Anzahl der Automatisierungen',
    
    // About
    'about.title': 'Über uns',
    'about.description': 'Entdecken Sie unsere Anwendung und ihre Funktionen.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.description': 'Kontaktieren Sie uns für weitere Informationen.',
    'contact.phone': 'Telefon',
    'contact.address': 'Adresse',
    'contact.form.name': 'Name',
    'contact.form.email': 'E-Mail',
    'contact.form.subject': 'Betreff',
    'contact.form.message': 'Nachricht',
    'contact.form.send': 'Senden',
    
    // Profile
    'profile.title': 'Profil',
    'profile.info': 'Persönliche Informationen',
    'profile.firstname': 'Vorname',
    'profile.lastname': 'Nachname',
    'profile.avatar_description': 'Benutzerprofilbild',
    'profile.edit_profile': 'Profil bearbeiten',
    'profile.connected_services': 'Verbundene Dienste',

    // Footer
    'footer.description': 'AREA ist eine Automatisierungsplattform, die es Ihnen ermöglicht, Ihre bevorzugten Dienste zu verbinden.',
    'footer.quick_links': 'Schnellzugriffe',
    'footer.home': 'Startseite',
    'footer.about': 'Über uns',
    'footer.contact': 'Kontakt',
    'footer.contact_us': 'Kontaktieren Sie uns',
    'footer.follow_us': 'Folgen Sie uns',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.privacy': 'Datenschutzerklärung',
    'footer.terms': 'Nutzungsbedingungen'
  },

  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profilo',
    'nav.logout': 'Disconnettersi',
    'nav.about': 'Chi siamo',
    'nav.contact': 'Contatto',
    
    // Login
    'login.title': 'Accesso',
    'login.with_linkedin': 'Accedi con LinkedIn',
    'login.with_spotify': 'Accedi con Spotify',
    'login.with_discord': 'Accedi con Discord',
    'login.with_github': 'Accedi con GitHub',
    'login.or': 'o',
    'login.welcome_back': 'Bentornato!',
    'login.identifier_placeholder': 'Identificativo',
    'login.password_placeholder': 'Password',
    'login.sign_in': 'Accedi',
    'login.no_account': 'Nessun account?',
    'login.create_account': 'Crea un account',

    // Signup
    'signup.sign_in': 'Accedi',
    'signup.already_have_account': 'Hai già un account?',
    'signup.lastname': 'Cognome',
    'signup.firstname': 'Nome',
    'signup.errors.required_firstname': 'Il nome è obbligatorio',
    'signup.errors.required_lastname': 'Il cognome è obbligatorio',
    'signup.errors.required_email': 'L\'email è obbligatoria',
    'signup.errors.required_password': 'La password è obbligatoria',
    'signup.errors.passwords_match': 'Le password non corrispondono',
    'signup.errors.general': 'Si è verificato un errore',
    'signup.create_account': 'Crea un account',
    'signup.subtitle': 'Iscriviti per iniziare',
    'signup.password': 'Password',
    'signup.confirm_password': 'Conferma Password',
    'signup.email': 'Email',

    // Home
    'home.title': 'Benvenuto',
    'home.spotify.title': 'Integrazione Spotify',
    'home.spotify.timer': 'Durata riproduzione (secondi)',
    'home.spotify.connect': 'Connetti a Spotify',
    'home.spotify.connected': 'Connesso a Spotify',
    'home.spotify.play': 'Riproduci musica',
    'home.recognition.title': 'Riconoscimento musicale',
    'home.recognition.dropzone': 'Trascina qui un file audio/video per identificare la musica',
    'home.recognition.result': 'Musica riconosciuta:',
    'home.recognition.artist': 'Artista',
    'home.recognition.addToSpotify': 'Aggiungi ai preferiti Spotify',
    'home.title_welcome': 'Benvenuto su AREA',
    'home.subtitle_welcome': 'Gestisci le tue integrazioni e automatizza le tue attività',
    'home.services.title': 'Servizi Disponibili',
    'home.areas.title': 'Le Mie Automazioni',
    'home.areas.create': 'Crea nuova automazione',
    'home.areas.empty': 'Nessuna automazione presente',
    'home.areas.fill_all_fields': 'Si prega di compilare tutti i campi',
    'home.areas.count': 'Numero di automazioni',
    
    // About
    'about.title': 'Chi siamo',
    'about.description': 'Scopri la nostra applicazione e le sue funzionalità.',
    
    // Contact
    'contact.title': 'Contatti',
    'contact.description': 'Contattaci per maggiori informazioni.',
    'contact.phone': 'Telefono',
    'contact.address': 'Indirizzo',
    'contact.form.name': 'Nome',
    'contact.form.email': 'Email',
    'contact.form.subject': 'Oggetto',
    'contact.form.message': 'Messaggio',
    'contact.form.send': 'Invia',
    
    // Profile
    'profile.title': 'Profilo',
    'profile.info': 'Informazioni personali',
    'profile.firstname': 'Nome',
    'profile.lastname': 'Cognome',
    'profile.avatar_description': 'Immagine del profilo utente',
    'profile.edit_profile': 'Modifica profilo',
    'profile.connected_services': 'Servizi collegati',

    // Footer
    'footer.description': 'AREA è una piattaforma di automazione che ti permette di connettere i tuoi servizi preferiti.',
    'footer.quick_links': 'Link Rapidi',
    'footer.home': 'Home',
    'footer.about': 'Chi Siamo',
    'footer.contact': 'Contatti',
    'footer.contact_us': 'Contattaci',
    'footer.follow_us': 'Seguici',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.privacy': 'Informativa sulla Privacy',
    'footer.terms': 'Termini di Servizio'
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.profile': 'Perfil',
    'nav.logout': 'Cerrar sesión',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    
    // Login
    'login.title': 'Iniciar sesión',
    'login.with_linkedin': 'Iniciar sesión con LinkedIn',
    'login.with_spotify': 'Iniciar sesión con Spotify',
    'login.with_discord': 'Iniciar sesión con Discord',
    'login.with_github': 'Iniciar sesión con GitHub',
    'login.or': 'o',
    'login.welcome_back': '¡Bienvenido de nuevo!',
    'login.identifier_placeholder': 'Identificador',
    'login.password_placeholder': 'Contraseña',
    'login.sign_in': 'Iniciar sesión',
    'login.no_account': '¿No tienes cuenta?',
    'login.create_account': 'Crear una cuenta',

    // Signup
    'signup.sign_in': 'Iniciar sesión',
    'signup.already_have_account': '¿Ya tienes una cuenta?',
    'signup.lastname': 'Apellido',
    'signup.firstname': 'Nombre',
    'signup.errors.required_firstname': 'El nombre es obligatorio',
    'signup.errors.required_lastname': 'El apellido es obligatorio',
    'signup.errors.required_email': 'El correo electrónico es obligatorio',
    'signup.errors.required_password': 'La contraseña es obligatoria',
    'signup.errors.passwords_match': 'Las contraseñas no coinciden',
    'signup.errors.general': 'Ocurrió un error',
    'signup.create_account': 'Crear una cuenta',
    'signup.subtitle': 'Regístrate para comenzar',
    'signup.password': 'Contraseña',
    'signup.confirm_password': 'Confirmar Contraseña',
    'signup.email': 'Correo electrónico',

    // Home
    'home.title': 'Bienvenido',
    'home.spotify.title': 'Integración de Spotify',
    'home.spotify.timer': 'Duración de reproducción (segundos)',
    'home.spotify.connect': 'Conectar con Spotify',
    'home.spotify.connected': 'Conectado a Spotify',
    'home.spotify.play': 'Reproducir música',
    'home.recognition.title': 'Reconocimiento musical',
    'home.recognition.dropzone': 'Suelta un archivo de audio/video aquí para identificar la música',
    'home.recognition.result': 'Música reconocida:',
    'home.recognition.artist': 'Artista',
    'home.recognition.addToSpotify': 'Añadir a favoritos de Spotify',
    'home.title_welcome': 'Bienvenido a AREA',
    'home.subtitle_welcome': 'Gestiona tus integraciones y automatiza tus tareas',
    'home.services.title': 'Servicios Disponibles',
    'home.areas.title': 'Mis Automatizaciones',
    'home.areas.create': 'Crear nueva automatización',
    'home.areas.empty': 'No hay automatizaciones todavía',
    'home.areas.fill_all_fields': 'Por favor, rellena todos los campos',
    'home.areas.count': 'Número de automatizaciones',
    
    // About
    'about.title': 'Acerca de',
    'about.description': 'Descubre nuestra aplicación y sus características.',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.description': 'Contáctanos para más información.',
    'contact.phone': 'Teléfono',
    'contact.address': 'Dirección',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Correo electrónico',
    'contact.form.subject': 'Asunto',
    'contact.form.message': 'Mensaje',
    'contact.form.send': 'Enviar',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.info': 'Información personal',
    'profile.firstname': 'Nombre',
    'profile.lastname': 'Apellido',
    'profile.avatar_description': 'Foto de perfil del usuario',
    'profile.edit_profile': 'Editar perfil',
    'profile.connected_services': 'Servicios conectados',

    // Footer
    'footer.description': 'AREA es una plataforma de automatización que te permite conectar tus servicios favoritos.',
    'footer.quick_links': 'Enlaces Rápidos',
    'footer.home': 'Inicio',
    'footer.about': 'Acerca de',
    'footer.contact': 'Contacto',
    'footer.contact_us': 'Contáctanos',
    'footer.follow_us': 'Síguenos',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio'
  },

  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.profile': '个人资料',
    'nav.logout': '退出登录',
    'nav.about': '关于',
    'nav.contact': '联系我们',
    
    // Login
    'login.title': '登录',
    'login.with_linkedin': '使用领英登录',
    'login.with_spotify': '使用Spotify登录',
    'login.with_discord': '使用Discord登录',
    'login.with_github': '使用GitHub登录',
    'login.or': '或',
    'login.welcome_back': '欢迎回来！',
    'login.identifier_placeholder': '标识符',
    'login.password_placeholder': '密码',
    'login.sign_in': '登录',
    'login.no_account': '没有账户？',
    'login.create_account': '创建账户',

    // Signup
    'signup.sign_in': '登录',
    'signup.already_have_account': '已经有账户？',
    'signup.lastname': '姓',
    'signup.firstname': '名',
    'signup.errors.required_firstname': '名字是必填项',
    'signup.errors.required_lastname': '姓氏是必填项',
    'signup.errors.required_email': '电子邮件是必填项',
    'signup.errors.required_password': '密码是必填项',
    'signup.errors.passwords_match': '密码不匹配',
    'signup.errors.general': '发生错误',
    'signup.create_account': '创建账户',
    'signup.subtitle': '注册以开始',
    'signup.password': '密码',
    'signup.confirm_password': '确认密码',
    'signup.email': '电子邮件',

    // Home
    'home.title': '欢迎',
    'home.spotify.title': 'Spotify集成',
    'home.spotify.timer': '播放时长（秒）',
    'home.spotify.connect': '连接到Spotify',
    'home.spotify.connected': '已连接到Spotify',
    'home.spotify.play': '播放音乐',
    'home.recognition.title': '音乐识别',
    'home.recognition.dropzone': '将音频/视频文件拖放到此处以识别音乐',
    'home.recognition.result': '识别的音乐：',
    'home.recognition.artist': '艺术家',
    'home.recognition.addToSpotify': '添加到Spotify收藏',
    'home.title_welcome': '欢迎使用 AREA',
    'home.subtitle_welcome': '管理您的集成并自动化您的任务',
    'home.services.title': '可用服务',
    'home.areas.title': '我的自动化',
    'home.areas.create': '创建新的自动化',
    'home.areas.empty': '暂无自动化',
    'home.areas.fill_all_fields': '请填写所有字段',
    'home.areas.count': '自动化数量',
    
    // About
    'about.title': '关于',
    'about.description': '探索我们的应用程序及其功能。',
    
    // Contact
    'contact.title': '联系我们',
    'contact.description': '如需更多信息，请与我们联系。',
    'contact.phone': '电话',
    'contact.address': '地址',
    'contact.form.name': '姓名',
    'contact.form.email': '电子邮件',
    'contact.form.subject': '主题',
    'contact.form.message': '消息',
    'contact.form.send': '发送',
    
    // Profile
    'profile.title': '个人资料',
    'profile.info': '个人信息',
    'profile.firstname': '名',
    'profile.lastname': '姓',
    'profile.avatar_description': '用户头像',
    'profile.edit_profile': '编辑资料',
    'profile.connected_services': '关联服务',

    // Footer
    'footer.description': 'AREA是一个自动化平台，让您可以连接您喜欢的服务。',
    'footer.quick_links': '快速链接',
    'footer.home': '首页',
    'footer.about': '关于我们',
    'footer.contact': '联系我们',
    'footer.contact_us': '联系我们',
    'footer.follow_us': '关注我们',
    'footer.rights': '版权所有。',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款'
  },

  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.profile': 'プロフィール',
    'nav.logout': 'ログアウト',
    'nav.about': '概要',
    'nav.contact': 'お問い合わせ',
    'login.welcome_back': 'おかえりなさい！',
    
    // Login
    'login.title': 'ログイン',
    'login.with_linkedin': 'LinkedInでログイン',
    'login.with_spotify': 'Spotifyでログイン',
    'login.with_discord': 'Discordでログイン',
    'login.with_github': 'GitHubでログイン',
    'login.or': 'または',
    'login.identifier_placeholder': '識別子',
    'login.password_placeholder': 'パスワード',
    'login.sign_in': 'ログイン',
    'login.no_account': 'アカウントがありませんか？',
    'login.create_account': 'アカウントを作成',

    // Signup
    'signup.sign_in': 'ログイン',
    'signup.already_have_account': 'すでにアカウントをお持ちですか？',
    'signup.lastname': '姓',
    'signup.firstname': '名',
    'signup.errors.required_firstname': '名は必須です',
    'signup.errors.required_lastname': '姓は必須です',
    'signup.errors.required_email': 'メールアドレスは必須です',
    'signup.errors.required_password': 'パスワードは必須です',
    'signup.errors.passwords_match': 'パスワードが一致しません',
    'signup.errors.general': 'エラーが発生しました',
    'signup.create_account': 'アカウントを作成',
    'signup.subtitle': '始めるためにサインアップ',
    'signup.password': 'パスワード',
    'signup.confirm_password': 'パスワードを認証する',
    'signup.email': 'メールアドレス',

    // Home
    'home.title': 'ようこそ',
    'home.spotify.title': 'Spotify連携',
    'home.spotify.timer': '再生時間（秒）',
    'home.spotify.connect': 'Spotifyに接続',
    'home.spotify.connected': 'Spotifyに接続済み',
    'home.spotify.play': '音楽を再生',
    'home.recognition.title': '音楽認識',
    'home.recognition.dropzone': '音声/動画ファイルをここにドロップして音楽を識別',
    'home.recognition.result': '認識された音楽：',
    'home.recognition.artist': 'アーティスト',
    'home.recognition.addToSpotify': 'Spotifyのお気に入りに追加',
    'home.title_welcome': 'AREAへようこそ',
    'home.subtitle_welcome': '統合を管理してタスクを自動化する',
    'home.services.title': '利用可能なサービス',
    'home.areas.title': '私の自動化',
    'home.areas.create': '新しい自動化を作成',
    'home.areas.empty': '自動化はまだありません',
    'home.areas.fill_all_fields': 'すべてのフィールドに入力してください',
    'home.areas.count': '自動化の数',
    
    // About
    'about.title': '概要',
    'about.description': 'アプリケーションとその機能について説明します。',
    
    // Contact
    'contact.title': 'お問い合わせ',
    'contact.description': '詳細については、お問い合わせください。',
    'contact.phone': '電話番号',
    'contact.address': '住所',
    'contact.form.name': '名前',
    'contact.form.email': 'メールアドレス',
    'contact.form.subject': '件名',
    'contact.form.message': 'メッセージ',
    'contact.form.send': '送信',
    
    // Profile
    'profile.title': 'プロフィール',
    'profile.info': '個人情報',
    'profile.firstname': '名',
    'profile.lastname': '姓',
    'profile.avatar_description': 'ユーザープロフィール画像',
    'profile.edit_profile': 'プロフィール編集',
    'profile.connected_services': '接続済みのサービス',

    // Footer
    'footer.description': 'AREAは、お気に入りのサービスを接続できる自動化プラットフォームです。',
    'footer.quick_links': 'クイックリンク',
    'footer.home': 'ホーム',
    'footer.about': '概要',
    'footer.contact': 'お問い合わせ',
    'footer.contact_us': 'お問い合わせ',
    'footer.follow_us': 'フォローする',
    'footer.rights': '全著作権所有。',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約'
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};