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
  | 'profile.title'
  | 'profile.info'
  | 'profile.firstname'
  | 'profile.lastname'
  | 'profile.avatar_description';

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
    
    // About
    'about.title': 'À propos',
    'about.description': 'Découvrez notre application et ses fonctionnalités.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.description': 'Contactez-nous pour plus d\'informations.',
    
    // Profile
    'profile.title': 'Profil',
    'profile.info': 'Informations personnelles',
    'profile.firstname': 'Prénom',
    'profile.lastname': 'Nom',
    'profile.avatar_description': 'Photo de profil de l\'utilisateur'
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
    
    // About
    'about.title': 'About',
    'about.description': 'Discover our application and its features.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.description': 'Contact us for more information.',
    
    // Profile
    'profile.title': 'Profile',
    'profile.info': 'Personal Information',
    'profile.firstname': 'First Name',
    'profile.lastname': 'Last Name',
    'profile.avatar_description': 'User profile picture'
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.profile': 'Profil',
    'nav.logout': 'Abmelden',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    
    // Login
    'login.title': 'Anmelden',
    'login.with_linkedin': 'Mit LinkedIn anmelden',
    'login.with_spotify': 'Mit Spotify anmelden',
    'login.with_discord': 'Sign in with Discord',
    'login.with_github': 'Se connecter avec GitHub',
    'login.or': 'oder',
    
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
    
    // About
    'about.title': 'Über uns',
    'about.description': 'Entdecken Sie unsere Anwendung und ihre Funktionen.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.description': 'Kontaktieren Sie uns für weitere Informationen.',
    
    // Profile
    'profile.title': 'Profil',
    'profile.info': 'Persönliche Informationen',
    'profile.firstname': 'Vorname',
    'profile.lastname': 'Nachname',
    'profile.avatar_description': 'Benutzerprofilbild'
  },

  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profilo',
    'nav.logout': 'Disconnetti',
    'nav.about': 'Chi siamo',
    'nav.contact': 'Contatti',
    
    // Login
    'login.title': 'Accesso',
    'login.with_linkedin': 'Accedi con LinkedIn',
    'login.with_spotify': 'Accedi con Spotify',
    'login.with_discord': 'Sign in with Discord',
    'login.with_github': 'Se connecter avec GitHub',
    'login.or': 'oppure',
    
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
    
    // About
    'about.title': 'Chi siamo',
    'about.description': 'Scopri la nostra applicazione e le sue funzionalità.',
    
    // Contact
    'contact.title': 'Contatti',
    'contact.description': 'Contattaci per maggiori informazioni.',
    
    // Profile
    'profile.title': 'Profilo',
    'profile.info': 'Informazioni personali',
    'profile.firstname': 'Nome',
    'profile.lastname': 'Cognome',
    'profile.avatar_description': 'Immagine del profilo utente'
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
    'login.with_discord': 'Sign in with Discord',
    'login.with_github': 'Se connecter avec GitHub',
    'login.or': 'o',
    
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
    
    // About
    'about.title': 'Acerca de',
    'about.description': 'Descubre nuestra aplicación y sus características.',
    
    // Contact
    'contact.title': 'Contacto',
    'contact.description': 'Contáctanos para más información.',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.info': 'Información personal',
    'profile.firstname': 'Nombre',
    'profile.lastname': 'Apellido',
    'profile.avatar_description': 'Foto de perfil del usuario'
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
    'login.with_discord': 'Sign in with Discord',
    'login.with_github': 'Se connecter avec GitHub',
    'login.or': '或',
    
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
    
    // About
    'about.title': '关于',
    'about.description': '探索我们的应用程序及其功能。',
    
    // Contact
    'contact.title': '联系我们',
    'contact.description': '如需更多信息，请与我们联系。',
    
    // Profile
    'profile.title': '个人资料',
    'profile.info': '个人信息',
    'profile.firstname': '名',
    'profile.lastname': '姓',
    'profile.avatar_description': '用户头像'
  },

  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.profile': 'プロフィール',
    'nav.logout': 'ログアウト',
    'nav.about': '概要',
    'nav.contact': 'お問い合わせ',
    
    // Login
    'login.title': 'ログイン',
    'login.with_linkedin': 'LinkedInでログイン',
    'login.with_spotify': 'Spotifyでログイン',
    'login.with_discord': 'Sign in with Discord',
    'login.with_github': 'Se connecter avec GitHub',
    'login.or': 'または',
    
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
    
    // About
    'about.title': '概要',
    'about.description': 'アプリケーションとその機能について説明します。',
    
    // Contact
    'contact.title': 'お問い合わせ',
    'contact.description': '詳細については、お問い合わせください。',
    
    // Profile
    'profile.title': 'プロフィール',
    'profile.info': '個人情報',
    'profile.firstname': '名',
    'profile.lastname': '姓',
    'profile.avatar_description': 'ユーザープロフィール画像'
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