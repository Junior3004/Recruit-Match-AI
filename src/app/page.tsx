'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcess } from '@/contexts/ProcessContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import styles from './home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { processes } = useProcess();
  const { t } = useLanguage();
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
      pending: t('home.statusLabels.pending'),
      processing: t('home.statusLabels.processing'),
      completed: t('home.statusLabels.completed')
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
            {t('home.heroTitle')}
          </h1>
          <button
            onClick={handleNewProcess}
            className={styles.startButton}
          >
            {t('home.startButton')}
          </button>
        </div>

        {processes.length > 0 && (
          <div className={styles.processesList}>
            <h2 className={styles.sectionTitle}>{t('home.processesList')}</h2>
            <div className={styles.processesGrid}>
              {processes.map((process) => (
                <div
                  key={process.id}
                  className={styles.processCard}
                  onClick={() => handleProcessClick(process.id)}
                >
                  <h3 className={styles.processName}>{process.name}</h3>

                  <div className={styles.processInfo}>
                    <span>📅 {new Date(process.createdAt).toLocaleDateString()}</span>
                    <span>📄 {process.totalResumes} {t('home.curriculumsUploaded')}</span>
                    {process.status === 'completed' && (
                      <span>✅ {process.approvedResumes} {t('home.approved')}</span>
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
