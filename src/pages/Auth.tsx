
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import AuthForm from '@/components/auth/AuthForm';
import { BusinessProfile } from '@/components/BusinessProfileForm';
import BusinessProfileSetup from '@/components/auth/BusinessProfileSetup';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

enum AuthStep {
  LOADING = 'loading',
  AUTH = 'auth',
  PROFILE_SETUP = 'profile_setup'
}

const Auth = () => {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.LOADING);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Check if user has a business profile
        checkBusinessProfile(session.user.id);
      } else {
        setAuthStep(AuthStep.AUTH);
        setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Check if user has a business profile
        checkBusinessProfile(session.user.id);
      } else {
        setAuthStep(AuthStep.AUTH);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkBusinessProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking business profile:', error);
        toast.error('Error al verificar tu perfil de negocio', {
          description: error.message
        });
        setLoading(false);
        return;
      }

      if (data) {
        // User has a profile, redirect to dashboard
        navigate('/');
      } else {
        // User needs to set up a profile
        setAuthStep(AuthStep.PROFILE_SETUP);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error checking business profile:', error);
      toast.error('Error al verificar tu perfil de negocio', {
        description: error.message
      });
      setLoading(false);
    }
  };

  const handleProfileComplete = async (profile: BusinessProfile) => {
    if (!session) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.from('business_profiles').insert({
        id: session.user.id,
        name: profile.name,
        industry: profile.industry,
        description: profile.description,
        tone: profile.tone,
        visual_style: profile.visualStyle,
        color_palette: profile.colorPalette,
        slogan: profile.slogan || null,
        logo: profile.logo || null
      });

      if (error) {
        toast.error('Error al guardar el perfil', {
          description: error.message
        });
        setLoading(false);
        return;
      }

      toast.success('¡Perfil creado con éxito!');
      navigate('/');
    } catch (error: any) {
      toast.error('Error al guardar el perfil', {
        description: error.message
      });
      setLoading(false);
    }
  };

  if (loading && authStep === AuthStep.LOADING) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-brand-purple/5 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <Loader className="animate-spin h-12 w-12 text-brand-purple mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verificando sesión...</h2>
          <p className="text-gray-500">
            Esto solo tomará un momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-purple/5 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <Button 
            variant="outline"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </div>

        {authStep === AuthStep.AUTH && !session && (
          <AuthForm />
        )}

        {authStep === AuthStep.PROFILE_SETUP && session && (
          <BusinessProfileSetup onComplete={handleProfileComplete} />
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Loader className="animate-spin h-8 w-8 text-brand-purple mx-auto mb-3" />
              <p className="text-center text-gray-700">Guardando perfil...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
