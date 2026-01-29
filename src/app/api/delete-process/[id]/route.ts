import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define o caminho base para a pasta de processos.
const PROCESSES_DIR = path.join(process.cwd(), 'public', 'processes');

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Process ID is required' }, { status: 400 });
  }

  try {
    const processDir = path.join(PROCESSES_DIR, id);
    
    // Tenta remover o diretório. A opção `recursive` é para deletar o conteúdo
    // e `force` ignora o erro se o diretório não existir.
    await fs.rm(processDir, { recursive: true, force: true });

    // Se a pasta não existia ou foi deletada com sucesso, a operação é um sucesso.
    return NextResponse.json({ message: `Process folder ${id} handled successfully.` }, { status: 200 });

  } catch (error) {
    // Este bloco só será atingido por outros erros inesperados (ex: permissão).
    console.error(`Failed to handle process directory ${id}:`, error);
    return NextResponse.json({ error: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}
