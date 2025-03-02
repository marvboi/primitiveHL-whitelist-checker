import React, { useEffect, useState } from 'react';

interface TextRandomizerProps {
  originalText: string;
  duration?: number;
  onComplete?: () => void;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?';

const TextRandomizer: React.FC<TextRandomizerProps> = ({ 
  originalText, 
  duration = 5000,
  onComplete 
}) => {
  const [text, setText] = useState(originalText);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;
    
    const endTime = Date.now() + duration;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;
      
      if (timeLeft <= 0) {
        setText(originalText);
        setIsComplete(true);
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }
      
      // Calculate how much randomness to apply based on time left
      const progress = 1 - timeLeft / duration;
      
      // Generate randomized text
      const newText = originalText.split('').map((char, index) => {
        // Increase chance of showing correct character as time progresses
        if (Math.random() < progress * 1.5 || char === ' ') {
          return char;
        }
        
        // Otherwise show random character
        return characters.charAt(Math.floor(Math.random() * characters.length));
      }).join('');
      
      setText(newText);
    }, 50);
    
    return () => clearInterval(interval);
  }, [originalText, duration, onComplete, isComplete]);
  
  return <span className={isComplete ? '' : 'text-randomizer'}>{text}</span>;
};

export default TextRandomizer;