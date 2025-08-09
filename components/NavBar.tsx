import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useThemeContext } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { FaUser, FaBars, FaTimes, FaSignOutAlt, FaCog, FaCrown } from "react-icons/fa";

export default function NavBar() {
  const { theme, toggleTheme } = useThemeContext();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  // TODO: Implement premium user check from Firebase
  // For now, assume all users are non-premium
  const isPremiumUser = false;

  const menuLinks = [
    { href: "/dashboard", label: "Dashboard", auth: true },
    { href: "/problems", label: "Problems", auth: true },
    { href: "/practice", label: "Practice", auth: true },
    { href: "/mock-interviews", label: "Mock Interviews", auth: true },
    {
      href: "/interview-simulation",
      label: "Interview Simulation",
      auth: true,
    },
    // { href: "/premium", label: "Premium", auth: false },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        const hamburgerButton = document.querySelector('[aria-label="Toggle navigation menu"]');
        if (!hamburgerButton?.contains(event.target as Node)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
      // Navigate to home page after sign out
      router.push('/');
    } catch (error) {
      console.error('🚀 SignOut error:', error);
      closeCallback?.();
      // Still navigate even on error
      router.push('/');
    }
  };

  const NavLink = ({ href, label, active, auth, onClick }: { 
    href: string; 
    label: string; 
    active: boolean;
    auth: boolean;
    onClick?: () => void;
  }) => (
    <Link href={href} passHref legacyBehavior>
      <a
        className={`relative inline-flex items-center justify-center font-medium text-text no-underline px-4 py-2 rounded-lg transition-all duration-200 hover:bg-neutral/10 hover:text-neutralDark ${
          active ? "font-semibold text-primary bg-primary/10" : ""
        } ${auth && !user ? "opacity-75" : ""}`}
        onClick={(e) => {
          handleNavClick(href, auth, e);
          onClick?.();
        }}
        aria-current={active ? "page" : undefined}
        title={auth && !user ? "Login required" : undefined}
      >
        {label}
        {active && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full"></div>
        )}
      </a>
    </Link>
  );

  return (
    <>
      <header className="w-full bg-secondary/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" passHref legacyBehavior>
              <a 
                className="no-underline transition-all duration-200 hover:scale-105"
                aria-label="Frontend School Homepage"
              >
                <div className="hidden sm:block">
                  <Logo size="md" showText={true} />
                </div>
                <div className="block sm:hidden">
                  <Logo size="sm" showText={false} />
                </div>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
              {menuLinks.map(({ href, label, auth }) => {
                const active = router.pathname === href;
                return (
                  <NavLink
                    key={href}
                    href={href}
                    label={label}
                    active={active}
                    auth={auth}
                  />
                );
              })}
            </nav>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-3">
              {user && !isPremiumUser && (
                <Link href="/premium" passHref legacyBehavior>
                  <a className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold no-underline transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 flex items-center space-x-1">
                    <FaCrown className="w-3 h-3" />
                    <span>Premium</span>
                  </a>
                </Link>
              )}
              <ThemeToggle onToggle={toggleTheme} />
              
              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="w-8 h-8 rounded-full border-2 border-neutral/20 transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white hover:border-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="User menu"
                    aria-expanded={isProfileDropdownOpen}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-4 h-4" />
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="py-1">
                        <Link href="/profile" passHref legacyBehavior>
                          <a 
                            className="flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 no-underline"
                            onClick={closeProfileDropdown}
                          >
                            <FaUser className="w-4 h-4 mr-3 text-neutral" />
                            <span className="font-medium">Profile</span>
                          </a>
                        </Link>
                        <hr className="border-border my-1" />
                        <button
                          onClick={() => handleSignOut(closeProfileDropdown)}
                          className="w-full flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 text-left"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 text-neutral" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" passHref legacyBehavior>
                  <a className="bg-primary text-white px-4 py-2 rounded-lg no-underline font-medium transition-all duration-200 hover:bg-accent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Login
                  </a>
                </Link>
              )}
            </div>

            {/* Mobile Right Side */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle onToggle={toggleTheme} />
              {user && (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="w-8 h-8 rounded-full border-2 border-neutral/20 transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white hover:border-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="User menu"
                    aria-expanded={isProfileDropdownOpen}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-3 h-3" />
                    )}
                  </button>

                  {/* Mobile Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-secondary border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="py-1">
                        <Link href="/profile" passHref legacyBehavior>
                          <a 
                            className="flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 no-underline"
                            onClick={closeProfileDropdown}
                          >
                            <FaUser className="w-4 h-4 mr-3 text-neutral" />
                            <span className="font-medium">Profile</span>
                          </a>
                        </Link>
                        <hr className="border-border my-1" />
                        <button
                          onClick={() => handleSignOut(closeProfileDropdown)}
                          className="w-full flex items-center px-4 py-3 text-sm text-text hover:bg-neutral/10 transition-colors duration-200 text-left"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 text-neutral" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-text hover:bg-neutral/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
              >
                <FaBars className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Left Drawer */}
      <div
        ref={mobileDrawerRef}
        id="mobile-menu"
        className={`fixed top-0 left-0 h-full w-80 bg-secondary border-r border-border z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Logo size="md" showText={true} />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-text hover:bg-neutral/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
              aria-label="Close navigation menu"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1" role="navigation" aria-label="Mobile navigation">
            {menuLinks.map(({ href, label, auth }) => {
              const active = router.pathname === href;
              return (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  active={active}
                  auth={auth}
                  onClick={closeMobileMenu}
                />
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-border p-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-10 h-10 rounded-full border border-neutral/20 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-xs text-neutral truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {!isPremiumUser && (
                  <Link href="/premium" passHref legacyBehavior>
                    <a 
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-lg no-underline font-semibold transition-all duration-200 hover:from-amber-600 hover:to-orange-600 text-sm"
                      onClick={closeMobileMenu}
                    >
                      <FaCrown className="w-4 h-4" />
                      <span>Upgrade to Premium</span>
                    </a>
                  </Link>
                )}
                
                <div className="space-y-1">
                  <Link href="/profile" passHref legacyBehavior>
                    <a 
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-text hover:bg-neutral/10 transition-colors duration-200 no-underline"
                      onClick={closeMobileMenu}
                    >
                      <FaUser className="w-4 h-4 text-neutral" />
                      <span className="font-medium">Profile</span>
                    </a>
                  </Link>
                  <button
                    onClick={() => handleSignOut(closeMobileMenu)}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-text hover:bg-neutral/10 font-medium transition-colors duration-200 text-left"
                  >
                    <FaSignOutAlt className="w-4 h-4 text-neutral" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/login" passHref legacyBehavior>
                  <a 
                    className="block bg-primary text-white px-4 py-3 rounded-lg no-underline font-medium text-center transition-all duration-200 hover:bg-accent"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </a>
                </Link>
                <p className="text-xs text-neutral text-center">
                  Join Frontend School to access all features
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
