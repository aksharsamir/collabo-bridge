
import React from 'react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div 
          key={location.pathname}
          className="animate-fade-in p-6 md:p-8 lg:p-10 h-screen overflow-y-auto"
        >
          {children}
        </div>
      </main>
    </div>
  );
};
