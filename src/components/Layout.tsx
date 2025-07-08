import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
}

export function Layout({ children, title, showBackButton = false }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBackClick = () => {
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBackClick}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              )}
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            </div>
            
            <nav className="flex items-center gap-2">
              <Button
                variant={location.pathname === '/' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNavigation('/')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Comments Dashboard
              </Button>
              <Button
                variant={location.pathname === '/profile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleNavigation('/profile')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}