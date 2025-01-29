import React, { useEffect } from 'react';

const APKDownload: React.FC = () => {
  useEffect(() => {
    // Create a download link
    const link = document.createElement('a');
    link.href = '/shared/apk/area.apk';
    link.download = 'area.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optionally redirect back to home page after download starts
    window.location.href = '/';
  }, []);

  return null; // No visual rendering needed
};

export default APKDownload;
