import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiChevronDown } from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../hooks/useTheme';
import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { toggleTheme } = useThemeContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      console.log('🚀 SignOut initiated from ui/Navbar');
      setIsMenuOpen(false); // Close the menu first
      const result = await signOut();
      console.log('🚀 SignOut result:', result);
      
      // Navigate to home page after successful logout
      router.push('/');
    } catch (error) {
      console.error('🚀 SignOut error:', error);
      // Still navigate to home even on error
      router.push('/');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const links = [
    { href: '/dashboard', label: 'Dashboard', auth: true },
    { href: '/problems', label: 'Problems', auth: true },
    { href: '/practice', label: 'Practice', auth: true },
    { href: '/mock-interviews', label: 'Mock Interviews', auth: true },
    { href: '/interview-simulation', label: 'Simulation', auth: true },
    { href: '/premium', label: 'Premium', auth: false },
  ];

  return (
    <header className="w-full px-6 py-3 flex items-center justify-between bg-secondary/80 backdrop-blur border-b border-border sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-extrabold text-primary">
          Frontend School
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, auth }) => {
            if (auth && !user) return null;
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'text-primary bg-primary/10' : 'text-text hover:bg-secondary'}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle onToggle={toggleTheme} />
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="h-9 px-3 inline-flex items-center gap-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <img
                src={user.photoURL || ''}
                alt="avatar"
                className="h-6 w-6 rounded-full object-cover"
              />
              <FiChevronDown />
            </button>
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 min-w-[180px] rounded-xl border border-border bg-bodyBg shadow-card p-1"
              >
                <Link href="/profile" className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-secondary" role="menuitem">Profile</Link>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-text hover:bg-secondary" role="menuitem" onClick={handleSignOut}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-xl font-semibold shadow-card hover:shadow-lg">Login</Link>
        )}
      </div>
    </header>
  );
}

