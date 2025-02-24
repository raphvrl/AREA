import React, { useEffect } from 'react';

const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '8080';

const APKDownload: React.FC = () => {
  const handleDownload = () => {
    fetch(`http://localhost:${BACKEND_PORT}/api/download/apk`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du téléchargement');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AREA.apk';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors du téléchargement de l\'APK');
    });
  };

  useEffect(() => {
      handleDownload();
  }, []);

  return null;
};

export default APKDownload;
