'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    const success = login(email, password);

    if (success) {
      router.push('/');
    } else {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bem-vindo de volta</h1>
        <p className={styles.subtitle}>Entre para continuar</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>

        <div className={styles.footer}>
          Não tem uma conta?{' '}
          <Link href="/cadastro" className={styles.link}>
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
