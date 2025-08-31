
import React from 'react';

interface AlertProps {
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ message }) => {
  return (
    <div className="bg-rose-900/50 border border-rose-700 text-rose-300 px-4 py-3 rounded-lg relative w-full" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};
