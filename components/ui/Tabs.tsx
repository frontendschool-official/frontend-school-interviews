import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-border/30 ${className}`}>
      <div className='flex flex-wrap gap-0'>
        {items?.map(item => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                group relative inline-flex items-center justify-center gap-2 px-4 py-3
                text-sm font-medium transition-all duration-200 select-none
                min-w-0 border-b-2 border-transparent
                hover:bg-secondary/30 hover:border-border/50
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
                ${
                  isActive
                    ? 'text-primary border-primary bg-secondary/20'
                    : 'text-text/70 hover:text-text'
                }
              `}
              aria-selected={isActive}
              role='tab'
            >
              {item.icon && (
                <span
                  className={`text-base flex-shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-text/50 group-hover:text-text/70'
                  }`}
                  aria-hidden='true'
                >
                  {item.icon}
                </span>
              )}
              <span className='truncate transition-colors duration-200'>
                {item?.label}
              </span>
              {typeof item.count === 'number' && (
                <span
                  className={`
                    inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-semibold rounded-full
                    flex-shrink-0 transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-text/10 text-text/60 group-hover:bg-text/20 group-hover:text-text/80'
                    }
                  `}
                  aria-label={`${item.count} items`}
                >
                  {item.count}
                </span>
              )}
              {/* Active indicator line with animation */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm
                  transition-all duration-200 ease-out
                  ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
                `}
              />
              {/* Hover indicator line */}
              {!isActive && (
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-0.5 bg-border/50 rounded-t-sm
                    transition-all duration-200 ease-out opacity-0 group-hover:opacity-100
                  `}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
