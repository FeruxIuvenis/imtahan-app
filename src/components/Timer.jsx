import { useState, useEffect, useRef } from "react";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const Timer = ({ running, onTick }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (onTick) onTick(next);
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Reset when a new exam starts
  useEffect(() => {
    if (running) setSeconds(0);
  }, [running]);

  return <span className="timer">{formatTime(seconds)}</span>;
};

export default Timer;