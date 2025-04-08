import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const navigate = useNavigate();
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <span className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent`}>
        Contenido<span className="text-brand-coral">YA</span>
      </span>
    </div>
  );
};

export default Logo;
