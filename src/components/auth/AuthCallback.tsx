
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.session) {
        // Check if user has a business profile
        const { data: profileData, error: profileError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking business profile:', profileError);
        }

        if (profileData) {
          // User has a profile, redirect to dashboard
          navigate('/');
        } else {
          // User needs to set up a profile
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate('/auth')}
            className="mt-6 w-full bg-brand-purple text-white py-2 px-4 rounded-md hover:bg-brand-purple-dark transition-colors"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Procesando tu inicio de sesión...</h2>
      </div>
    </div>
  );
};

export default AuthCallback;
