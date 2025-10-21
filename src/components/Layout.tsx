import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Plus, Images, BarChart3, LogOut, Sprout, Package, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/calendar', icon: Calendar, label: 'Calendário' },
    { path: '/plants', icon: Sprout, label: 'Plantas' },
    { path: '/new', icon: Plus, label: 'Adicionar' },
    { path: '/tents', icon: Home, label: 'Tendas' },
    { path: '/colheitas', icon: Leaf, label: 'Colheitas' },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      navigate('/auth');
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Grow Diary</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elegant">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isPlusButton = item.path === '/new';
            
            if (isPlusButton) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center transition-smooth',
                    '-mt-8'
                  )}
                >
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </Link>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-smooth',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
