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
              text-sm font-medium transition-all duration-300 select-none
              border backdrop-blur-sm min-w-0
              md:px-4
              ${
                isActive
                  ? 'text-bodyBg bg-primary border-primary shadow-md shadow-primary/20 hover:bg-accent hover:border-accent'
                  : 'bg-secondary/80 text-text border-border/50 hover:bg-secondary hover:border-border hover:shadow-sm hover:-translate-y-0.5'
              }
            `}
          >
            {item.icon && (
              <span
                className={`text-base flex-shrink-0 transition-colors duration-300 ${
                  isActive ? 'text-bodyBg' : 'text-text/70'
                }`}
              >
                {item.icon}
              </span>
            )}
            <span className='truncate transition-colors duration-300'>
              {item?.label}
            </span>
            {typeof item.count === 'number' && (
              <span
                className={`
                  inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-semibold rounded-full
                  flex-shrink-0 transition-all duration-300
                  ${
                    isActive
                      ? 'bg-bodyBg/20 text-bodyBg'
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
