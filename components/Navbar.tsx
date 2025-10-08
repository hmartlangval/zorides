'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const id = localStorage.getItem('userId');
    const userDataStr = localStorage.getItem('user');
    
    if (name) setUserName(name);
    if (id) setUserId(id);
    
    // V1.2 - Check if user is admin
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setIsAdmin(userData.email === 'admin@system.internal');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navLinks = [
    { href: '/feed', label: 'Feed', icon: '🏠', mobileLabel: '🏠' },
    { href: '/events', label: 'Events', icon: '📅', mobileLabel: '📅' },
    { href: '/messages', label: 'Messages', icon: '💬', mobileLabel: '💬' },
  ];
  
  // V1.2 - Add admin link if user is admin
  if (isAdmin) {
    navLinks.push({ href: '/admin', label: 'Admin', icon: '🔧', mobileLabel: '🔧' });
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/feed" className="text-xl sm:text-2xl font-bold gradient-bg bg-clip-text text-transparent flex-shrink-0">
            🎉 <span className="hidden sm:inline">Zorides</span>
          </Link>

          {/* Nav Links - Mobile optimized */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? 'primary' : 'ghost'}
                  size="sm"
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <span className="sm:hidden">{link.mobileLabel}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu - Mobile optimized */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {userId && (
              <Link href={`/profile/${userId}`} className="hidden sm:block">
                <span className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer">
                  Hi, <span className="font-semibold">{userName}</span>
                </span>
              </Link>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="sm:hidden">👋</span>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
