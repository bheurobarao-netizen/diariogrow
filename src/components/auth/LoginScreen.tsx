import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Leaf, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginScreen = () => {
  const [pin, setPin] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const { login, setPin: savePin, pin: storedPin } = useAuthStore();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storedPin) {
      // Primeiro acesso - criar PIN
      if (pin.length < 4) {
        toast({
          title: 'Senha muito curta',
          description: 'A senha deve ter pelo menos 4 caracteres',
          variant: 'destructive',
        });
        return;
      }
      
      if (pin !== confirmPin) {
        toast({
          title: 'Senhas não conferem',
          description: 'Digite a mesma senha nos dois campos',
          variant: 'destructive',
        });
        return;
      }
      
      savePin(pin);
      toast({
        title: 'Bem-vindo!',
        description: 'Seu diário foi criado com sucesso',
      });
    } else {
      // Login com PIN existente
      if (login(pin)) {
        toast({
          title: 'Bem-vindo de volta!',
          description: 'Login realizado com sucesso',
        });
      } else {
        toast({
          title: 'Senha incorreta',
          description: 'Tente novamente',
          variant: 'destructive',
        });
      }
    }
  };
  
  const isFirstTime = !storedPin;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-primary p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 shadow-glow">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Grow Diary</h1>
          <p className="text-white/80">Seu diário de cultivo pessoal e privado</p>
        </div>
        
        <div className="bg-card rounded-2xl shadow-elegant p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Lock className="w-5 h-5" />
            <h2 className="text-xl font-semibold">
              {isFirstTime ? 'Criar Senha' : 'Login'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isFirstTime ? 'Escolha sua senha (4-20 caracteres)' : 'Digite sua senha'}
              </label>
              <Input
                type="password"
                maxLength={20}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                className="text-center text-xl tracking-wide"
              />
            </div>
            
            {isFirstTime && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirme sua senha</label>
                <Input
                  type="password"
                  maxLength={20}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••••••"
                  className="text-center text-xl tracking-wide"
                />
              </div>
            )}
            
            <Button type="submit" className="w-full gradient-primary">
              {isFirstTime ? 'Criar Diário' : 'Entrar'}
            </Button>
          </form>
        </div>
        
        <p className="text-center text-white/60 text-sm">
          🔒 Seus dados são privados e armazenados apenas no seu dispositivo
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
