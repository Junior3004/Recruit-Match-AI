'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('auth.login.errors.fillAllFields'));
      return;
    }

    const success = login(email, password);

    if (success) {
      router.push('/');
    } else {
      setError(t('auth.login.errors.invalidCredentials'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.languageSelector}>
        <button
          onClick={() => setLanguage('en')}
          className={`${styles.langButton} ${language === 'en' ? styles.langButtonActive : ''}`}
        >
          {t('common.english')}
        </button>
        <button
          onClick={() => setLanguage('pt')}
          className={`${styles.langButton} ${language === 'pt' ? styles.langButtonActive : ''}`}
        >
          {t('common.portuguese')}
        </button>
      </div>



      <div className={styles.card}>
              <div className={styles.logoContainer}>
        <Image
          src="/logo_1.png"
          alt="HR Select Logo"
          width={200}
          height={200}
          priority
          className={styles.logo}
        />
      </div>
        <h1 className={styles.title}>{t('auth.login.title')}</h1>
        <p className={styles.subtitle}>{t('auth.login.subtitle')}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>{t('auth.login.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder={t('auth.login.emailPlaceholder')}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>{t('auth.login.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder={t('auth.login.passwordPlaceholder')}
            />
          </div>

          <button type="submit" className={styles.button}>
            {t('auth.login.submitButton')}
          </button>
        </form>

        <div className={styles.footer}>
          {t('auth.login.noAccount')}{' '}
          <Link href="/cadastro" className={styles.link}>
            {t('auth.login.createAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
}
