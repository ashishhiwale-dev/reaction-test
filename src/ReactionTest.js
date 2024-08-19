import React, { useState, useEffect, useCallback } from 'react';

const colors = [
  { name: 'red', key: 'R' },
  { name: 'yellow', key: 'Y' },
  { name: 'green', key: 'G' },
];

const ReactionTest = () => {
  const [currentColor, setCurrentColor] = useState('');
  const [message, setMessage] = useState('Press "L" to start');
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  const checkReaction = useCallback((key) => {
    if (key === currentColor.key) {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setReactionTime(timeTaken);
      setMessage(`Correct! Time: ${timeTaken} ms. Press "L" to start again.`);
    } else {
      setMessage(`Wrong! It was ${currentColor.key}. Press "L" to start again.`);
    }
    setCurrentColor('');
    setStartTime(null);
  }, [currentColor, startTime]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toUpperCase() === 'L') {
        startTest();
      } else if (currentColor) {
        checkReaction(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentColor, checkReaction]);

  const startTest = () => {
    setMessage('Wait for the color...');
    setReactionTime(null);
    setTimeout(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentColor(randomColor);
      setMessage(`Press "${randomColor.key}"!`);
      setStartTime(Date.now());
    }, Math.random() * 2000 + 1000); // random delay between 1-3 seconds
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '10%' }}>
      <h1>Welcome DB Hiwale</h1>
      <div
        style={{
          backgroundColor: currentColor ? currentColor.name : 'white',
          width: '200px',
          height: '200px',
          margin: '0 auto',
          border: '1px solid #ccc',
        }}
      />
      <h1>{message}</h1>
      {reactionTime !== null && (
        <h2>Your reaction time: {reactionTime} ms</h2>
      )}
    </div>
  );
};

export default ReactionTest;
