import React, { useEffect, useState } from 'react';

const EMOJIS = ['🎅', '🎄', '⛄', '🦌', '🎁'];

export function ChristmasEmoji() {
  const [position, setPosition] = useState(-50);
  const [emoji] = useState(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev > window.innerWidth) {
          return -50;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed top-10 text-4xl transition-all duration-100 pointer-events-none"
      style={{ left: `${position}px` }}
    >
      {emoji}
    </div>
  );
}