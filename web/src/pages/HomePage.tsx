// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import Column from '../components/Column';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const [user, setUser] = useState<{ firstName: string; lastName: string; isFirstLogin: boolean } | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Afficher un message de bienvenue ou de retour en fonction de isFirstLogin
      if (parsedUser.isFirstLogin) {
        alert(`Bienvenue ${parsedUser.firstName} ${parsedUser.lastName}!`);
      } else {
        alert(`Ravie de te revoir ${parsedUser.firstName} ${parsedUser.lastName}!`);
      }
    }
  }, [isAuthenticated]);

  const handleButtonClick = (apiName: string) => {
    console.log(`Button clicked for ${apiName}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Column
          logo="https://via.placeholder.com/64"
          description="Description for API 1"
          buttonText="Call API 1"
          onButtonClick={() => handleButtonClick('API 1')}
        />
        <Column
          logo="https://via.placeholder.com/64"
          description="Description for API 2"
          buttonText="Call API 2"
          onButtonClick={() => handleButtonClick('API 2')}
        />
        <Column
          logo="https://via.placeholder.com/64"
          description="Description for API 3"
          buttonText="Call API 3"
          onButtonClick={() => handleButtonClick('API 3')}
        />
      </div>
    </div>
  );
};

export default HomePage;
