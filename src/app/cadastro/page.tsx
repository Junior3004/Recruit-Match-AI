'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function CadastroPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError(t('auth.register.errors.fillAllFields'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.register.errors.passwordLength'));
      return;
    }

    const success = register(name, email, password);

    if (success) {
      router.push('/');
    } else {
      setError(t('auth.register.errors.emailExists'));
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
        <h1 className={styles.title}>{t('auth.register.title')}</h1>
        <p className={styles.subtitle}>{t('auth.register.subtitle')}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>{t('auth.register.fullName')}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder={t('auth.register.namePlaceholder')}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>{t('auth.register.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder={t('auth.register.emailPlaceholder')}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>{t('auth.register.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder={t('auth.register.passwordPlaceholder')}
            />
          </div>

          <button type="submit" className={styles.button}>
            {t('auth.register.submitButton')}
          </button>
        </form>

        <div className={styles.footer}>
          {t('auth.register.hasAccount')}{' '}
          <Link href="/login" className={styles.link}>
            {t('auth.register.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
