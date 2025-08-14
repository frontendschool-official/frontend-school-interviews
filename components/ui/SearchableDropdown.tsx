import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

export interface SearchableDropdownOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface SearchableDropdownProps {
  options: SearchableDropdownOption[];
  value: SearchableDropdownOption | null;
  onValueChange: (option: SearchableDropdownOption | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchableDropdown({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  loading = false,
  disabled = false,
  error,
  className = '',
  emptyMessage = 'No options available',
  noResultsMessage = 'No results found',
  icon,
  size = 'md',
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleOptionSelect = (option: SearchableDropdownOption) => {
    onValueChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconContainerSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full flex items-center justify-between border-2 border-border rounded-lg bg-bodyBg text-left focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-300 focus:border-red-500' : ''
        } ${sizeClasses[size]}`}
      >
        {value ? (
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`bg-primary/10 rounded-md flex items-center justify-center ${iconContainerSizes[size]}`}>
                {icon}
              </div>
            )}
            <div>
              <div className={`font-medium text-text ${size === 'sm' ? 'text-sm' : 'text-sm'}`}>
                {value.label}
              </div>
              {value.description && (
                <div className="text-xs text-neutral">{value.description}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`bg-secondary rounded-md flex items-center justify-center ${iconContainerSizes[size]}`}>
                {icon}
              </div>
            )}
            <div>
              <div className={`font-medium text-text ${size === 'sm' ? 'text-sm' : 'text-sm'}`}>
                {placeholder}
              </div>
            </div>
          </div>
        )}
        <FiChevronDown
          className={`text-neutral transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${iconSizes[size]}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-bodyBg border-2 border-border rounded-lg shadow-xl max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-border/50">
            <div className="relative">
              <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-neutral" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm border border-border rounded-md bg-bodyBg text-text placeholder-neutral focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-neutral">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-1"></div>
                <span className="text-xs">Loading...</span>
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="py-1">
                {filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className="w-full flex items-center gap-2 p-2 text-left hover:bg-secondary focus:bg-secondary focus:outline-none transition-colors duration-150"
                  >
                    {option.icon && (
                      <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center">
                        {option.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-text text-sm">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-neutral">{option.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="p-3 text-center text-neutral text-sm">
                {noResultsMessage} for "{searchQuery}"
              </div>
            ) : (
              <div className="p-3 text-center text-neutral text-sm">{emptyMessage}</div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
