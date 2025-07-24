import React, { useState, useEffect } from 'react';

const WelcomeHeader: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning!');
    } else if (hour < 18) {
      setGreeting('Good Afternoon!');
    } else {
      setGreeting('Good Evening!');
    }
  }, []);

  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">{greeting}</h1>
      <p className="text-gray-500 text-lg">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  );
};

export default WelcomeHeader; 