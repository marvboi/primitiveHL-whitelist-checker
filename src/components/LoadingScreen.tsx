import React, { useEffect, useState } from 'react';
import TextRandomizer from './TextRandomizer';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, (currentStep / steps) * 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 bg-[#072722] flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <img 
          src="https://i.ibb.co/DfmvNCnR/PrimeHL.png" 
          alt="PrimitiveHL Logo" 
          className="h-24 mb-6 animate-pulse"
        />
        
        <h1 className="text-4xl font-bold text-[#96fce4] mb-8">
          <TextRandomizer 
            originalText="PrimitiveHL" 
            duration={5000}
          />
        </h1>
        
        <div className="w-64 h-2 bg-[#96fce4]/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#96fce4] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="mt-4 text-[#96fce4]/70 text-sm">
          {progress < 100 ? 'Initializing...' : 'Complete'}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;