'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProcess } from '@/contexts/ProcessContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import styles from './home.module.css';

// Ícone da lixeira como um componente SVG para facilitar
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { processes, deleteProcess } = useProcess();
  const { t } = useLanguage();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Resetar para a primeira página sempre que a busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!isAuthenticated) {
    return null;
  }

  const handleNewProcess = () => {
    router.push('/novo-processo');
  };

  const handleProcessClick = (id: string) => {
    router.push(`/processo/${id}/resultados`);
  };

  const handleDeleteProcess = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Impede que o card seja clicado junto

    if (window.confirm(t('home.confirmDelete'))) {
      try {
        const response = await fetch(`/api/delete-process/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete process folder');
        }
        
        deleteProcess(id);

      } catch (error) {
        console.error("Failed to delete process:", error);
        alert(t('home.deleteError'));
      }
    }
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

  const filteredProcesses = processes.filter(proc => 
    proc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredProcesses.length / ITEMS_PER_PAGE);
  const paginatedProcesses = filteredProcesses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <div className={styles.listHeader}>
              <h2 className={styles.sectionTitle}>{t('home.processesList')}</h2>
              <input 
                type="text"
                placeholder={t('home.searchPlaceholder')}
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.processesGrid}>
              {paginatedProcesses.map((process) => (
                <div
                  key={process.id}
                  className={styles.processCard}
                  onClick={() => handleProcessClick(process.id)}
                >
                  <button 
                    className={styles.deleteButton} 
                    onClick={(e) => handleDeleteProcess(e, process.id)}
                  >
                    <TrashIcon />
                  </button>
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
            
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {t('common.previous')}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? styles.activePage : ''}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
