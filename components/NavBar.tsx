import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useThemeContext } from '@/hooks/useTheme';
import {
  FiBarChart2,
  FiCode,
  FiBookOpen,
  FiMap,
  FiUsers,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
} from 'react-icons/fi';

export default function NavBar() {
  const { user, signOut, loading } = useAuth();
  const { hasPremiumAccess, loading: subscriptionLoading } = useSubscription();
  const { theme, toggleTheme } = useThemeContext();
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  const isPremiumUser = hasPremiumAccess();
  const isLoading = loading || (user && subscriptionLoading);

  const menuLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiBarChart2, auth: true },
    { href: '/problems', label: 'Problems', icon: FiCode, auth: true },
    { href: '/practice', label: 'Practice', icon: FiBookOpen, auth: true },
    { href: '/roadmap', label: 'Roadmap', icon: FiMap, auth: true },
    {
      href: '/interview-simulation',
      label: 'Interviews',
      icon: FiUsers,
      auth: true,
    },
  ];

  const mobileNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiBarChart2, auth: true },
    { href: '/problems', label: 'Problems', icon: FiCode, auth: true },
    { href: '/practice', label: 'Practice', icon: FiBookOpen, auth: true },
    {
      href: '/interview-simulation',
      label: 'Interviews',
      icon: FiUsers,
      auth: true,
    },
  ];

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (href: string, auth: boolean, e: React.MouseEvent) => {
    if (auth && !user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const handleSignOut = async (closeCallback?: () => void) => {
    console.log('🚀 SignOut initiated');
    try {
      const result = await signOut();
      console.log('🚀 SignOut result:', result);
      closeCallback?.();
      router.push('/');
    } catch (error) {
      console.error('🚀 SignOut error:', error);
      closeCallback?.();
      router.push('/');
    }
  };

  const NavLink = ({
    href,
    label,
    icon: Icon,
    active,
    auth,
    onClick,
    isMobile = false,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
    auth: boolean;
    onClick?: () => void;
    isMobile?: boolean;
  }) => {
    if (auth && !user && !isLoading) return null;

    if (isMobile) {
      return (
        <Link href={href} passHref legacyBehavior>
          <a
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
              active
                ? 'text-primary bg-primary/10'
                : 'text-neutral hover:text-text hover:bg-neutral/10'
            }`}
            onClick={e => {
              handleNavClick(href, auth, e);
              onClick?.();
            }}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className='w-5 h-5 mb-1' />
            <span className='text-xs font-medium'>{label}</span>
          </a>
        </Link>
      );
    }

    return (
      <Link href={href} passHref legacyBehavior>
        <a
          className={`relative inline-flex items-center justify-center font-medium text-text no-underline px-4 py-2 rounded-lg transition-all duration-200 hover:bg-neutral/10 hover:text-neutralDark ${
            active ? 'font-semibold text-primary bg-primary/10' : ''
          }`}
          onClick={e => {
            handleNavClick(href, auth, e);
            onClick?.();
          }}
          aria-current={active ? 'page' : undefined}
        >
          {label}
          {active && (
            <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full'></div>
          )}
        </a>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className='hidden md:block w-full bg-secondary/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm'>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link href='/' passHref legacyBehavior>
              <a
                className='no-underline transition-all duration-200 hover:scale-105'
                aria-label='Frontend School Homepage'
              >
                <h1 className='text-xl font-bold text-text'>Frontend School</h1>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className='flex items-center space-x-2'
              role='navigation'
              aria-label='Main navigation'
            >
              {menuLinks.map(({ href, label, icon, auth }) => {
                const active = router.pathname === href;
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    icon={icon}
                    active={active}
                    auth={auth}
                  />
                );
              })}
            </nav>

            {/* Desktop Right Side */}
            <div className='flex items-center space-x-3'>
              {!isLoading && user && !isPremiumUser && (
                <Link href='/premium' passHref legacyBehavior>
                  <a className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold no-underline transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 flex items-center space-x-1'>
                    <FiBarChart2 className='w-3 h-3' />
                    <span>Premium</span>
                  </a>
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className='p-2 rounded-lg text-text hover:bg-neutral/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200'
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <FiSun className='w-5 h-5' />
                ) : (
                  <FiMoon className='w-5 h-5' />
                )}
              </button>

              {isLoading ? (
                <div className='w-8 h-8 rounded-full bg-neutral/20 animate-pulse'></div>
              ) : user ? (
                <div className='relative' ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className='w-8 h-8 rounded-full border-2 border-neutral/20 transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white hover:border-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                    aria-label='User menu'
                    aria-expanded={isProfileDropdownOpen}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt='User avatar'
                        className='w-full h-full rounded-full object-cover'
                      />
                    ) : (
                      <FiUser className='w-4 h-4' />
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className='absolute right-0 mt-3 w-48 bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden'>
                      <div className='py-1'>
                        <Link href='/profile' passHref legacyBehavior>
                          <a
                            className='flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 no-underline'
                            onClick={closeProfileDropdown}
                          >
                            <FiUser className='w-4 h-4 mr-3 text-neutral' />
                            <span className='font-medium'>Profile</span>
                          </a>
                        </Link>
                        <hr className='border-border my-1' />
                        <button
                          onClick={() => handleSignOut(closeProfileDropdown)}
                          className='w-full flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 text-left'
                        >
                          <FiLogOut className='w-4 h-4 mr-3 text-neutral' />
                          <span className='font-medium'>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href='/login' passHref legacyBehavior>
                  <a className='bg-primary text-white px-4 py-2 rounded-lg no-underline font-medium transition-all duration-200 hover:bg-accent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
                    Login
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className='md:hidden w-full bg-secondary/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm'>
        <div className='flex items-center justify-between px-4 py-3'>
          <Link href='/' passHref legacyBehavior>
            <a className='no-underline'>
              <h1 className='text-lg font-bold text-text'>Frontend School</h1>
            </a>
          </Link>

          <div className='flex items-center space-x-2'>
            {!isLoading && user && !isPremiumUser && (
              <Link href='/premium' passHref legacyBehavior>
                <a className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold no-underline'>
                  <FiBarChart2 className='w-3 h-3' />
                </a>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg text-text hover:bg-neutral/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200'
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? (
                <FiSun className='w-4 h-4' />
              ) : (
                <FiMoon className='w-4 h-4' />
              )}
            </button>

            {isLoading ? (
              <div className='w-8 h-8 rounded-full bg-neutral/20 animate-pulse'></div>
            ) : user ? (
              <div className='relative' ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className='w-8 h-8 rounded-full border-2 border-neutral/20 transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white hover:border-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  aria-label='User menu'
                  aria-expanded={isProfileDropdownOpen}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt='User avatar'
                      className='w-full h-full rounded-full object-cover'
                    />
                  ) : (
                    <FiUser className='w-3 h-3' />
                  )}
                </button>

                {/* Mobile Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className='absolute right-0 mt-3 w-48 bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden'>
                    <div className='py-1'>
                      <Link href='/profile' passHref legacyBehavior>
                        <a
                          className='flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 no-underline'
                          onClick={closeProfileDropdown}
                        >
                          <FiUser className='w-4 h-4 mr-3 text-neutral' />
                          <span className='font-medium'>Profile</span>
                        </a>
                      </Link>
                      <hr className='border-border my-1' />
                      <button
                        onClick={() => handleSignOut(closeProfileDropdown)}
                        className='w-full flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 text-left'
                      >
                        <FiLogOut className='w-4 h-4 mr-3 text-neutral' />
                        <span className='font-medium'>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href='/login' passHref legacyBehavior>
                <a className='bg-primary text-white px-3 py-1.5 rounded-lg no-underline text-sm font-medium transition-all duration-200 hover:bg-accent'>
                  Login
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {!isLoading && (
        <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-secondary/95 backdrop-blur-md border-t border-border z-50'>
          <div className='flex items-center justify-around px-2 py-2'>
            {mobileNavItems.map(({ href, label, icon, auth }) => {
              const active = router.pathname === href;
              return (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  icon={icon}
                  active={active}
                  auth={auth}
                  isMobile={true}
                />
              );
            })}
          </div>
        </nav>
      )}

      {/* Bottom padding for mobile to account for bottom navigation */}
      {!isLoading && <div className='md:hidden h-16'></div>}
    </>
  );
}
