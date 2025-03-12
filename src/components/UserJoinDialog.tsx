
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createUser } from '@/lib/db';

interface UserJoinDialogProps {
  open: boolean;
  onComplete: (user: { id: string; name: string; status: string }) => void;
}

export const UserJoinDialog = ({ open, onComplete }: UserJoinDialogProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    const user = createUser(name.trim());
    
    // Store user ID in localStorage for session persistence
    localStorage.setItem('currentUserId', user.id);
    localStorage.setItem('currentUserName', user.name);
    
    onComplete(user);
  };
  
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Join Chat</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name to join"
              className="w-full"
              autoFocus
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Join Chat</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserJoinDialog;
