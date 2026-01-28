'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProcess } from '@/contexts/ProcessContext';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

interface ResumeData {
  name: string;
  score: number;
  foundKeywords: string[];
}

interface ProcessMetadata {
  processId: string;
  processName: string;
  keywords: string[];
  createdAt: string;
  totalResumes: number;
  approvedCount: number;
  rejectedCount: number;
  approvedResumes: ResumeData[];
}

export default function ResultadosPage() {
  const params = useParams();
  const [metadata, setMetadata] = useState<ProcessMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { getProcess } = useProcess();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Carregar metadados do processo
    const loadMetadata = async () => {
      try {
        const response = await fetch(`/api/process-metadata/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
        }
      } catch (error) {
        console.error('Erro ao carregar metadados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [isAuthenticated, params?.id, router]);

  const handleDownload = () => {
    window.location.href = `/api/download-resumes/${params.id}`;
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Carregando resultados...</p>
          </div>
        </div>
      </>
    );
  }

  if (!metadata) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.card}>
              <h1 className={styles.title}>Processo não encontrado</h1>
              <button onClick={handleBack} className={styles.backButton}>
                Voltar para Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const approvalRate = Math.round((metadata.approvedCount / metadata.totalResumes) * 100);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.successIcon}>✅</div>

            <h1 className={styles.title}>Processo Concluído!</h1>
            <p className={styles.subtitle}>
              A análise dos currículos foi finalizada com sucesso
            </p>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{metadata.totalResumes}</div>
                <div className={styles.statLabel}>Total de Currículos</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statValue}>{metadata.approvedCount}</div>
                <div className={styles.statLabel}>Aprovados</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statValue}>{metadata.rejectedCount}</div>
                <div className={styles.statLabel}>Reprovados</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statValue}>{approvalRate}%</div>
                <div className={styles.statLabel}>Taxa de Aprovação</div>
              </div>
            </div>

            {metadata.approvedCount > 0 && (
              <>
                <button onClick={handleDownload} className={styles.downloadButton}>
                  <span>📥</span>
                  Baixar Currículos Aprovados (ZIP)
                </button>

                <div className={styles.resumesList}>
                  <h2 className={styles.sectionTitle}>Currículos Aprovados</h2>

                  {metadata.approvedResumes.map((resume, idx) => (
                    <div key={idx} className={styles.resumeItem}>
                      <div className={styles.resumeHeader}>
                        <span className={styles.resumeName}>{resume.name}</span>
                        <span className={styles.scoreBadge}>
                          {resume.score}% de compatibilidade
                        </span>
                      </div>

                      <div className={styles.keywordsList}>
                        {resume.foundKeywords.map((keyword, kidx) => (
                          <span key={kidx} className={styles.keyword}>
                            ✓ {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button onClick={handleBack} className={styles.backButton}>
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
