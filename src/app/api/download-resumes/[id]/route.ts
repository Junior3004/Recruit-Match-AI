import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import JSZip from 'jszip';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const processId = id;
    const processDir = join(process.cwd(), 'public', 'processos', processId);

    // Ler metadados
    const metadataPath = join(processDir, 'metadata.json');
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    // Criar ZIP
    const zip = new JSZip();

    // Adicionar todos os currículos aprovados ao ZIP
    const files = await readdir(processDir);

    for (const file of files) {
      if (file !== 'metadata.json') {
        const filePath = join(processDir, file);
        const fileContent = await readFile(filePath);
        zip.file(file, fileContent);
      }
    }

    // Gerar ZIP
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });

    // Retornar ZIP
    return new NextResponse(zipBuffer as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${metadata.processName}-aprovados.zip"`,
      },
    });
  } catch (error: any) {
    console.error('Erro ao criar ZIP:', error);
    return NextResponse.json(
      { error: 'Erro ao criar arquivo ZIP' },
      { status: 500 }
    );
  }
}
