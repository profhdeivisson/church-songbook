# 🎵 Repertório Musical - Igreja

Aplicativo web para gestão de repertório musical de igrejas, onde músicos podem cadastrar, buscar, favoritar e compartilhar músicas.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 16 + React 19 + TypeScript
- **UI:** Material UI (MUI) com tema dark/light
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Autenticação:** Email/senha + Google OAuth
- **Validação:** Zod
- **Package Manager:** Yarn 4

## 📋 Funcionalidades

### ✅ Implementadas (UI)
- [x] Listagem pública de músicas com filtros
- [x] Cards responsivos (1-4 colunas)
- [x] Filtros por busca, público-alvo, tema e gênero
- [x] Tema dark/light com persistência
- [x] Layout responsivo com drawer mobile
- [x] Formulário de cadastro/edição de músicas
- [x] Modal de detalhes completo
- [x] Páginas de login e registro
- [x] Página de favoritos

### ✅ Backend Integrado
- [x] Configuração do Supabase
- [x] Schema do banco de dados (SQL)
- [x] Server Actions (CRUD + Auth)
- [x] Integração com Supabase Auth
- [x] Sistema de favoritos
- [x] Middleware para autenticação
- [x] Row Level Security (RLS)

### 🚧 Pendentes
- [ ] Conectar UI com Server Actions
- [ ] Validação com Zod
- [ ] Sistema de notificações (Snackbars)
- [ ] Loading states e skeletons
- [ ] Tratamento de erros

## 🛠️ Setup Local

### Pré-requisitos
- Node.js 22+
- Yarn 4
- Conta Supabase (para backend)

### Instalação

```bash
# 1. Instalar dependências
yarn install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 3. Configurar banco de dados no Supabase
# Siga as instruções em SUPABASE_SETUP.md

# 4. Rodar servidor de desenvolvimento
yarn dev

# Build para produção
yarn build

# Rodar produção
yarn start
```

O app estará disponível em [http://localhost:3000](http://localhost:3000)

> **📖 Guia Completo:** Veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instruções detalhadas de configuração do Supabase.

## 📁 Estrutura do Projeto

```
church-songbook/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz com ThemeProvider
│   ├── page.tsx                 # Home (listagem de músicas)
│   ├── login/page.tsx           # Página de login
│   ├── register/page.tsx        # Página de cadastro
│   ├── favorites/page.tsx       # Músicas favoritadas
│   └── songs/
│       └── new/page.tsx         # Nova música
├── src/
│   ├── actions/                 # Server Actions
│   │   ├── auth.ts             # Autenticação (login, signup, logout)
│   │   └── songs.ts            # CRUD de músicas e favoritos
│   ├── components/
│   │   ├── auth/                # Componentes de autenticação
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── common/              # Componentes reutilizáveis
│   │   │   └── EmptyState.tsx
│   │   ├── layout/              # Componentes de layout
│   │   │   ├── AppLayout.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── songs/               # Componentes de músicas
│   │       ├── SongCard.tsx
│   │       ├── SongDetailModal.tsx
│   │       ├── SongFilters.tsx
│   │       ├── SongForm.tsx
│   │       └── SongGrid.tsx
│   ├── hooks/
│   │   └── useSupabase.ts      # Hook customizado para Supabase
│   ├── lib/
│   │   └── supabase/           # Configuração Supabase
│   │       ├── client.ts       # Cliente browser
│   │       ├── server.ts       # Cliente server
│   │       └── middleware.ts   # Middleware de autenticação
│   ├── providers/
│   │   └── ThemeProvider.tsx    # Provider de tema MUI
│   ├── theme/
│   │   └── theme.ts             # Configuração de tema
│   └── types/
│       ├── database.ts         # Tipos gerados do Supabase
│       └── song.ts             # Tipos TypeScript
├── middleware.ts                # Next.js middleware
├── supabase-schema.sql         # Schema do banco de dados
├── SUPABASE_SETUP.md           # Guia de configuração
└── .kiro/specs/                # Documentação do projeto
    └── church-music-repertoire/
        ├── requirements.md      # Requisitos detalhados
        ├── design.md           # Design técnico
        └── tasks.md            # Lista de tarefas
```

## 🎨 Tema Visual

### Paleta de Cores

**Light Mode:**
- Primary: `#1e3a5f` (Indigo profundo)
- Secondary: `#c9a84c` (Dourado)
- Background: `#fafbfc`
- Accent: `#e85d3a` (Coral suave)

**Dark Mode:**
- Primary: `#1e3a5f`
- Secondary: `#c9a84c`
- Background: `#0d1b2a`
- Accent: `#e85d3a`

### Responsividade

| Breakpoint | Largura | Cards/Linha | Navegação |
|------------|---------|-------------|-----------|
| xs | <600px | 1 | Hamburger |
| sm | 600-900px | 2 | Hamburger |
| md | 900-1200px | 3 | Inline |
| lg | >1200px | 4 | Inline |

## 🗄️ Modelo de Dados

### Tabela `songs`
- `id` (UUID)
- `title` (text, obrigatório)
- `artist` (text, obrigatório)
- `youtube_url`, `spotify_url`, `cifra_url`, `cifraclub_url`, `lyrics_url`
- `other_links` (jsonb)
- `target` (enum: adolescentes, jovens, adultos, criancas, idosos, todos)
- `theme` (enum: missao, salvacao, libertacao, oferta, louvor, adoracao, etc.)
- `genre` (enum: rock, pop_rock, baiao, corinho_fogo, sertanejo, gospel, etc.)
- `tone` (text)
- `bpm` (integer)
- `observations` (text)
- `created_by` (UUID FK)
- `created_at`, `updated_at`

### Tabela `favorites`
- `id` (UUID)
- `user_id` (UUID FK)
- `song_id` (UUID FK)
- `created_at`
- UNIQUE(user_id, song_id)

### Tabela `user_roles`
- `id` (UUID)
- `user_id` (UUID FK)
- `role` (enum: admin, musico, viewer)
- `created_at`

## 🔐 Segurança

- Row Level Security (RLS) em todas as tabelas
- Políticas de acesso baseadas em ownership e roles
- Autenticação via Supabase Auth
- HIBP para verificação de senhas comprometidas
- Service role key nunca exposta ao cliente

## 📝 Variáveis de Ambiente

Criar arquivo `.env` (copie de `.env.example`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
NEXT_PUBLIC_DATABASE_PASSWORD=your-database-password-here
```

> **⚠️ Importante:** Nunca commite o arquivo `.env` com credenciais reais!

## 🚀 Próximos Passos

1. **Conectar UI com Backend**
   - Integrar componentes com Server Actions
   - Adicionar loading states
   - Implementar tratamento de erros
   - Sistema de notificações (Snackbars)

2. **Validação e Segurança**
   - Validação com Zod nos formulários
   - Sanitização de inputs
   - Rate limiting

3. **Funcionalidades Avançadas**
   - Google OAuth
   - Upload de imagens
   - Exportar/importar repertório
   - Compartilhamento de músicas
   - Deploy (Vercel)

## 📚 Documentação

Documentação completa disponível em `.kiro/specs/church-music-repertoire/`:
- `requirements.md` - 11 requisitos com critérios de aceitação
- `design.md` - Arquitetura, schema, APIs, UI/UX
- `tasks.md` - 15 tarefas organizadas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
