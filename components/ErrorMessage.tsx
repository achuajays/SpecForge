
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
      <strong className="font-bold block">An Error Occurred</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
}
