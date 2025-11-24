import { Home, Heart, MessageCircle, User, Settings } from 'lucide-react';
import { NavLink } from './NavLink';

export const BottomNav = () => {
  const navItems = [
    { path: '/swipe', icon: Home, label: 'Início' },
    { path: '/matches', icon: Heart, label: 'Matches' },
    { path: '/messages', icon: MessageCircle, label: 'Mensagens' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/settings', icon: Settings, label: 'Config' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 text-muted-foreground transition-smooth"
              activeClassName="text-primary"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};
