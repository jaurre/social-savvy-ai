
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Google, Apple, Facebook, Linkedin, AtSign, Lock, User } from 'lucide-react';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este correo ya está registrado', { 
            description: 'Por favor inicia sesión'
          });
        } else {
          toast.error('Error al registrarse', { 
            description: error.message 
          });
        }
        return;
      }

      toast.success('¡Registro exitoso!', {
        description: 'Por favor revisa tu correo para verificar tu cuenta'
      });
    } catch (error: any) {
      toast.error('Error al registrarse', { 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error('Error al iniciar sesión', { 
          description: error.message 
        });
        return;
      }

      toast.success('Inicio de sesión exitoso');
    } catch (error: any) {
      toast.error('Error al iniciar sesión', { 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple' | 'facebook' | 'linkedin') => {
    try {
      setLoading(true);
      
      let { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'linkedin' ? 'linkedin_oidc' : provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error(`Error al iniciar sesión con ${provider}`, { 
          description: error.message 
        });
      }
    } catch (error: any) {
      toast.error(`Error al iniciar sesión con ${provider}`, { 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-center mb-6">
        {activeTab === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
      </h1>
      
      <div className="space-y-4 mb-6">
        <Button 
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 space-x-2"
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
        >
          <Google className="w-5 h-5" />
          <span>Continuar con Google</span>
        </Button>
        
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 space-x-2"
          onClick={() => handleOAuthSignIn('apple')}
          disabled={loading}
        >
          <Apple className="w-5 h-5" />
          <span>Continuar con Apple</span>
        </Button>
        
        <Button 
          className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] space-x-2"
          onClick={() => handleOAuthSignIn('facebook')}
          disabled={loading}
        >
          <Facebook className="w-5 h-5" />
          <span>Continuar con Facebook</span>
        </Button>
        
        <Button 
          className="w-full bg-[#0077B5] text-white hover:bg-[#006699] space-x-2"
          onClick={() => handleOAuthSignIn('linkedin')}
          disabled={loading}
        >
          <Linkedin className="w-5 h-5" />
          <span>Continuar con LinkedIn</span>
        </Button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">O</span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email-login">Correo electrónico</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email-login"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password-login">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password-login"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple-dark"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullname-register">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fullname-register"
                  type="text"
                  placeholder="Nombre Apellido"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          
            <div>
              <Label htmlFor="email-register">Correo electrónico</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email-register"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password-register">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password-register"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres
              </p>
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple-dark"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
