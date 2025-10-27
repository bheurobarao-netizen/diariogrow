import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Plus, BarChart3, User, Sprout, Leaf, Package, TreeDeciduous, Zap, Calculator } from 'lucide-react';
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
    { path: '/stats', icon: BarChart3, label: 'Stats' },
    { path: '/plants', icon: Sprout, label: 'Plantas' },
    { path: '/new', icon: Plus, label: 'Adicionar' },
    { path: '/calendar', icon: Calendar, label: 'Calendário' },
    { path: '/tents', icon: TreeDeciduous, label: 'Tendas' },
    { path: '/equipment', icon: Zap, label: 'Equipamentos' },
    { path: '/colheitas', icon: Leaf, label: 'Colheitas' },
    { path: '/insumos', icon: Package, label: 'Insumos' },
    { path: '/calculators', icon: Calculator, label: 'Calc' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Grow Diary</h1>
          <Link to="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Perfil
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
        <div className="flex items-center h-20 w-full px-2 sm:px-4 gap-1 sm:gap-2 max-w-4xl mx-auto overflow-x-auto scrollbar-hide snap-x snap-mandatory">
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
                    'flex flex-col items-center justify-center transition-all duration-300 flex-shrink-0 snap-center',
                    '-mt-10 mx-2 sm:mx-3 hover:scale-110'
                  )}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow hover:shadow-xl transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                  </div>
                </Link>
              );
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex-shrink-0 min-w-[60px] sm:min-w-[70px] hover:bg-primary/10 snap-center',
                  isActive
                    ? 'text-primary bg-primary/10 scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:scale-105'
                )}
              >
                <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300', isActive && 'scale-110')} />
                <span className={cn(
                  'text-[9px] sm:text-[10px] font-medium whitespace-nowrap transition-all duration-300',
                  isActive && 'font-semibold'
                )}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
