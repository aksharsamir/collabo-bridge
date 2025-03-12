import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Users } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { mockUsers } from '@/utils/messageUtils';

const Index = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: 'Real-time Chat',
      description: 'Communicate instantly with team members in real-time messaging.',
      path: '/chat',
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: 'File Sharing',
      description: 'Easily share and organize files with your team.',
      path: '/files',
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly on projects and tasks.',
      path: '/',
    },
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: 'Customization',
      description: 'Personalize your workspace to fit your team\'s needs.',
      path: '/settings',
    }
  ];

  return (
    <div className="animate-fade-in">
      <section className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient leading-tight">
            CollabSpace
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A beautiful, minimalist platform for team communication and file sharing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="glass-morphism rounded-xl p-6 hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="mt-auto flex items-center text-primary">
                  <span>Explore</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockUsers.map((user) => (
            <div key={user.id} className="glass-morphism rounded-xl p-6 animate-scale-in">
              <div className="flex flex-col items-center">
                <UserAvatar 
                  name={user.name} 
                  image={user.avatar} 
                  size="lg" 
                  status={user.status as 'online' | 'offline' | 'away'} 
                />
                <h3 className="mt-4 text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
