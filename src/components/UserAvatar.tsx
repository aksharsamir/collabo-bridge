
import React from 'react';

interface UserAvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
}

export const UserAvatar = ({ name, image, size = 'md', status }: UserAvatarProps) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
    
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };
  
  return (
    <div className="relative">
      {image ? (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium`}>
          {initials}
        </div>
      )}
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background
            ${status === 'online' ? 'bg-green-500' : 
              status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`}
        />
      )}
    </div>
  );
};
