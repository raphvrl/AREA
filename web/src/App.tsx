import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Column from './components/Column';

const App: React.FC = () => {
  const handleButtonClick = (apiName: string) => {
    console.log(`Button clicked for ${apiName}`);
    // Add logic to call the corresponding API
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
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
        } />
      </Routes>
    </Router>
  );
};

export default App;
