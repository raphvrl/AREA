// src/components/AccessibilityFab.tsx
import React, { useState } from 'react';
import { FaUniversalAccess, FaEye, FaBrain, FaHandPaper, FaTimes } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

export const AccessibilityFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme } = useTheme();
  const location = useLocation();

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/':
        return `Bienvenue sur la page d'accueil de AREA. Cette page vous permet de gérer vos intégrations 
               comme Spotify et d'utiliser la reconnaissance musicale. En haut, vous trouverez la barre de 
               navigation. Au centre, les différents services disponibles et la zone de reconnaissance musicale.`;
      
      case '/profile':
        return `Page de profil utilisateur. Ici vous pouvez modifier vos informations personnelles,
               gérer vos paramètres de sécurité et configurer vos préférences. Les options sont 
               organisées en sections avec des icônes pour faciliter la navigation.`;

      case '/about':
        return `Page À propos qui présente notre application AREA. Vous trouverez ici une description 
               détaillée du projet, de ses fonctionnalités et de son utilisation.`;

      case '/contact':
        return `Page de contact. Vous pouvez nous contacter via le formulaire présent sur cette page
               ou trouver nos informations de contact.`;

      default:
        return `Vous êtes sur une page de l'application AREA. Utilisez la barre de navigation en haut
               pour vous déplacer entre les différentes sections.`;
    }
  };

  const applyMotorSettings = () => {
    // Augmenter significativement la taille des éléments interactifs
    document.documentElement.style.setProperty('--min-touch-target', '64px');
    document.documentElement.style.setProperty('--focus-outline', '4px solid #2196F3');
    document.documentElement.style.setProperty('--spacing', '2rem');
    
    // Appliquer aux boutons et liens
    const elements = document.querySelectorAll('button, a, input, select');
    elements.forEach(el => {
      (el as HTMLElement).style.minHeight = '64px';
      (el as HTMLElement).style.minWidth = '64px';
      (el as HTMLElement).style.margin = '1rem 0';
      (el as HTMLElement).style.padding = '1rem';
      (el as HTMLElement).style.fontSize = '1.25rem';
    });
  };

  const applyVisualSettings = () => {
    // Thème contraste élevé
    setTheme('high-contrast');
    
    // Zoom sur la page using transform scale
    document.body.style.transform = "scale(1.5)";
    document.body.style.transformOrigin = "0 0";
    document.body.style.width = "66.67%"; // 100/1.5 to maintain layout
    
    // Augmenter la taille des polices
    document.documentElement.style.setProperty('--base-font-size', '1.5rem');
    document.documentElement.style.setProperty('--heading-font-size', '2rem');
    document.documentElement.style.setProperty('--letter-spacing', '0.05em');
  };

  const applyMentalSettings = () => {
    // Utiliser uniquement la description spécifique de la page
    const pageDescription = getPageDescription();
    
    // Ajouter une instruction de navigation claire à la fin
    const helpMessage = `\n\nAide à la navigation :\n- Utilisez la touche Tab pour naviguer entre les éléments\n- Utilisez Entrée pour sélectionner\n- Utilisez Échap pour revenir`;
    
    // Créer le message d'alerte final
    const alert = `${pageDescription}${helpMessage}`;
    
    // Afficher l'alerte
    window.alert(alert);
  
    // Appliquer les paramètres d'interface simplifiée
    document.documentElement.classList.add('simplified-ui');
    document.documentElement.style.setProperty('--reduce-motion', 'reduce');
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999]" 
      role="region" 
      aria-label="Options d'accessibilité"
    >
      {isOpen && (
        <div className="flex flex-col gap-3 mb-3 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <button
            onClick={applyMotorSettings}
            className="flex items-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
            aria-label="Faciliter la navigation au clavier et à la souris">
            <FaHandPaper />
            <span className="text-sm font-medium">Navigation facilitée</span>
          </button>
          
          <button
            onClick={applyVisualSettings}
            className="flex items-center gap-2 p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-colors"
            aria-label="Améliorer la lisibilité">
            <FaEye />
            <span className="text-sm font-medium">Lisibilité améliorée</span>
          </button>
          
          <button
            onClick={applyMentalSettings}
            className="flex items-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-colors"
            aria-label="Obtenir de l'aide contextuelle">
            <FaBrain />
            <span className="text-sm font-medium">Aide contextuelle</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg transition-transform hover:scale-110"
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded={isOpen}>
        {isOpen ? <FaTimes /> : <FaUniversalAccess size={24} />}
      </button>
    </div>
  );
};