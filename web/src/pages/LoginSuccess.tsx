import React, { useEffect } from 'react';

const LoginSuccess: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Stocker le token dans le localStorage
      localStorage.setItem('authToken', token);

      // Rediriger l'utilisateur vers le tableau de bord ou la page principale
      window.location.href = '/dashboard';
    } else {
      console.error('No token received');
    }
  }, []);

  return <div>Redirection en cours...</div>;
};

export default LoginSuccess;
