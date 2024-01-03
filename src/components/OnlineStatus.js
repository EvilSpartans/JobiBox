import React, { useState, useEffect } from 'react';

const OnlineStatus = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://www.google.com/', {
        mode: 'no-cors',
      })
        .then(() => !isOnline && setIsOnline(true))
        .catch(() => isOnline && setIsOnline(false));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  return children(isOnline);
};

export default OnlineStatus;
