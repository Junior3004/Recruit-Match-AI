'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className={styles.navbar}>
      <Image
        src="/logo_2.png"
        alt="HR Select Logo"
        width={200}
        height={200}
        priority
        className={styles.navLogo}
      />

      {user && (
        <div className={styles.userSection}>
          <span className={styles.userName}>{user.name}</span>
          <div
            className={styles.userIcon}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials(user.name)}
          </div>

          {showDropdown && (
            <div className={styles.dropdown}>
              <div
                className={`${styles.dropdownItem} ${styles.logoutButton}`}
                onClick={handleLogout}
              >
                {t('navbar.logout')}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
