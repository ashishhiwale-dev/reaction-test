import React, { useState, useEffect, useCallback } from 'react';

const colors = [
  { name: 'red', key: 'R' },
  { name: 'yellow', key: 'Y' },
  { name: 'green', key: 'G' },
];

const totalRounds = 10;

const ReactionTest = () => {
  const [currentColor, setCurrentColor] = useState('');
  const [message, setMessage] = useState('Hold "L" to start');
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [isLPressed, setIsLPressed] = useState(false);
  const [round, setRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);

  const startTest = useCallback(() => {
    if (round < totalRounds) {
      setMessage('Wait for the color...');
      setReactionTime(null);
      setTimeout(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrentColor(randomColor);
        setMessage(`Release "L" and press "${randomColor.key}"!`);
        setStartTime(Date.now());
      }, Math.random() * 2000 + 1000); // random delay between 1-3 seconds
    } else {
      const averageTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
      setMessage(`Game Over! Average reaction time: ${averageTime.toFixed(2)} ms. Press "L" to play again.`);
    }
  }, [round, reactionTimes]);

  const checkReaction = useCallback(
    (key) => {
      if (key === currentColor.key) {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        setReactionTimes((prevTimes) => [...prevTimes, timeTaken]);
        setReactionTime(timeTaken);
        setMessage(`Correct! Time: ${timeTaken} ms. Hold "L" for the next round.`);
        setRound((prevRound) => prevRound + 1);
        setCurrentColor('');
      } else {
        setMessage(`Wrong key! It was ${currentColor.key}. Hold "L" to try again.`);
      }
    },
    [currentColor, startTime]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      if (key === 'L' && !isLPressed) {
        setIsLPressed(true);
        if (round === 0 || round >= totalRounds) {
          setRound(0);
          setReactionTimes([]);
          startTest();
        } else if (currentColor === '' && round < totalRounds) {
          startTest();
        }
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toUpperCase();
      if (key === 'L') {
        setIsLPressed(false);
      } else if (currentColor && key === currentColor.key && !isLPressed) {
        checkReaction(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentColor, checkReaction, isLPressed, round, startTest]);

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
      {round > 0 && <h2>Round {round} of {totalRounds}</h2>}
    </div>
  );
};

export default ReactionTest;
