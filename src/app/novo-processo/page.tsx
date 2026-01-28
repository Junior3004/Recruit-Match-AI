'use client';

import { useState, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/contexts/AuthContext';
import { useProcess } from '@/contexts/ProcessContext';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function NovoProcessoPage() {
  const [processName, setProcessName] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addProcess } = useProcess();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      file => file.type === 'application/pdf' || file.type === 'text/plain'
    );
    setFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!processName.trim()) {
      setError('Digite um nome para o processo seletivo');
      return;
    }

    if (keywords.length === 0) {
      setError('Adicione pelo menos uma palavra-chave');
      return;
    }

    if (files.length === 0) {
      setError('Faça upload de pelo menos um currículo');
      return;
    }

    setProcessing(true);

    try {
      // Criar FormData para enviar arquivos
      const formData = new FormData();
      formData.append('processName', processName);
      formData.append('keywords', JSON.stringify(keywords));
      files.forEach(file => {
        formData.append('resumes', file);
      });

      // Enviar para API
      const response = await fetch('/api/process-resumes', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar currículos');
      }

      // Adicionar processo ao contexto
      addProcess({
        id: data.processId,
        name: processName,
        keywords,
        createdAt: new Date().toISOString(),
        status: 'completed',
        totalResumes: files.length,
        approvedResumes: data.approvedCount,
      });

      // Redirecionar para resultados
      router.push(`/processo/${data.processId}/resultados`);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar currículos');
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (processing) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.form}>
              <div className={styles.processing}>
                <h2 className={styles.processingTitle}>Processando Currículos</h2>
                <p className={styles.processingText}>
                  A IA está analisando os currículos com base nas palavras-chave fornecidas...
                </p>
                <div className={styles.spinner}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>NOVO PROCESSO SELETIVO</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="processName" className={styles.label}>
                Nome do Processo Seletivo
              </label>
              <input
                id="processName"
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className={styles.input}
                placeholder="Ex: Desenvolvedor Full Stack - 2024"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="keywords" className={styles.label}>
                Palavras-chave / Skills
              </label>

              {keywords.length > 0 && (
                <div className={styles.keywordsContainer}>
                  {keywords.map((keyword, idx) => (
                    <div key={idx} className={styles.keywordTag}>
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className={styles.removeKeyword}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                id="keywords"
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                className={styles.input}
                placeholder="Digite uma palavra-chave e pressione Enter"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Upload de Currículos
              </label>

              <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
              >
                <input {...getInputProps()} />
                <div className={styles.dropzoneContent}>
                  <div className={styles.uploadIcon}>📄</div>
                  <p className={styles.dropzoneText}>
                    {isDragActive
                      ? 'Solte os arquivos aqui...'
                      : 'Arraste currículos aqui ou clique para selecionar'
                    }
                  </p>
                  <p className={styles.dropzoneHint}>
                    Formatos aceitos: PDF, TXT
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className={styles.filesList}>
                  {files.map((file, idx) => (
                    <div key={idx} className={styles.fileItem}>
                      <span className={styles.fileName}>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className={styles.removeFile}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={processing}
            >
              Iniciar Processo Seletivo
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
