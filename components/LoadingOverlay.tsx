
import React from 'react';

const LoadingOverlay: React.FC<{ stage: string }> = ({ stage }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-4 border-4 border-b-purple-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-orbitron font-bold text-white mb-2 animate-pulse">
          Engineered by AI
        </h2>
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase italic">
          {stage}...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
