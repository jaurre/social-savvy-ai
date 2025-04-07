import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from '@/components/Welcome';
import BusinessProfileForm, { BusinessProfile } from '@/components/BusinessProfileForm';
import ContentGenerator from '@/components/ContentGenerator';
import Dashboard from '@/components/Dashboard';
import ContentPlanner from '@/components/ContentPlanner';
import LearnModule from '@/components/learn/LearnModule';
import Logo from '@/components/Logo';
import { Toaster } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

enum AppState {
  WELCOME = 'welcome',
  PROFILE_SETUP = 'profile_setup',
  DASHBOARD = 'dashboard',
  CONTENT_GENERATOR = 'content_generator',
  CONTENT_PLANNER = 'content_planner',
  LEARN_MODULE = 'learn_module',
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [postsRemaining, setPostsRemaining] = useState(3);
  const [postsCreated, setPostsCreated] = useState(0);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Fetch business profile
        fetchBusinessProfile(session.user.id);
      }
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Fetch business profile
        fetchBusinessProfile(session.user.id);
      } else {
        // If user logged out, reset state
        setBusinessProfile(null);
        if (appState !== AppState.WELCOME) {
          setAppState(AppState.WELCOME);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBusinessProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching business profile:', error);
        return;
      }

      if (data) {
        // Map database fields to frontend model
        const profile: BusinessProfile = {
          name: data.name,
          industry: data.industry,
          description: data.description,
          tone: data.tone,
          visualStyle: data.visual_style,
          colorPalette: data.color_palette,
          slogan: data.slogan || '',
          logo: data.logo || ''
        };
        
        setBusinessProfile(profile);
        setAppState(AppState.DASHBOARD);
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
    }
  };

  const handleGetStarted = () => {
    if (session) {
      // User is logged in
      if (businessProfile) {
        setAppState(AppState.DASHBOARD);
      } else {
        setAppState(AppState.PROFILE_SETUP);
      }
    } else {
      // User needs to authenticate
      navigate('/auth');
    }
  };

  const handleProfileComplete = async (profile: BusinessProfile) => {
    if (!session) {
      navigate('/auth');
      return;
    }
    
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

      setBusinessProfile(profile);
      setAppState(AppState.DASHBOARD);
      toast.success('¡Perfil creado con éxito!');
    } catch (error: any) {
      toast.error('Error al guardar el perfil', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewContent = () => {
    setAppState(AppState.CONTENT_GENERATOR);
  };

  const handleViewCalendar = () => {
    setAppState(AppState.CONTENT_PLANNER);
  };
  
  const handleViewLearn = () => {
    setAppState(AppState.LEARN_MODULE);
  };

  const handleGenerateContent = () => {
    if (postsRemaining > 0) {
      setPostsRemaining(prev => prev - 1);
      setPostsCreated(prev => prev + 1);
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Error al cerrar sesión', {
          description: error.message
        });
        return;
      }
      
      toast.success('Sesión cerrada con éxito');
      setBusinessProfile(null);
      setAppState(AppState.WELCOME);
    } catch (error: any) {
      toast.error('Error al cerrar sesión', {
        description: error.message
      });
    }
  };

  const renderHeader = () => {
    if (appState === AppState.WELCOME) return null;
    
    return (
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          
          {appState !== AppState.PROFILE_SETUP && (
            <nav className="hidden md:flex space-x-1">
              <button 
                onClick={() => setAppState(AppState.DASHBOARD)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  appState === AppState.DASHBOARD 
                    ? 'bg-brand-purple/10 text-brand-purple font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setAppState(AppState.CONTENT_GENERATOR)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  appState === AppState.CONTENT_GENERATOR 
                    ? 'bg-brand-purple/10 text-brand-purple font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Crear Contenido
              </button>
              <button 
                onClick={() => setAppState(AppState.CONTENT_PLANNER)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  appState === AppState.CONTENT_PLANNER 
                    ? 'bg-brand-purple/10 text-brand-purple font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Planificador
              </button>
              <button 
                onClick={() => setAppState(AppState.LEARN_MODULE)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  appState === AppState.LEARN_MODULE 
                    ? 'bg-brand-purple/10 text-brand-purple font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Aprende Más
              </button>
            </nav>
          )}
          
          {appState !== AppState.PROFILE_SETUP && (
            <div className="flex items-center gap-3">
              <div className="text-sm hidden md:block">
                <span className="text-gray-500">Publicaciones: </span>
                <span className="font-medium">{postsRemaining}/3</span>
              </div>
              {session ? (
                <button 
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-md border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                >
                  Cerrar sesión
                </button>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="px-4 py-2 rounded-md border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors"
                >
                  Registrarse
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    );
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <Welcome onGetStarted={handleGetStarted} />;
      case AppState.PROFILE_SETUP:
        return <BusinessProfileForm onComplete={handleProfileComplete} />;
      case AppState.DASHBOARD:
        return businessProfile ? (
          <Dashboard 
            businessProfile={businessProfile} 
            postsCreated={postsCreated}
            onStartNewContent={handleStartNewContent}
            onViewCalendar={handleViewCalendar}
            onViewLearn={handleViewLearn}
          />
        ) : null;
      case AppState.CONTENT_GENERATOR:
        return businessProfile ? (
          <ContentGenerator 
            businessProfile={businessProfile}
            postsRemaining={postsRemaining}
            onGenerateContent={handleGenerateContent}
          />
        ) : null;
      case AppState.CONTENT_PLANNER:
        return businessProfile ? (
          <ContentPlanner 
            businessProfile={businessProfile}
            postsCreated={postsCreated}
            onGenerateContent={handleGenerateContent}
          />
        ) : null;
      case AppState.LEARN_MODULE:
        return <LearnModule />;
      default:
        return null;
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
    <div className="min-h-screen bg-background flex flex-col">
      {renderHeader()}
      
      <main className={`flex-1 ${appState !== AppState.WELCOME ? 'py-6 px-4' : ''}`}>
        {renderContent()}
      </main>
      
      {appState !== AppState.WELCOME && appState !== AppState.PROFILE_SETUP && (
        <div className="fixed bottom-4 right-4 z-20">
          <button 
            className="bg-brand-purple text-white p-4 rounded-full shadow-lg hover:bg-brand-purple-dark transition-colors"
            onClick={() => setAppState(AppState.CONTENT_GENERATOR)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
              <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
              <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
              <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              <path d="M7.5 8H4.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z"></path>
              <path d="M13.5 8h-3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z"></path>
              <path d="M19.5 8h-3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z"></path>
            </svg>
          </button>
        </div>
      )}
      
      <Toaster />
    </div>
  );
};

export default Index;
