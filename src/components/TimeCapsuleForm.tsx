import React, { useState } from 'react';
import { Send, Calendar, Lock, Unlock } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Toggle } from './ui/Toggle';
import { apiRequest } from '../hooks/useApi';
import { TimeCapsule } from '../types';

export const TimeCapsuleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    unlockDate: '',
    isPublic: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.unlockDate) {
      newErrors.unlockDate = 'Unlock date is required';
    } else {
      const unlockDate = new Date(formData.unlockDate);
      const now = new Date();
      if (unlockDate <= now) {
        newErrors.unlockDate = 'Unlock date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await apiRequest<TimeCapsule>('/api/capsules', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      // Reset form
      setFormData({
        name: '',
        message: '',
        unlockDate: '',
        isPublic: true
      });
      
      // Show success message (you could add a toast notification here)
      alert('Time capsule created successfully!');
    } catch (error) {
      alert('Failed to create time capsule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Time Capsule</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Enter your name"
            className="text-lg"
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className={`
                w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                transition-colors duration-200
                ${errors.message ? 'border-red-500' : ''}
              `}
              placeholder="Write your message to the future..."
            />
            {errors.message && (
              <p className="text-sm text-red-500 animate-pulse">{errors.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <Input
              label="Unlock Date"
              type="datetime-local"
              value={formData.unlockDate}
              onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
              error={errors.unlockDate}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              {formData.isPublic ? (
                <Unlock className="w-5 h-5 text-green-500" />
              ) : (
                <Lock className="w-5 h-5 text-red-500" />
              )}
              <div>
                <h3 className="text-white font-medium">
                  {formData.isPublic ? 'Public' : 'Private'}
                </h3>
                <p className="text-sm text-gray-400">
                  {formData.isPublic 
                    ? 'Visible to everyone when unlocked' 
                    : 'Only visible to you'
                  }
                </p>
              </div>
            </div>
            <Toggle
              checked={formData.isPublic}
              onChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
          </div>
          
          <Button
            type="submit"
            loading={isSubmitting}
            size="large"
            className="w-full"
            icon={<Send className="w-5 h-5" />}
          >
            {isSubmitting ? 'Creating Capsule...' : 'Create Time Capsule'}
          </Button>
        </form>
      </div>
    </div>
  );
};