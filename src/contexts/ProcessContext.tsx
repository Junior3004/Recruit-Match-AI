'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SelectiveProcess {
  id: string;
  name: string;
  keywords: string[];
  createdAt: string;
  status: 'pending' | 'processing' | 'completed';
  totalResumes: number;
  approvedResumes: number;
}

interface ProcessContextType {
  processes: SelectiveProcess[];
  addProcess: (process: SelectiveProcess) => void;
  updateProcess: (id: string, updates: Partial<SelectiveProcess>) => void;
  deleteProcess: (id: string) => void;
  getProcess: (id: string) => SelectiveProcess | undefined;
}

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<SelectiveProcess[]>([]);

  useEffect(() => {
    // Carregar processos do localStorage
    const storedProcesses = localStorage.getItem('selectiveProcesses');
    if (storedProcesses) {
      setProcesses(JSON.parse(storedProcesses));
    }
  }, []);

  const addProcess = (process: SelectiveProcess) => {
    const updatedProcesses = [...processes, process];
    setProcesses(updatedProcesses);
    localStorage.setItem('selectiveProcesses', JSON.stringify(updatedProcesses));
  };

  const updateProcess = (id: string, updates: Partial<SelectiveProcess>) => {
    const updatedProcesses = processes.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    setProcesses(updatedProcesses);
    localStorage.setItem('selectiveProcesses', JSON.stringify(updatedProcesses));
  };

  const deleteProcess = (id: string) => {
    const updatedProcesses = processes.filter(p => p.id !== id);
    setProcesses(updatedProcesses);
    localStorage.setItem('selectiveProcesses', JSON.stringify(updatedProcesses));
  };

  const getProcess = (id: string) => {
    return processes.find(p => p.id === id);
  };

  return (
    <ProcessContext.Provider value={{ processes, addProcess, updateProcess, deleteProcess, getProcess }}>
      {children}
    </ProcessContext.Provider>
  );
}

export function useProcess() {
  const context = useContext(ProcessContext);
  if (context === undefined) {
    throw new Error('useProcess must be used within a ProcessProvider');
  }
  return context;
}
