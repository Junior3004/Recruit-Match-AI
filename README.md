# 🎯 Recruit-Match-AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.5-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![AI-Powered](https://img.shields.io/badge/AI-Google%20Gemini-red?logo=google)](https://ai.google.dev)

> **Intelligent Resume Screening & Candidate Matching with AI** | Análise Inteligente de Currículos com IA

**Recruit-Match-AI** is an intelligent resume screening platform that automates and accelerates the hiring process using Google Gemini AI. Analyze hundreds of resumes in seconds, match candidates with job requirements, and build better hiring pipelines.

---

## 📖 Table of Contents | Índice
- [🇺🇸 English](#english)
- [🇧🇷 Português Brasileiro](#português-brasileiro)

---

## 🇺🇸 English

### ✨ Features

- **AI-Powered Resume Screening** - Intelligent candidate matching using Google Gemini 2.0 Flash
- **Multi-Language Support** - English & Portuguese with dynamic language switching
- **Bulk Resume Processing** - Upload multiple PDFs and TXT files simultaneously
- **Smart Keyword Matching** - AI understands synonyms, variations, and related skills
- **Detailed Analytics** - View approval rates, compatibility scores, and applicant profiles
- **Secure Authentication** - User registration and login with localStorage persistence
- **Responsive Design** - Mobile-first UI that works on all devices
- **ZIP Export** - Download approved resumes in a single ZIP file
- **Real-time Processing** - Live feedback during resume analysis

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key (free tier available)

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Recruit-Match-AI.git
cd Recruit-Match-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Key**

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to add the API Key:**
- File: `src/lib/gemini.ts` (line 1-5)
- The key is used in the `analyzeResume()` function for resume analysis
- Get your free API key at: [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
```bash
npm run build
npm start
```

### 📋 How It Works

1. **User Registration** - Create account or login
2. **Start Selection Process** - Define job title and required keywords/skills
3. **Upload Resumes** - Drag & drop or select PDF/TXT files
4. **AI Analysis** - Gemini analyzes each resume against requirements
5. **Review Results** - See compatibility scores and filtered candidates
6. **Export Approved** - Download qualified resumes as ZIP

### 🏗️ Architecture

```
src/
├── app/                          # Next.js 16 App Router
│   ├── login/                    # Authentication
│   ├── cadastro/                 # User registration
│   ├── novo-processo/            # Create selection process
│   ├── processo/[id]/resultados/ # Results dashboard
│   └── api/                      # API routes
│       ├── process-resumes/      # Resume processing (Gemini)
│       ├── process-metadata/     # Results retrieval
│       └── download-resumes/     # ZIP export
├── contexts/
│   ├── AuthContext.tsx           # Authentication state
│   ├── ProcessContext.tsx        # Process management
│   └── LanguageContext.tsx       # i18n & language switching
├── components/
│   └── Navbar.tsx                # Navigation component
└── lib/
    ├── gemini.ts                 # AI analysis engine
    └── translations.ts           # Multi-language strings
```

### 🛠️ Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with SSR | 16.1.5 |
| **TypeScript** | Type-safe JavaScript | 5.0+ |
| **React 19** | UI library | 19.2.3 |
| **Google Gemini AI** | Resume analysis & matching | 2.0 Flash |
| **TailwindCSS** | Styling (CSS Modules) | - |
| **React Dropzone** | File upload | 14.3.8 |
| **JSZip** | ZIP file generation | 3.10.1 |
| **React Context API** | State management | Built-in |

### 🔑 Environment Variables

```env
# Required
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 📁 File Locations for API Configuration

**Main API Integration:**
- `src/lib/gemini.ts` - Contains the `analyzeResume()` function
  - Lines 1-10: API key initialization
  - Lines 15-45: Resume analysis logic

**API Routes:**
- `src/app/api/process-resumes/route.ts` - Handles bulk resume processing
- `src/app/api/process-metadata/[id]/route.ts` - Stores and retrieves results

### 💡 AI Matching Logic

The system uses Google Gemini 2.0 Flash with intelligent prompting to:
- Extract skills from resumes (even with typos/variations)
- Match against required keywords (understanding synonyms)
- Calculate compatibility percentage (minimum 50% for approval)
- Return structured data: `{ matches, score, foundKeywords }`

### 📦 Deployment

**Vercel (Recommended)**
```bash
vercel deploy
```

**Docker**
```bash
docker build -t recruit-match-ai .
docker run -p 3000:3000 recruit-match-ai
```

### 🔐 Security Considerations

- ⚠️ **Never commit `.env.local`** - Use environment variables
- Passwords are currently stored in localStorage (use proper backend hashing for production)
- Consider adding rate limiting for API calls
- Implement HTTPS in production

### 📚 API Documentation

#### POST `/api/process-resumes`
Analyze multiple resumes against keywords
```json
{
  "processName": "Senior Developer 2024",
  "keywords": ["React", "TypeScript", "Node.js"],
  "resumes": [File, File, ...]
}
```

#### GET `/api/process-metadata/:id`
Retrieve process results
```json
{
  "processId": "1234567890",
  "approvedCount": 5,
  "totalResumes": 12,
  "approvedResumes": [...]
}
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev) for intelligent resume analysis
- [Next.js](https://nextjs.org) for the amazing React framework
- [Vercel](https://vercel.com) for deployment platform

---

## 🇧🇷 Português Brasileiro

### ✨ Recursos

- **Análise de Currículos com IA** - Matching inteligente de candidatos usando Google Gemini 2.0 Flash
- **Suporte Multilíngue** - Inglês e Português com troca dinâmica de idioma
- **Processamento em Lote** - Envie múltiplos arquivos PDF e TXT simultaneamente
- **Matching Inteligente de Palavras-chave** - IA entende sinônimos, variações e skills relacionadas
- **Análise Detalhada** - Visualize taxas de aprovação, scores de compatibilidade e perfis
- **Autenticação Segura** - Registro e login com persistência em localStorage
- **Design Responsivo** - Interface mobile-first que funciona em todos os dispositivos
- **Exportação em ZIP** - Baixe currículos aprovados em um único arquivo
- **Processamento em Tempo Real** - Feedback ao vivo durante análise

### 🚀 Como Começar

#### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Chave da API Google Gemini (tier gratuito disponível)

#### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seuusuario/Recruit-Match-AI.git
cd Recruit-Match-AI
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure a Chave da API**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_aqui
```

**Onde adicionar a Chave da API:**
- Arquivo: `src/lib/gemini.ts` (linhas 1-5)
- A chave é usada na função `analyzeResume()` para análise de currículos
- Obtenha sua chave gratuita em: [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

5. **Build para produção**
```bash
npm run build
npm start
```

### 📋 Como Funciona

1. **Registro de Usuário** - Crie uma conta ou faça login
2. **Iniciar Processo Seletivo** - Defina título da vaga e palavras-chave necessárias
3. **Enviar Currículos** - Arraste ou selecione arquivos PDF/TXT
4. **Análise com IA** - Gemini analisa cada currículo contra os requisitos
5. **Visualizar Resultados** - Veja scores de compatibilidade e candidatos filtrados
6. **Exportar Aprovados** - Baixe currículos qualificados em ZIP

### 🏗️ Arquitetura

```
src/
├── app/                          # Next.js 16 App Router
│   ├── login/                    # Autenticação
│   ├── cadastro/                 # Registro de usuário
│   ├── novo-processo/            # Criar processo seletivo
│   ├── processo/[id]/resultados/ # Dashboard de resultados
│   └── api/                      # Rotas API
│       ├── process-resumes/      # Processamento (Gemini)
│       ├── process-metadata/     # Recuperação de resultados
│       └── download-resumes/     # Exportação ZIP
├── contexts/
│   ├── AuthContext.tsx           # Estado de autenticação
│   ├── ProcessContext.tsx        # Gerenciamento de processos
│   └── LanguageContext.tsx       # i18n & seletor de idioma
├── components/
│   └── Navbar.tsx                # Componente de navegação
└── lib/
    ├── gemini.ts                 # Motor de análise com IA
    └── translations.ts           # Strings multilíngues
```

### 🛠️ Stack de Tecnologias

| Tecnologia | Propósito | Versão |
|-----------|----------|--------|
| **Next.js** | Framework React com SSR | 16.1.5 |
| **TypeScript** | JavaScript type-safe | 5.0+ |
| **React 19** | Biblioteca UI | 19.2.3 |
| **Google Gemini AI** | Análise e matching de currículos | 2.0 Flash |
| **TailwindCSS** | Estilização (CSS Modules) | - |
| **React Dropzone** | Upload de arquivos | 14.3.8 |
| **JSZip** | Geração de arquivos ZIP | 3.10.1 |
| **React Context API** | Gerenciamento de estado | Nativo |

### 🔑 Variáveis de Ambiente

```env
# Obrigatório
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_api

# Opcional
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 📁 Locais para Configuração da API

**Integração Principal:**
- `src/lib/gemini.ts` - Contém a função `analyzeResume()`
  - Linhas 1-10: Inicialização da chave da API
  - Linhas 15-45: Lógica de análise de currículos

**Rotas API:**
- `src/app/api/process-resumes/route.ts` - Processamento em lote
- `src/app/api/process-metadata/[id]/route.ts` - Armazenamento de resultados

### 💡 Lógica de Matching com IA

O sistema usa Google Gemini 2.0 Flash com prompting inteligente para:
- Extrair skills de currículos (mesmo com erros/variações)
- Fazer match contra palavras-chave (entendendo sinônimos)
- Calcular percentual de compatibilidade (mínimo 50% para aprovação)
- Retornar dados estruturados: `{ matches, score, foundKeywords }`

### 📦 Deployment

**Vercel (Recomendado)**
```bash
vercel deploy
```

**Docker**
```bash
docker build -t recruit-match-ai .
docker run -p 3000:3000 recruit-match-ai
```

### 🔐 Considerações de Segurança

- ⚠️ **Nunca faça commit do `.env.local`** - Use variáveis de ambiente
- Senhas atualmente em localStorage (use hash adequado no backend para produção)
- Considere adicionar rate limiting nas chamadas de API
- Implemente HTTPS em produção

### 📚 Documentação da API

#### POST `/api/process-resumes`
Analisa múltiplos currículos contra palavras-chave
```json
{
  "processName": "Desenvolvedor Sênior 2024",
  "keywords": ["React", "TypeScript", "Node.js"],
  "resumes": [Arquivo, Arquivo, ...]
}
```

#### GET `/api/process-metadata/:id`
Recupera resultados do processo
```json
{
  "processId": "1234567890",
  "approvedCount": 5,
  "totalResumes": 12,
  "approvedResumes": [...]
}
```

### 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para enviar um Pull Request.

### 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 🙏 Agradecimentos

- [Google Gemini AI](https://ai.google.dev) pela análise inteligente de currículos
- [Next.js](https://nextjs.org) pelo framework React incrível
- [Vercel](https://vercel.com) pela plataforma de deployment

---

## 🔍 SEO Keywords

`resume screening` `AI recruitment` `automated hiring` `candidate matching` `gemini ai` `next.js` `typescript` `job applicant` `hr tech` `recruitment automation` `resume parser` `skill matching` `applicant tracking` `ATS` `hiring pipeline` `cv analysis`

---

**⭐ If you find this project useful, please consider giving it a star!** | **Se achou útil, considere dar uma ⭐!**
