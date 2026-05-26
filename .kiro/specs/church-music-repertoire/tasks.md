# Tasks

## Task 1: Configurar Supabase e Migrations

**Status:** pending

**Description:**
Configurar projeto Supabase, criar as tabelas do banco de dados (songs, favorites, user_roles), implementar RLS policies e funções auxiliares.

**Acceptance Criteria:**
- Projeto Supabase criado e configurado
- Tabelas songs, favorites e user_roles criadas com todos os campos especificados
- Índices criados para otimização de queries
- RLS policies implementadas para todas as tabelas
- Função has_role() criada com SECURITY DEFINER
- Trigger update_updated_at implementado
- Variáveis de ambiente configuradas (.env.local)

**Dependencies:** None

---

## Task 2: Implementar Server Functions para Songs

**Status:** pending

**Description:**
Criar as Server Functions para operações CRUD de músicas usando Next.js Server Actions e Supabase client.

**Acceptance Criteria:**
- getSongs() implementado com suporte a filtros (search, target, theme, genre)
- getSongById() implementado
- createSong() implementado com autenticação
- updateSong() implementado com verificação de ownership
- deleteSong() implementado com verificação de ownership
- Tratamento de erros adequado em todas as funções
- Validação de dados com Zod

**Dependencies:** Task 1

---

## Task 3: Implementar Server Functions para Favorites

**Status:** pending

**Description:**
Criar as Server Functions para gerenciamento de favoritos.

**Acceptance Criteria:**
- getUserFavorites() implementado
- toggleFavorite() implementado
- isFavorite() implementado
- Tratamento de erros adequado
- RLS policies validadas

**Dependencies:** Task 1

---

## Task 4: Implementar Autenticação

**Status:** pending

**Description:**
Configurar Supabase Auth com email/senha e Google OAuth, criar páginas de login/registro e implementar middleware de proteção de rotas.

**Acceptance Criteria:**
- Supabase Auth configurado (email confirmation, HIBP)
- Google OAuth configurado
- Página /login criada com LoginForm
- Página /register criada com RegisterForm
- Páginas /forgot-password e /reset-password criadas
- Middleware de autenticação implementado
- Context/Provider para gerenciar estado de autenticação
- Redirecionamento automático para /login em rotas protegidas

**Dependencies:** Task 1

---

## Task 5: Criar Página de Nova Música

**Status:** pending

**Description:**
Implementar a rota /songs/new com o SongForm para cadastro de novas músicas.

**Acceptance Criteria:**
- Rota /songs/new criada e protegida
- SongForm integrado com validação Zod
- Chamada a createSong() no submit
- Feedback visual (loading, success, error) com Snackbar
- Redirecionamento para home após sucesso
- Tratamento de erros

**Dependencies:** Task 2, Task 4

---

## Task 6: Criar Página de Edição de Música

**Status:** pending

**Description:**
Implementar a rota /songs/edit/[id] com o SongForm pré-preenchido para edição.

**Acceptance Criteria:**
- Rota /songs/edit/[id] criada e protegida
- Carregamento dos dados da música via getSongById()
- SongForm pré-preenchido
- Verificação de ownership (created_by ou admin)
- Chamada a updateSong() no submit
- Feedback visual com Snackbar
- Redirecionamento após sucesso

**Dependencies:** Task 2, Task 4

---

## Task 7: Implementar Modal de Detalhes da Música

**Status:** pending

**Description:**
Criar o componente SongDetailModal que exibe todos os detalhes de uma música com ações (favoritar, compartilhar, editar, excluir).

**Acceptance Criteria:**
- Componente SongDetailModal criado
- Exibição de todos os campos da música
- Links externos com ícones das plataformas
- Botão de favoritar funcional
- Botão de compartilhar (copia URL)
- Botões de editar/excluir condicionais (owner ou admin)
- Dialog de confirmação para exclusão
- Integração com toggleFavorite() e deleteSong()

**Dependencies:** Task 2, Task 3

---

## Task 8: Criar Rota Pública de Detalhes

**Status:** pending

**Description:**
Implementar a rota pública /song/[id] para compartilhamento com meta tags Open Graph.

**Acceptance Criteria:**
- Rota /song/[id] criada (pública)
- Carregamento via getSongById()
- Meta tags og:title, og:description, og:url configuradas
- Página 404 para IDs inexistentes
- Exibição completa dos detalhes da música
- Botão de compartilhar funcional

**Dependencies:** Task 2

---

## Task 9: Implementar Página de Favoritos

**Status:** pending

**Description:**
Criar a rota protegida /favorites que exibe as músicas favoritadas pelo usuário.

**Acceptance Criteria:**
- Rota /favorites criada e protegida
- Carregamento via getUserFavorites()
- SongGrid exibindo músicas favoritas
- EmptyState quando não há favoritos
- Botão de desfavoritar funcional
- Atualização otimista da UI

**Dependencies:** Task 3, Task 4

---

## Task 10: Integrar Filtros na Home

**Status:** pending

**Description:**
Conectar o componente SongFilters com a listagem de músicas na home, implementando filtros client-side ou server-side.

**Acceptance Criteria:**
- SongFilters integrado com getSongs()
- Filtros refletidos na query string da URL
- Debounce no campo de busca (300ms)
- Atualização da listagem sem reload completo
- EmptyState quando não há resultados
- Loading state durante busca

**Dependencies:** Task 2

---

## Task 11: Implementar Feedback Visual (Snackbars)

**Status:** pending

**Description:**
Criar um sistema de notificações toast/snackbar para feedback de ações (sucesso, erro, info).

**Acceptance Criteria:**
- Provider/Context para gerenciar snackbars
- Componente Snackbar reutilizável (MUI)
- Integração em todas as ações (criar, editar, excluir, favoritar, compartilhar)
- Mensagens descritivas para cada ação
- Auto-dismiss após 3-5 segundos

**Dependencies:** None

---

## Task 12: Adicionar Loading States e Skeletons

**Status:** pending

**Description:**
Implementar estados de carregamento com Skeletons do MUI para melhorar a UX durante fetching de dados.

**Acceptance Criteria:**
- Skeleton para SongCard criado
- Loading state na home durante carregamento inicial
- Loading state nos filtros
- Loading state no SongForm durante submit
- Suspense boundaries onde apropriado

**Dependencies:** None

---

## Task 13: Implementar Validação com Zod

**Status:** pending

**Description:**
Criar schemas Zod para validação de dados de músicas e integrar com o SongForm.

**Acceptance Criteria:**
- Schema Zod para Song criado
- Validação no SongForm antes do submit
- Mensagens de erro inline nos campos
- Validação de URLs
- Validação de campos obrigatórios (title, artist)

**Dependencies:** None

---

## Task 14: Testes Responsivos e Ajustes Finais

**Status:** pending

**Description:**
Testar a aplicação em diferentes tamanhos de tela e fazer ajustes finais de UI/UX.

**Acceptance Criteria:**
- Testado em mobile (<600px)
- Testado em tablet (600-900px)
- Testado em desktop (>900px)
- Drawer mobile funcionando corretamente
- Grid responsivo (1-4 colunas) funcionando
- Filtros responsivos (drawer em mobile)
- Tema dark/light funcionando em todos os componentes
- Acessibilidade básica validada

**Dependencies:** All previous tasks

---

## Task 15: Documentação e Deploy

**Status:** pending

**Description:**
Documentar o projeto (README, variáveis de ambiente) e preparar para deploy.

**Acceptance Criteria:**
- README.md atualizado com instruções de setup
- Documentação de variáveis de ambiente
- Scripts de migration documentados
- Deploy em Vercel ou similar
- Domínio configurado (opcional)
- SSL configurado
- Monitoramento básico configurado

**Dependencies:** All previous tasks
