'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProcess } from '@/contexts/ProcessContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import styles from './home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { processes } = useProcess();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleNewProcess = () => {
    router.push('/novo-processo');
  };

  const handleProcessClick = (id: string) => {
    router.push(`/processo/${id}/resultados`);
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Concluído'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusClass = (status: string) => {
    const classes = {
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      completed: styles.statusCompleted
    };
    return classes[status as keyof typeof classes] || '';
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            INICIE UM NOVO PROCESSO SELETIVO
          </h1>
          <button
            onClick={handleNewProcess}
            className={styles.startButton}
          >
            Iniciar Novo Processo
          </button>
        </div>

        {processes.length > 0 && (
          <div className={styles.processesList}>
            <h2 className={styles.sectionTitle}>Processos Seletivos</h2>
            <div className={styles.processesGrid}>
              {processes.map((process) => (
                <div
                  key={process.id}
                  className={styles.processCard}
                  onClick={() => handleProcessClick(process.id)}
                >
                  <h3 className={styles.processName}>{process.name}</h3>

                  <div className={styles.processInfo}>
                    <span>📅 {new Date(process.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>📄 {process.totalResumes} currículos enviados</span>
                    {process.status === 'completed' && (
                      <span>✅ {process.approvedResumes} aprovados</span>
                    )}
                  </div>

                  <div className={styles.processKeywords}>
                    {process.keywords.slice(0, 3).map((keyword, idx) => (
                      <span key={idx} className={styles.keyword}>
                        {keyword}
                      </span>
                    ))}
                    {process.keywords.length > 3 && (
                      <span className={styles.keyword}>
                        +{process.keywords.length - 3}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.statusBadge} ${getStatusClass(process.status)}`}>
                    {getStatusLabel(process.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
