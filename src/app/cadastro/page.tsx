'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function CadastroPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const success = register(name, email, password);

    if (success) {
      router.push('/');
    } else {
      setError('Este email já está cadastrado');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Criar Conta</h1>
        <p className={styles.subtitle}>Comece a gerenciar seus processos seletivos</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Nome Completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Digite seu nome"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit" className={styles.button}>
            Criar Conta
          </button>
        </form>

        <div className={styles.footer}>
          Já tem uma conta?{' '}
          <Link href="/login" className={styles.link}>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
