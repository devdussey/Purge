import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  disabled?: boolean;
}

export function ActionButton({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ActionButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gradient-to-r from-dark-800 to-dark-700 hover:from-dark-700 hover:to-dark-600 text-white shadow-lg hover:shadow-xl';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl';
      case 'warning':
        return 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg hover:shadow-xl';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        w-full p-6 rounded-lg shadow-md transition-all duration-200 text-left
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      `}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-white bg-opacity-20 p-3 rounded-full">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm opacity-90 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}