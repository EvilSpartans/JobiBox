import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OnlineStatus = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (location.pathname !== '/record' && location.pathname !== '/post') {
        fetch('https://www.google.com/', {
          mode: 'no-cors',
        })
          .then(() => !isOnline && setIsOnline(true))
          .catch(() => isOnline && setIsOnline(false));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline, location.pathname]);

  return children(isOnline);
};

export default OnlineStatus;
