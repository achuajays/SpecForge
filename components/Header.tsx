
import React from 'react';

export default function Header() {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        SpecForge
      </h1>
      <p className="mt-2 text-lg text-slate-300">
        Turn your idea into a complete technical spec and blueprint in minutes.
      </p>
    </header>
  );
}
