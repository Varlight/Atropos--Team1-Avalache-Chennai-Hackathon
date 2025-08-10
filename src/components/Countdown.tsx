'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  endTime: bigint;
  onExpired?: () => void;
}

export function Countdown({ endTime, onExpired }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Number(endTime) - now;
      setTimeLeft(Math.max(0, remaining));
      
      if (remaining <= 0 && onExpired) {
        onExpired();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onExpired]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft <= 0;

  return (
    <div className="text-center">
      <div className={`text-4xl font-grotesk font-bold mb-2 ${
        isExpired ? 'text-yellow-400' : 'text-white'
      }`}>
        {formatTime(timeLeft)}
      </div>
      <div className="text-sm text-avalanche-300">
        {isExpired ? 'Round Expired' : 'Time Remaining'}
      </div>
    </div>
  );
}