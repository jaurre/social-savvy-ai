
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('Iniciando sesión...');
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback
    const handleAuthCallback = async () => {
      try {
        setStatus('Verificando sesión...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
          toast.error('Error al iniciar sesión', {
            description: error.message
          });
          return;
        }
        
        if (data?.session) {
          // Check if user has a business profile
          setStatus('Verificando perfil de negocio...');
          const { data: profileData, error: profileError } = await supabase
            .from('business_profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error checking business profile:', profileError);
            setError('Error al verificar tu perfil de negocio');
            toast.error('Error al verificar tu perfil de negocio', {
              description: profileError.message
            });
            return;
          }

          if (profileData) {
            // User has a profile, redirect to dashboard
            toast.success('¡Bienvenido de nuevo!');
            navigate('/');
          } else {
            // User needs to set up a profile
            toast.info('Completa tu perfil para continuar');
            navigate('/auth'); // We'll handle the redirection to profile setup in the Auth component
          }
        } else {
          navigate('/auth');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('Error inesperado durante el proceso de autenticación');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de autenticación</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-4">Intenta iniciar sesión nuevamente o contacta a soporte si el problema persiste.</p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-brand-purple text-white py-2 px-4 rounded-md hover:bg-brand-purple-dark transition-colors"
          >
            Volver a intentar
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-brand-purple/5">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <Loader className="animate-spin h-12 w-12 text-brand-purple mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{status}</h2>
        <p className="text-gray-500">
          Esto solo tomará un momento. Estamos preparando todo para ti.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
