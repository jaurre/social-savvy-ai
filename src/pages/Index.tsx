
import React, { useState } from 'react';
import Welcome from '@/components/Welcome';
import BusinessProfileForm, { BusinessProfile } from '@/components/BusinessProfileForm';
import ContentGenerator from '@/components/ContentGenerator';
import Dashboard from '@/components/Dashboard';
import Logo from '@/components/Logo';
import { Toaster } from "@/components/ui/sonner";

enum AppState {
  WELCOME = 'welcome',
  PROFILE_SETUP = 'profile_setup',
  DASHBOARD = 'dashboard',
  CONTENT_GENERATOR = 'content_generator',
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [postsRemaining, setPostsRemaining] = useState(3);
  const [postsCreated, setPostsCreated] = useState(0);

  const handleGetStarted = () => {
    setAppState(AppState.PROFILE_SETUP);
  };

  const handleProfileComplete = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    setAppState(AppState.DASHBOARD);
  };

  const handleStartNewContent = () => {
    setAppState(AppState.CONTENT_GENERATOR);
  };

  const handleGenerateContent = () => {
    if (postsRemaining > 0) {
      setPostsRemaining(prev => prev - 1);
      setPostsCreated(prev => prev + 1);
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
            </nav>
          )}
          
          {appState !== AppState.PROFILE_SETUP && (
            <div className="flex items-center gap-3">
              <div className="text-sm hidden md:block">
                <span className="text-gray-500">Publicaciones: </span>
                <span className="font-medium">{postsRemaining}/3</span>
              </div>
              <button className="px-4 py-2 rounded-md border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white transition-colors">
                Registrarse
              </button>
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
      default:
        return null;
    }
  };

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
