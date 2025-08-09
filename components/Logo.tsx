import React from 'react';
import { FaCode, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

interface LogoProps {
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ withText = true, size = 'md' }) => {
  const { userProfile } = useAuth();
  const isPremium = userProfile?.isPremium || false;

  const sizeClasses = {
    sm: {
      container: 'gap-2 p-1',
      icon: 'w-6 h-6',
      text: 'text-sm',
      subText: 'text-xs'
    },
    md: {
      container: 'gap-4 p-2',
      icon: 'w-9 h-9',
      text: 'text-xl',
      subText: 'text-base'
    },
    lg: {
      container: 'gap-6 p-3',
      icon: 'w-12 h-12',
      text: 'text-2xl',
      subText: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.container} rounded-xl transition-all duration-300 relative group hover:bg-secondary cursor-pointer`}>
      {/* Logo Icon Container */}
      <div className="relative flex items-center justify-center">
        {/* Main Logo Icon */}
        <div 
          className={`
            relative ${currentSize.icon} flex items-center justify-center rounded-xl text-white text-xl
            -rotate-12 transition-all duration-300 group-hover:rotate-0 group-hover:scale-105
            ${isPremium 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/20 group-hover:shadow-yellow-400/30' 
              : 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 group-hover:shadow-primary/30'
            }
          `}
          style={{
            boxShadow: isPremium 
              ? '0 4px 12px rgba(255, 215, 0, 0.2), 0 0 0 1px rgba(255, 215, 0, 0.1)' 
              : '0 4px 12px rgba(46, 200, 102, 0.2), 0 0 0 1px rgba(46, 200, 102, 0.1)'
          }}
        >
          <FaCode />
          
          {/* Decorative border effect */}
          <div 
            className={`absolute -inset-0.5 rounded-xl opacity-20 ${isPremium ? 'border-2 border-yellow-400' : 'border-2 border-primary'}`}
          />
        </div>
        
        {/* Secondary Icon */}
        <div 
          className={`
            absolute -bottom-1 -right-1 w-4 h-4 bg-bodyBg border-2 border-bodyBg rounded-full 
            flex items-center justify-center text-primary text-xs
            transition-all duration-300 group-hover:scale-110
            ${isPremium ? 'text-yellow-500' : 'text-primary'}
          `}
          style={{
            boxShadow: isPremium 
              ? '0 2px 8px rgba(255, 215, 0, 0.2)' 
              : '0 2px 8px rgba(46, 200, 102, 0.2)'
          }}
        >
          <FaGraduationCap />
        </div>
      </div>
      
      {/* Logo Text */}
      {withText && (
        <div className="flex items-baseline gap-1.5 relative py-1">
          {/* Main Text */}
          <span 
            className={`
              ${currentSize.text} font-extrabold relative inline-block transition-all duration-300
              bg-gradient-to-r bg-clip-text text-transparent tracking-tight
              group-hover:-translate-y-0.5
              ${isPremium 
                ? 'from-text via-yellow-500 to-text' 
                : 'from-text via-primary to-text'
              }
            `}
            style={{
              backgroundSize: '200% auto',
              textShadow: isPremium 
                ? '0 2px 4px rgba(255, 215, 0, 0.1)' 
                : '0 2px 4px rgba(46, 200, 102, 0.1)'
            }}
          >
            Frontend
            
            {/* Underline effect */}
            <div 
              className={`
                absolute -bottom-0.5 left-0 w-full h-0.5 transform scale-x-0 origin-left
                transition-transform duration-300 group-hover:scale-x-100
                ${isPremium 
                  ? 'bg-gradient-to-r from-yellow-500 via-yellow-500/20 to-transparent' 
                  : 'bg-gradient-to-r from-primary via-primary/20 to-transparent'
                }
              `}
            />
          </span>
          
          {/* Sub Text */}
          <span 
            className={`
              ${currentSize.subText} text-neutral font-semibold tracking-widest uppercase relative inline-block 
              pl-2 opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5
              ${isPremium ? 'group-hover:text-yellow-500' : 'group-hover:text-primary'}
            `}
          >
            School
            
            {/* Vertical divider */}
            <div 
              className={`
                absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/4 rounded-sm opacity-70
                ${isPremium 
                  ? 'bg-gradient-to-b from-yellow-500 to-yellow-500/40' 
                  : 'bg-gradient-to-b from-primary to-primary/40'
                }
              `}
            />
          </span>
        </div>
      )}
      
      {/* Container border effect */}
      <div 
        className={`
          absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100
          ${isPremium 
            ? 'bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent border border-yellow-400/20' 
            : 'bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20'
          }
        `}
      />
    </div>
  );
};

export default Logo;
