# ✅ Checklist de Integração

Use este checklist para acompanhar o progresso da integração do Church Songbook com Supabase.

## 📦 1. Setup Inicial

- [ ] Dependências instaladas (`yarn install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Projeto Supabase criado
- [ ] Schema SQL executado no Supabase
- [ ] Tabelas criadas (songs, favorites)
- [ ] Políticas RLS ativas
- [ ] Servidor de desenvolvimento rodando (`yarn dev`)

## 🔐 2. Autenticação

### Backend
- [x] Server Actions criadas (`src/actions/auth.ts`)
  - [x] `login()`
  - [x] `signup()`
  - [x] `logout()`
  - [x] `getUser()`
- [x] Middleware de autenticação configurado

### Frontend
- [ ] `LoginForm.tsx` integrado com `login()`
- [ ] `RegisterForm.tsx` integrado com `signup()`
- [ ] `AppLayout.tsx` mostra usuário autenticado
- [ ] Botão de logout funcional
- [ ] Redirecionamento após login/logout
- [ ] Mensagens de erro exibidas
- [ ] Loading states nos formulários

### Testes
- [ ] Criar conta nova funciona
- [ ] Login com conta existente funciona
- [ ] Logout funciona
- [ ] Redirecionamento para /login quando não autenticado
- [ ] Mensagens de erro aparecem corretamente

## 🎵 3. CRUD de Músicas

### Backend
- [x] Server Actions criadas (`src/actions/songs.ts`)
  - [x] `getSongs()`
  - [x] `getSongById()`
  - [x] `createSong()`
  - [x] `updateSong()`
  - [x] `deleteSong()`

### Frontend - Listagem
- [ ] `app/page.tsx` usa `getSongs()`
- [ ] Músicas são exibidas no grid
- [ ] Filtros funcionam (busca, target, theme, genre)
- [ ] Paginação/scroll infinito (opcional)
- [ ] Loading skeleton enquanto carrega

### Frontend - Criar
- [ ] `app/songs/new/page.tsx` usa `createSong()`
- [ ] Formulário valida campos obrigatórios
- [ ] Mensagem de sucesso após criar
- [ ] Redirecionamento após criar
- [ ] Mensagem de erro se falhar
- [ ] Loading state no botão

### Frontend - Editar
- [ ] Página de edição criada
- [ ] Formulário pré-preenchido com dados
- [ ] `updateSong()` chamado ao salvar
- [ ] Mensagem de sucesso/erro
- [ ] Redirecionamento após editar

### Frontend - Deletar
- [ ] Botão de deletar adicionado
- [ ] Confirmação antes de deletar
- [ ] `deleteSong()` chamado
- [ ] Mensagem de sucesso/erro
- [ ] Lista atualizada após deletar

### Testes
- [ ] Criar música funciona
- [ ] Listar músicas funciona
- [ ] Filtrar músicas funciona
- [ ] Editar música funciona
- [ ] Deletar música funciona
- [ ] Apenas dono pode editar/deletar

## ⭐ 4. Sistema de Favoritos

### Backend
- [x] Server Actions criadas
  - [x] `toggleFavorite()`
  - [x] `getFavorites()`
  - [x] `isFavorite()`

### Frontend
- [ ] `SongCard.tsx` tem botão de favorito
- [ ] Ícone muda quando favoritado
- [ ] `toggleFavorite()` chamado ao clicar
- [ ] Loading state no botão
- [ ] `app/favorites/page.tsx` usa `getFavorites()`
- [ ] Página de favoritos mostra músicas
- [ ] Empty state quando sem favoritos

### Testes
- [ ] Favoritar música funciona
- [ ] Desfavoritar música funciona
- [ ] Página de favoritos mostra músicas corretas
- [ ] Ícone de favorito atualiza em tempo real
- [ ] Apenas usuário autenticado pode favoritar

## 🎨 5. UI/UX

### Loading States
- [ ] Skeleton na listagem de músicas
- [ ] Spinner nos botões durante ações
- [ ] Loading indicator em favoritos
- [ ] Loading em formulários

### Mensagens de Feedback
- [ ] Snackbar de sucesso ao criar música
- [ ] Snackbar de erro em falhas
- [ ] Snackbar de sucesso ao favoritar
- [ ] Mensagens de validação em formulários
- [ ] Confirmação antes de deletar

### Responsividade
- [ ] Mobile (< 600px) - 1 coluna
- [ ] Tablet (600-900px) - 2 colunas
- [ ] Desktop (900-1200px) - 3 colunas
- [ ] Large (> 1200px) - 4 colunas
- [ ] Menu hamburger no mobile
- [ ] Formulários responsivos

### Acessibilidade
- [ ] Labels em todos os inputs
- [ ] Botões com aria-labels
- [ ] Foco visível em elementos
- [ ] Contraste adequado
- [ ] Navegação por teclado funciona

## 🔒 6. Segurança

### Row Level Security
- [ ] Políticas RLS ativas no Supabase
- [ ] Apenas autenticados criam músicas
- [ ] Apenas donos editam/deletam
- [ ] Favoritos são privados por usuário

### Validação
- [ ] Validação de email
- [ ] Validação de senha (mínimo 6 caracteres)
- [ ] Validação de URLs
- [ ] Sanitização de inputs
- [ ] Proteção contra XSS

### Autenticação
- [ ] Middleware protege rotas privadas
- [ ] Tokens são renovados automaticamente
- [ ] Logout limpa sessão
- [ ] Redirecionamento correto após login

## 🧪 7. Testes

### Testes Manuais
- [ ] Criar conta e fazer login
- [ ] Adicionar 5 músicas diferentes
- [ ] Filtrar por cada categoria
- [ ] Buscar por título e artista
- [ ] Favoritar e desfavoritar
- [ ] Editar música própria
- [ ] Tentar editar música de outro (deve falhar)
- [ ] Deletar música própria
- [ ] Fazer logout e login novamente
- [ ] Testar em mobile, tablet e desktop
- [ ] Testar tema dark e light

### Testes de Performance
- [ ] Listagem carrega em < 2s
- [ ] Filtros respondem instantaneamente
- [ ] Favoritar é instantâneo
- [ ] Sem memory leaks
- [ ] Imagens otimizadas

## 📱 8. Features Extras (Opcional)

- [ ] Google OAuth
- [ ] Upload de imagens de capa
- [ ] Compartilhar música (link)
- [ ] Exportar repertório (PDF/Excel)
- [ ] Modo offline (PWA)
- [ ] Notificações push
- [ ] Comentários em músicas
- [ ] Playlists/Setlists
- [ ] Histórico de edições
- [ ] Busca avançada

## 🚀 9. Deploy

### Preparação
- [ ] Build local funciona (`yarn build`)
- [ ] Sem erros de TypeScript
- [ ] Sem warnings de ESLint
- [ ] Variáveis de ambiente documentadas
- [ ] README atualizado

### Vercel
- [ ] Projeto conectado ao Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy de produção funcionando
- [ ] Domínio customizado (opcional)
- [ ] SSL ativo

### Pós-Deploy
- [ ] Testar todas as funcionalidades em produção
- [ ] Verificar logs de erro
- [ ] Monitorar performance
- [ ] Configurar analytics (opcional)

## 📊 10. Monitoramento

- [ ] Logs de erro configurados
- [ ] Analytics configurado (opcional)
- [ ] Monitoramento de uptime
- [ ] Backup do banco de dados
- [ ] Documentação atualizada

---

## 🎯 Progresso Geral

**Backend:** ✅ 100% (Completo)
- [x] Supabase configurado
- [x] Server Actions criadas
- [x] Middleware configurado
- [x] Tipos TypeScript

**Frontend:** ⏳ 0% (Pendente)
- [ ] Componentes integrados
- [ ] Loading states
- [ ] Tratamento de erros
- [ ] Testes

**Deploy:** ⏳ 0% (Pendente)
- [ ] Build de produção
- [ ] Deploy na Vercel
- [ ] Testes em produção

---

## 📝 Notas

- Marque os itens conforme for completando
- Priorize autenticação e CRUD básico primeiro
- Deixe features extras para depois
- Teste cada funcionalidade antes de marcar como completa
- Documente problemas encontrados

---

## 🆘 Precisa de Ajuda?

- **Setup:** Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Exemplos:** Ver [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)
- **Quick Start:** Ver [QUICK_START.md](./QUICK_START.md)
- **Resumo:** Ver [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)

---

**Última atualização:** $(date)
**Status:** Backend completo, Frontend pendente
