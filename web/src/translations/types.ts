export type Language = 'fr' | 'en' | 'de' | 'it' | 'es' | 'zh' | 'ja';

export interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export type TranslationKey = 
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
  | 'login.welcome_message'
  | 'login.errors.invalid_credentials'
  | 'login.email'
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
  | 'home.areas.count'
  | 'landing.hero.title'
  | 'landing.hero.subtitle'
  | 'landing.hero.start_button'
  | 'landing.hero.login_button'
  | 'landing.features.automation.title'
  | 'landing.features.automation.description'
  | 'landing.features.services.title'
  | 'landing.features.services.description'
  | 'landing.features.security.title'
  | 'landing.features.security.description'
  | 'landing.services.title'
  | 'landing.services.subtitle';