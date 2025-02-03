import React from 'react';

interface ColumnProps {
  logo: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const Column: React.FC<ColumnProps> = ({
  logo,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded shadow-md">
      <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
      <p className="mb-4 text-center">{description}</p>
      <button
        onClick={onButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Column;
