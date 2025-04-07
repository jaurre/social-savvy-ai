
import React from 'react';
import { toast } from 'sonner';
import BusinessProfileForm, { BusinessProfile } from '@/components/BusinessProfileForm';

interface BusinessProfileSetupProps {
  onComplete: (profile: BusinessProfile) => void;
}

const BusinessProfileSetup = ({ onComplete }: BusinessProfileSetupProps) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Configura tu perfil de negocio</h1>
        <p className="text-gray-600">
          Esta información nos ayudará a personalizar todo el contenido que generemos para ti.
        </p>
      </div>
      
      <BusinessProfileForm 
        onComplete={(profile) => {
          onComplete(profile);
        }} 
      />
    </div>
  );
};

export default BusinessProfileSetup;
