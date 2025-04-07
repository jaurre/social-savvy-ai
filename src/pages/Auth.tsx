
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import AuthForm from '@/components/auth/AuthForm';
import { BusinessProfile } from '@/components/BusinessProfileForm';
import BusinessProfileSetup from '@/components/auth/BusinessProfileSetup';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

enum AuthStep {
  AUTH = 'auth',
  PROFILE_SETUP = 'profile_setup'
}

const Auth = () => {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.AUTH);
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
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Check if user has a business profile
        checkBusinessProfile(session.user.id);
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
        .single();

      if (error) {
        console.error('Error checking business profile:', error);
        return;
      }

      if (data) {
        // User has a profile, redirect to dashboard
        navigate('/');
      } else {
        // User needs to set up a profile
        setAuthStep(AuthStep.PROFILE_SETUP);
      }
    } catch (error) {
      console.error('Error checking business profile:', error);
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
        return;
      }

      toast.success('¡Perfil creado con éxito!');
      navigate('/');
    } catch (error: any) {
      toast.error('Error al guardar el perfil', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
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
      </div>
    </div>
  );
};

export default Auth;
