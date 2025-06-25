import { useState, useRef } from 'react';

interface RateLimitConfig {
  maxMessages: number;
  timeWindowMs: number;
}

export const useRateLimit = (config: RateLimitConfig) => {
  const [isLimited, setIsLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const messageTimestamps = useRef<number[]>([]);
  const violationCount = useRef(0);
  const lastViolationTime = useRef<number>(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const { maxMessages, timeWindowMs } = config;
    const adjustedTimeWindow = timeWindowMs * currentMultiplier;

    // Remove timestamps outside the current time window
    messageTimestamps.current = messageTimestamps.current.filter(
      timestamp => now - timestamp < adjustedTimeWindow
    );

    // Check if we've exceeded the limit
    if (messageTimestamps.current.length >= maxMessages) {
      const oldestTimestamp = messageTimestamps.current[0];
      const timeUntilReset = adjustedTimeWindow - (now - oldestTimestamp);
      
      // Record this violation
      violationCount.current++;
      lastViolationTime.current = now;
      
      setIsLimited(true);
      setRemainingTime(Math.ceil(timeUntilReset / 1000));

      // Set a timeout to reset the limit
      setTimeout(() => {
        setIsLimited(false);
        setRemainingTime(0);
        
        // Check if user continues to spam after cooldown
        // If they try to send another message within 5 seconds of cooldown ending,
        // we'll catch it in the next violation check
      }, timeUntilReset);

      return false;
    }

    // Check if this is a repeated violation (user continues spamming after cooldown)
    const timeSinceLastViolation = now - lastViolationTime.current;
    if (timeSinceLastViolation < 10000 && violationCount.current > 0) { // Within 10 seconds of last violation
      // Double the multiplier for repeat offenders
      setCurrentMultiplier(prev => Math.min(prev * 2, 8)); // Cap at 8x multiplier
    } else if (timeSinceLastViolation > 60000) { // Reset after 1 minute of good behavior
      setCurrentMultiplier(1);
      violationCount.current = 0;
    }

    // Add current timestamp and allow the message
    messageTimestamps.current.push(now);
    return true;
  };

  const getRateLimitMessage = (): string => {
    const baseMessage = `Too many messages! Please wait ${remainingTime} seconds before sending another message.`;
    
    if (currentMultiplier > 1) {
      return `${baseMessage} (Penalty increased due to repeated violations - ${currentMultiplier}x cooldown)`;
    }
    
    return baseMessage;
  };

  return {
    checkRateLimit,
    isLimited,
    remainingTime,
    currentMultiplier,
    getRateLimitMessage
  };
};