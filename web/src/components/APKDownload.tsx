import React, { useEffect } from 'react';

const APKDownload: React.FC = () => {
  useEffect(() => {
    const downloadAPK = async () => {
      try {
        const response = await fetch('/apk/area.apk');
        if (!response.ok) {
          throw new Error('Fichier APK non trouvé');
        }

        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = '/apk/area.apk';
        link.download = 'area.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Fichier trouvé : /apk/area.apk');
        alert('Fichier trouvé : /apk/area.apk');
      } catch (error) {
        console.error('Erreur :', (error as Error).message);
        alert('Erreur : ' + (error as Error).message);
      }
    };

    downloadAPK();
  }, []);

  return null; // Aucun rendu visuel nécessaire
};

export default APKDownload;