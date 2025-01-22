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