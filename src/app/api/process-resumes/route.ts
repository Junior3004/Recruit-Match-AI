import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { analyzeResumeFile } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  let tempDir: string | null = null;

  try {
    const formData = await request.formData();
    const processName = formData.get('processName') as string;
    const keywordsJson = formData.get('keywords') as string;
    const keywords = JSON.parse(keywordsJson);
    const resumes = formData.getAll('resumes') as File[];

    if (!processName || !keywords || resumes.length === 0) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Criar ID único para o processo
    const processId = Date.now().toString();

    // Criar pastas
    const processDir = join(process.cwd(), 'public', 'processos', processId);
    tempDir = join(process.cwd(), 'public', 'temp', processId);

    if (!existsSync(processDir)) {
      await mkdir(processDir, { recursive: true });
    }
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const approvedResumes: { name: string; score: number; foundKeywords: string[] }[] = [];
    const rejectedFiles: string[] = [];

    // Processar cada currículo
    for (const resume of resumes) {
      const bytes = await resume.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Salvar arquivo temporariamente
      const tempPath = join(tempDir, resume.name);
      await writeFile(tempPath, buffer);

      try {
        // Analisar arquivo com Gemini (suporta PDF e TXT)
        const analysis = await analyzeResumeFile(tempPath, resume.name, keywords);

        if (analysis.matches) {
          // Currículo aprovado - mover para pasta final
          const finalPath = join(processDir, resume.name);
          await writeFile(finalPath, buffer);
          approvedResumes.push({
            name: resume.name,
            score: analysis.score,
            foundKeywords: analysis.foundKeywords,
          });
        } else {
          // Currículo reprovado
          rejectedFiles.push(resume.name);
        }
      } catch (error) {
        console.error(`Erro ao processar ${resume.name}:`, error);
        rejectedFiles.push(resume.name);
      }
    }

    // Salvar metadados do processo
    const metadata = {
      processId,
      processName,
      keywords,
      createdAt: new Date().toISOString(),
      totalResumes: resumes.length,
      approvedCount: approvedResumes.length,
      rejectedCount: rejectedFiles.length,
      approvedResumes,
    };

    const metadataPath = join(processDir, 'metadata.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // Limpar pasta temporária
    if (tempDir && existsSync(tempDir)) {
      const files = await readdir(tempDir);
      for (const file of files) {
        await unlink(join(tempDir, file));
      }
    }

    return NextResponse.json({
      processId,
      approvedCount: approvedResumes.length,
      rejectedCount: rejectedFiles.length,
      approvedResumes,
    });
  } catch (error: any) {
    console.error('Erro ao processar currículos:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar currículos' },
      { status: 500 }
    );
  }
}
