
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, FileText, Users, Settings } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Users className="w-5 h-5" /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/files', label: 'Files', icon: <FileText className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];
  
  return (
    <div className="w-20 lg:w-64 h-screen glass-morphism border-r border-border z-10 flex flex-col transition-all duration-300 ease-in-out">
      <div className="p-6">
        <div className="text-2xl font-bold text-gradient hidden lg:block">CollabSpace</div>
        <div className="text-2xl font-bold text-gradient lg:hidden">CS</div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center p-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground neo-morphism shadow-sm' 
                      : 'hover:bg-secondary text-foreground'}
                  `}
                >
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span className="ml-3 hidden lg:block">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="flex items-center p-3 rounded-lg glass-morphism">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div className="ml-3 hidden lg:block">
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
        </div>
      </div>
    </div>
  );
};
