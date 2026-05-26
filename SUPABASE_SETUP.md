# Configuração do Supabase

Este guia explica como configurar o Supabase para o Church Songbook.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha os dados:
   - Nome do projeto: `church-songbook`
   - Senha do banco de dados: (guarde essa senha)
   - Região: escolha a mais próxima

## 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

No painel do Supabase, vá em **Settings > API** e copie:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Database Password** → `NEXT_PUBLIC_DATABASE_PASSWORD`

Atualize o arquivo `.env` com esses valores.

## 3. Criar Tabelas no Banco de Dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"

Isso criará:
- Tabela `songs` (músicas)
- Tabela `favorites` (favoritos)
- Índices para melhor performance
- Políticas de segurança (RLS)
- Triggers para atualização automática de timestamps

## 4. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication > Providers**
2. Habilite **Email** provider
3. Configure as opções:
   - ✅ Enable Email provider
   - ✅ Confirm email (opcional, mas recomendado)
   - ✅ Secure email change (recomendado)

### Configurar Email Templates (Opcional)

Em **Authentication > Email Templates**, você pode personalizar:
- Email de confirmação
- Email de recuperação de senha
- Email de convite

## 5. Testar a Conexão

Execute o projeto localmente:

```bash
npm run dev
# ou
yarn dev
```

Acesse `http://localhost:3000` e tente:
1. Criar uma conta em `/register`
2. Fazer login em `/login`
3. Adicionar uma música em `/songs/new`

## 6. Verificar Dados no Supabase

No painel do Supabase:
1. Vá em **Table Editor**
2. Selecione a tabela `songs` ou `favorites`
3. Verifique se os dados estão sendo salvos corretamente

## Estrutura das Tabelas

### Tabela `songs`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único da música |
| title | TEXT | Título da música |
| artist | TEXT | Artista/banda |
| youtube_url | TEXT | Link do YouTube (opcional) |
| spotify_url | TEXT | Link do Spotify (opcional) |
| cifra_url | TEXT | Link da cifra (opcional) |
| cifraclub_url | TEXT | Link do Cifra Club (opcional) |
| lyrics_url | TEXT | Link da letra (opcional) |
| other_links | JSONB | Outros links (opcional) |
| target | TEXT | Público-alvo (opcional) |
| theme | TEXT | Tema da música (opcional) |
| genre | TEXT | Gênero musical (opcional) |
| tone | TEXT | Tom da música (opcional) |
| bpm | INTEGER | BPM da música (opcional) |
| observations | TEXT | Observações (opcional) |
| created_by | UUID | ID do usuário que criou |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### Tabela `favorites`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único do favorito |
| user_id | UUID | ID do usuário |
| song_id | UUID | ID da música |
| created_at | TIMESTAMP | Data de criação |

## Políticas de Segurança (RLS)

### Songs
- ✅ Qualquer pessoa pode **visualizar** músicas
- ✅ Usuários autenticados podem **criar** músicas
- ✅ Usuários podem **editar** apenas suas próprias músicas
- ✅ Usuários podem **deletar** apenas suas próprias músicas

### Favorites
- ✅ Usuários podem **visualizar** apenas seus próprios favoritos
- ✅ Usuários podem **adicionar** favoritos
- ✅ Usuários podem **remover** seus próprios favoritos

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento

### Erro: "Row Level Security policy violation"
- Verifique se as políticas RLS foram criadas corretamente
- Execute novamente o script `supabase-schema.sql`

### Erro: "relation does not exist"
- As tabelas não foram criadas
- Execute o script `supabase-schema.sql` no SQL Editor

## Próximos Passos

- [ ] Configurar backup automático
- [ ] Adicionar mais campos conforme necessário
- [ ] Configurar webhooks (opcional)
- [ ] Adicionar analytics (opcional)

## Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
