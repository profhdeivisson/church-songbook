# ⚡ Quick Start Guide

Guia rápido para começar a usar o Church Songbook.

## 🚀 Setup em 5 Minutos

### 1. Clone e Instale (1 min)

```bash
# Clone o repositório
git clone <seu-repo>
cd church-songbook

# Instale dependências
yarn install
```

### 2. Configure Variáveis de Ambiente (1 min)

```bash
# Copie o template
cp .env.example .env

# Edite o .env com suas credenciais do Supabase
nano .env  # ou use seu editor favorito
```

### 3. Configure o Supabase (3 min)

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-schema.sql`
3. Copie as credenciais de **Settings > API** para o `.env`

### 4. Rode o Projeto

```bash
yarn dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📝 Comandos Principais

```bash
# Desenvolvimento
yarn dev              # Inicia servidor de desenvolvimento

# Build
yarn build            # Cria build de produção
yarn start            # Roda build de produção

# Qualidade de Código
yarn lint             # Executa ESLint
yarn tsc --noEmit     # Verifica tipos TypeScript

# Limpeza
rm -rf .next          # Remove cache do Next.js
rm -rf node_modules   # Remove dependências
yarn install          # Reinstala dependências
```

---

## 🗂️ Estrutura de Pastas

```
church-songbook/
├── app/                    # Páginas (Next.js App Router)
├── src/
│   ├── actions/           # Server Actions (backend)
│   ├── components/        # Componentes React
│   ├── hooks/            # Hooks customizados
│   ├── lib/              # Configurações (Supabase)
│   ├── providers/        # Context Providers
│   ├── theme/            # Tema MUI
│   └── types/            # Tipos TypeScript
├── public/               # Arquivos estáticos
├── .env                  # Variáveis de ambiente (não commitar!)
└── supabase-schema.sql   # Schema do banco de dados
```

---

## 🔑 Variáveis de Ambiente

```env
# .env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
NEXT_PUBLIC_DATABASE_PASSWORD=sua-senha-do-banco
```

> ⚠️ **Nunca commite o arquivo `.env`!**

---

## 🎯 Fluxo de Trabalho

### Adicionar Nova Funcionalidade

1. **Criar componente** em `src/components/`
2. **Criar Server Action** em `src/actions/` (se necessário)
3. **Criar página** em `app/`
4. **Testar** localmente
5. **Commit** e **push**

### Exemplo: Adicionar Campo na Música

1. **Atualizar tipo** em `src/types/song.ts`
2. **Atualizar schema SQL** em `supabase-schema.sql`
3. **Executar SQL** no Supabase
4. **Atualizar tipos do banco** em `src/types/database.ts`
5. **Atualizar formulário** em `src/components/songs/SongForm.tsx`
6. **Atualizar Server Action** em `src/actions/songs.ts`

---

## 🐛 Troubleshooting

### Erro: "Invalid API key"

```bash
# Verifique se o .env está correto
cat .env

# Reinicie o servidor
# Ctrl+C e depois:
yarn dev
```

### Erro: "relation does not exist"

```sql
-- Execute o schema SQL no Supabase
-- SQL Editor > New Query > Cole o conteúdo de supabase-schema.sql
```

### Erro: "Row Level Security policy violation"

```sql
-- Verifique se as políticas RLS foram criadas
-- Supabase > Authentication > Policies
-- Se não existirem, execute o schema SQL novamente
```

### Erro: "Module not found"

```bash
# Limpe o cache e reinstale
rm -rf .next node_modules
yarn install
yarn dev
```

### Erro de TypeScript

```bash
# Verifique os erros
yarn tsc --noEmit

# Se for erro de tipos do Supabase, regenere:
# (Isso será implementado futuramente com Supabase CLI)
```

### Página não atualiza após mudança

```bash
# Limpe o cache do Next.js
rm -rf .next
yarn dev
```

---

## 📚 Documentação Completa

- **Setup Detalhado:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Exemplos de Código:** [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)
- **Resumo da Integração:** [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)
- **README Principal:** [README.md](./README.md)

---

## 🔗 Links Úteis

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Next.js Docs](https://nextjs.org/docs)
- [Material UI Docs](https://mui.com/material-ui/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

## 💡 Dicas Rápidas

### Ver logs do Supabase
```
Supabase Dashboard > Logs > API Logs
```

### Testar autenticação
```
1. Acesse /register
2. Crie uma conta
3. Verifique em Supabase > Authentication > Users
```

### Adicionar dados de teste
```sql
-- No SQL Editor do Supabase
INSERT INTO songs (title, artist, created_by)
VALUES ('Amazing Grace', 'John Newton', 'seu-user-id');
```

### Ver dados no banco
```
Supabase Dashboard > Table Editor > songs
```

### Resetar banco de dados
```sql
-- ⚠️ CUIDADO: Isso apaga TODOS os dados!
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS songs CASCADE;

-- Depois execute o schema SQL novamente
```

---

## 🎉 Pronto para Começar!

Agora você tem tudo configurado. Próximos passos:

1. ✅ Criar sua primeira conta em `/register`
2. ✅ Adicionar uma música em `/songs/new`
3. ✅ Favoritar músicas
4. ✅ Filtrar e buscar
5. ✅ Personalizar o tema (dark/light)

**Divirta-se codando! 🚀**
