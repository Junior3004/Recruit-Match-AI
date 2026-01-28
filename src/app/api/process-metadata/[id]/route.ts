import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const processId = id;
    const metadataPath = join(
      process.cwd(),
      'public',
      'processos',
      processId,
      'metadata.json'
    );

    const metadataContent = await readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json(
      { error: 'Processo não encontrado' },
      { status: 404 }
    );
  }
}
