
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent`}>
        Contenido<span className="text-brand-coral">YA</span>
      </span>
    </div>
  );
};

export default Logo;
