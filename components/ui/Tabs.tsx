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
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items?.map(item => {
        const isActive = item.id === activeTab;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200 select-none
              border border-border/50 backdrop-blur-sm min-w-0 border-border
              md:px-4
              ${
                isActive
                  ? 'text-white shadow-md shadow-primary/20 border-primary'
                  : 'bg-secondary/80 text-text hover:bg-secondary hover:border-border hover:shadow-sm hover:-translate-y-0.5'
              }
            `}
          >
            {item.icon && (
              <span
                className={`text-base ${isActive ? 'text-white' : 'text-text/70'} flex-shrink-0`}
              >
                {item.icon}
              </span>
            )}
            <span className='truncate'>{item.label}</span>
            {typeof item.count === 'number' && (
              <span
                className={`
                  inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-semibold rounded-full
                  flex-shrink-0
                  ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-primary/10 text-primary'
                  }
                `}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
