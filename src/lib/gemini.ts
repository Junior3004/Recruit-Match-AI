import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('GEMINI_API_KEY não configurada. Configure no arquivo .env.local');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Analisar arquivo PDF ou texto com upload direto
export async function analyzeResumeFile(
  filePath: string,
  fileName: string,
  keywords: string[]
): Promise<{ matches: boolean; score: number; foundKeywords: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Ler arquivo
    const fileData = readFileSync(filePath);
    const mimeType = fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain';

    // Preparar conteúdo com arquivo
    const prompt = `Você é um analisador de currículos. Analise o documento anexado e verifique se contém EXATAMENTE estas palavras-chave:

PALAVRAS-CHAVE: ${keywords.map(k => `"${k}"`).join(', ')}

Busque por correspondências exatas ou muito similares (plural, variações).

RESPONDA APENAS COM JSON VÁLIDO (sem markdown):
{
  "matches": boolean,
  "score": number,
  "foundKeywords": ["palavra1", "palavra2"]
}

Regras:
- matches = true se encontrou 50%+ das palavras-chave
- score = porcentagem de palavras-chave encontradas
- foundKeywords = lista das palavras-chave encontradas exatamente no documento`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: fileData.toString('base64'),
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('Resposta Gemini (raw):', text);

    // Tentar extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('JSON não encontrado na resposta:', text);
      throw new Error('Resposta inválida da IA');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log('Análise parseada:', analysis);

    return {
      matches: analysis.matches === true,
      score: Number(analysis.score) || 0,
      foundKeywords: Array.isArray(analysis.foundKeywords) ? analysis.foundKeywords : [],
    };
  } catch (error) {
    console.error('Erro ao analisar arquivo:', error);
    return { matches: false, score: 0, foundKeywords: [] };
  }
}

export async function analyzeResume(
  resumeText: string,
  keywords: string[]
): Promise<{ matches: boolean; score: number; foundKeywords: string[] }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Você é um analisador de currículos. Analise o currículo abaixo e verifique se contém EXATAMENTE estas palavras-chave:

PALAVRAS-CHAVE: ${keywords.map(k => `"${k}"`).join(', ')}

CURRÍCULO:
${resumeText}

Busque por correspondências exatas ou muito similares (plural, variações).

RESPONDA APENAS COM JSON VÁLIDO (sem markdown):
{
  "matches": boolean,
  "score": number,
  "foundKeywords": ["palavra1", "palavra2"]
}

Regras:
- matches = true se encontrou 50%+ das palavras-chave
- score = porcentagem de palavras-chave encontradas
- foundKeywords = lista das palavras-chave encontradas exatamente no currículo`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Resposta Gemini (raw):', text);

    // Tentar extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('JSON não encontrado na resposta:', text);
      throw new Error('Resposta inválida da IA');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    console.log('Análise parseada:', analysis);

    return {
      matches: analysis.matches === true,
      score: Number(analysis.score) || 0,
      foundKeywords: Array.isArray(analysis.foundKeywords) ? analysis.foundKeywords : [],
    };
  } catch (error) {
    console.error('Erro ao analisar currículo:', error);
    // Em caso de erro, fazer análise simples baseada em texto
    return fallbackAnalysis(resumeText, keywords);
  }
}

// Análise de fallback caso a API falhe
function fallbackAnalysis(
  resumeText: string,
  keywords: string[]
): { matches: boolean; score: number; foundKeywords: string[] } {
  const lowerText = resumeText.toLowerCase();
  const foundKeywords = keywords.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  const score = foundKeywords.length > 0 
    ? Math.round((foundKeywords.length / keywords.length) * 100)
    : 0;
  const matches = score >= 50;

  console.log('Usando fallback - Score:', score, 'Encontradas:', foundKeywords);

  return { matches, score, foundKeywords };
}
