# Requirements Document

## Introduction

Aplicativo web para gestão de repertório musical de igrejas. A plataforma permite que músicos cadastrem, busquem, filtrem, favoritarem e compartilhem músicas, organizadas por público-alvo, tema e gênero. O sistema oferece acesso público à listagem e detalhes de músicas, com funcionalidades protegidas (cadastro, edição, favoritos) disponíveis apenas para usuários autenticados.

A stack utilizada é Next.js + React 19, Material UI (MUI) para interface, Supabase como backend (PostgreSQL + Auth + Storage) e autenticação via e-mail/senha e Google OAuth.

## Glossary

- **Sistema**: O aplicativo web de gestão de repertório musical.
- **Usuário**: Qualquer pessoa que acessa o Sistema, autenticada ou não.
- **Músico**: Usuário autenticado com permissão para cadastrar e editar músicas.
- **Admin**: Usuário com papel administrativo, capaz de gerenciar qualquer música e papéis de usuários.
- **Música**: Registro contendo título, artista, links externos, metadados musicais e classificações.
- **Repertório**: Conjunto de músicas cadastradas no Sistema.
- **Favorito**: Associação entre um Músico autenticado e uma Música.
- **SongCard**: Componente visual que exibe um resumo de uma Música na listagem.
- **SongDetailModal**: Componente de diálogo que exibe todos os detalhes de uma Música.
- **SongForm**: Formulário de cadastro e edição de Músicas.
- **SongFilters**: Componente de filtros aplicados à listagem de Músicas.
- **AppLayout**: Layout principal com barra de navegação e menu lateral.
- **Supabase**: Plataforma de backend utilizada para banco de dados, autenticação e armazenamento.
- **RLS**: Row Level Security — políticas de segurança em nível de linha no banco de dados Supabase.
- **Público-alvo (target)**: Classificação da Música por faixa etária ou grupo: `adolescentes`, `jovens`, `adultos`, `criancas`, `idosos`, `todos`.
- **Tema**: Classificação temática da Música: `missao`, `salvacao`, `libertacao`, `oferta`, `louvor`, `adoracao`, `gratidao`, `perdao`, `esperanca`, `fe`, `familia`, `natal`, `pascoa`, `outro`.
- **Gênero**: Classificação de estilo musical: `rock`, `pop_rock`, `baiao`, `corinho_fogo`, `sertanejo`, `gospel`, `contemporaneo`, `hino`, `tradicional`, `outro`.
- **Tom**: Tonalidade musical da Música (ex: "D", "Em", "G/B").
- **BPM**: Batidas por minuto — andamento da Música.
- **Server Function**: Função executada no servidor via `createServerFn`, responsável por operações de banco de dados.
- **Zod**: Biblioteca de validação de esquemas utilizada no SongForm.
- **HIBP**: Have I Been Pwned — serviço de verificação de senhas vazadas.

---

## Requirements

### Requirement 1: Listagem Pública de Músicas

**User Story:** Como um usuário, quero visualizar o repertório completo de músicas sem precisar me autenticar, para que eu possa explorar o acervo livremente.

#### Acceptance Criteria

1. THE Sistema SHALL exibir a listagem de Músicas cadastradas na rota `/` para qualquer Usuário, autenticado ou não.
2. WHEN a página inicial é carregada, THE Sistema SHALL buscar as Músicas via Server Function `getSongs` e exibi-las em um SongGrid responsivo; IF a Server Function `getSongs` retornar um erro, THEN THE Sistema SHALL exibir um EmptyState ou mensagem de erro sem travar a página.
3. THE SongGrid SHALL exibir 1 coluna em telas menores que 600px, 2 colunas entre 600px e 900px, 3 colunas entre 900px e 1200px, e 4 colunas acima de 1200px.
4. WHEN não há Músicas cadastradas ou nenhum resultado corresponde aos filtros aplicados, THE Sistema SHALL exibir um componente EmptyState com mensagem descritiva dentro da estrutura do SongGrid.
5. WHEN a listagem está sendo carregada, THE Sistema SHALL exibir Skeletons nos lugares dos SongCards.

---

### Requirement 2: Filtros e Busca de Músicas

**User Story:** Como um usuário, quero filtrar e buscar músicas por título, artista, público-alvo, tema e gênero, para que eu possa encontrar rapidamente músicas adequadas para um culto.

#### Acceptance Criteria

1. THE SongFilters SHALL disponibilizar campos de busca por texto livre (título e artista) e Selects para público-alvo, tema e gênero.
2. WHEN um filtro é aplicado, THE Sistema SHALL atualizar a listagem de Músicas exibida sem recarregar a página completa.
3. WHEN os parâmetros de filtro são alterados, THE Sistema SHALL refletir os filtros ativos na query string da URL para permitir compartilhamento do estado de busca.
4. THE Server Function `getSongs` SHALL aceitar parâmetros opcionais de filtro (texto, público-alvo, tema, gênero) e retornar apenas as Músicas que correspondem a todos os filtros fornecidos.
5. WHILE nenhum filtro está ativo, THE Sistema SHALL exibir todas as Músicas disponíveis.

---

### Requirement 3: Detalhes de uma Música

**User Story:** Como um usuário, quero visualizar todos os detalhes de uma música, incluindo links externos e metadados, para que eu possa acessar cifras, letras e vídeos diretamente.

#### Acceptance Criteria

1. WHEN um Usuário clica em um SongCard na listagem, THE Sistema SHALL abrir o SongDetailModal exibindo todos os campos da Música: título, artista, público-alvo, tema, gênero, tom, BPM, observações e todos os links externos disponíveis.
2. THE Sistema SHALL disponibilizar a rota pública `/song/$songId` que exibe os detalhes completos da Música com meta tags `og:title`, `og:description` e `og:url` para preview em redes sociais.
3. WHEN a rota `/song/$songId` é acessada com um `songId` inexistente, THE Sistema SHALL retornar uma página de erro 404 com mensagem descritiva.
4. THE SongDetailModal SHALL exibir ícones com as cores oficiais das plataformas para os links de YouTube, Spotify e Cifra Club; WHEN nenhum link de plataforma está preenchido, THE SongDetailModal SHALL exibir os ícones de placeholder correspondentes.
5. WHEN o SongDetailModal está aberto e o campo `other_links` contém entradas, THE SongDetailModal SHALL exibir os links adicionais com o nome e ícone configurados em cada entrada.

---

### Requirement 4: Autenticação de Usuários

**User Story:** Como um músico, quero me autenticar com e-mail/senha ou conta Google, para que eu possa cadastrar e gerenciar músicas no repertório.

#### Acceptance Criteria

1. THE Sistema SHALL disponibilizar as rotas `/login` e `/register` para autenticação e cadastro de novos Usuários.
2. WHEN um Usuário se cadastra com e-mail e senha, THE Sistema SHALL enviar um e-mail de confirmação antes de ativar a conta.
3. WHEN um Usuário tenta se autenticar com uma senha que consta na base de dados HIBP, THE Sistema SHALL rejeitar a senha e exibir uma mensagem informando que a senha foi comprometida em vazamentos conhecidos.
4. THE Sistema SHALL disponibilizar autenticação via Google OAuth na tela de login e cadastro.
5. THE Sistema SHALL disponibilizar as rotas `/forgot-password` e `/reset-password` para recuperação de senha por e-mail.
6. WHEN um Usuário autenticado acessa qualquer rota sob o prefixo `/_authenticated`, THE Sistema SHALL permitir o acesso normalmente.
7. WHEN um Usuário não autenticado tenta acessar qualquer rota sob o prefixo `/_authenticated`, THE Sistema SHALL redirecionar para `/login`.
8. WHEN um Usuário se autentica com sucesso, THE Sistema SHALL manter a sessão no `localStorage` via Supabase Auth e atualizar o estado global da aplicação via `onAuthStateChange`.

---

### Requirement 5: Cadastro de Músicas

**User Story:** Como um músico autenticado, quero cadastrar novas músicas no repertório com todos os metadados relevantes, para que outros músicos possam encontrá-las e utilizá-las.

#### Acceptance Criteria

1. THE Sistema SHALL disponibilizar a rota `/_authenticated/songs/new` com o SongForm para cadastro de novas Músicas.
2. THE SongForm SHALL conter campos para: título (obrigatório), artista (obrigatório), URL do YouTube, URL do Spotify, URL do Cifra Club, URL de cifra genérica, URL da letra, links adicionais (`other_links`), público-alvo, tema, gênero, tom, BPM e observações.
3. WHEN o SongForm é submetido com campos obrigatórios ausentes ou inválidos, THE Sistema SHALL exibir mensagens de erro inline em cada campo inválido sem submeter o formulário.
4. WHEN o SongForm é submetido com dados válidos, THE Sistema SHALL chamar a Server Function `createSong`, exibir uma notificação de sucesso (Snackbar) e redirecionar para a página inicial.
5. THE Server Function `createSong` SHALL associar a Música ao `auth.uid()` do Músico autenticado no campo `created_by`.
6. IF a Server Function `createSong` retornar um erro, THEN THE Sistema SHALL exibir uma notificação de erro (Snackbar) com a mensagem descritiva do erro e manter o formulário preenchido.
7. THE SongForm SHALL validar os dados utilizando esquemas Zod antes de chamar a Server Function.

---

### Requirement 6: Edição e Exclusão de Músicas

**User Story:** Como um músico autenticado, quero editar e excluir músicas que eu cadastrei, para que eu possa manter o repertório atualizado e correto.

#### Acceptance Criteria

1. THE Sistema SHALL disponibilizar a rota `/_authenticated/songs/edit/$songId` com o SongForm pré-preenchido para edição de uma Música existente.
2. WHEN um Músico acessa a rota de edição de uma Música cujo `created_by` corresponde ao seu `auth.uid()`, THE Sistema SHALL permitir o acesso e exibir o SongForm pré-preenchido normalmente.
3. WHEN um Músico acessa a rota de edição de uma Música cujo `created_by` é diferente do seu `auth.uid()` e o Músico não possui papel `admin`, THE Sistema SHALL retornar uma resposta de erro 403 e exibir uma mensagem de acesso negado.
3. WHEN o SongForm de edição é submetido com dados válidos, THE Sistema SHALL chamar a Server Function `updateSong`, exibir uma notificação de sucesso e redirecionar para a página de detalhes da Música.
4. WHEN um Músico solicita a exclusão de uma Música que ele criou, THE Sistema SHALL exibir um diálogo de confirmação antes de executar a exclusão.
5. WHEN a exclusão é confirmada, THE Sistema SHALL chamar a Server Function `deleteSong`, exibir uma notificação de sucesso e redirecionar para a página inicial.
6. THE SongDetailModal SHALL exibir os botões de editar e excluir apenas para o Músico que criou a Música ou para o Admin.
7. THE Admin SHALL ter permissão para editar e excluir qualquer Música independentemente do `created_by`.

---

### Requirement 7: Favoritar Músicas

**User Story:** Como um músico autenticado, quero favoritar músicas do repertório, para que eu possa acessar rapidamente as músicas que uso com mais frequência.

#### Acceptance Criteria

1. THE Sistema SHALL exibir um botão de favorito (ícone de coração) em cada SongCard e no SongDetailModal.
2. WHEN um Músico autenticado clica no botão de favorito de uma Música não favoritada, THE Sistema SHALL chamar a Server Function `toggleFavorite` e marcar a Música como favoritada com atualização otimista da interface.
3. WHEN um Músico autenticado clica no botão de favorito de uma Música já favoritada, THE Sistema SHALL chamar a Server Function `toggleFavorite` e remover o favorito com atualização otimista da interface.
4. WHEN um Usuário não autenticado clica no botão de favorito, THE Sistema SHALL redirecionar para `/login`.
5. WHEN um Músico autenticado clica no botão de favorito, THE Sistema SHALL processar a ação de favoritar sem redirecionar.
5. THE Sistema SHALL disponibilizar a rota `/_authenticated/favorites` exibindo todas as Músicas favoritadas pelo Músico autenticado em um SongGrid.
6. IF a Server Function `toggleFavorite` retornar um erro, THEN THE Sistema SHALL reverter imediatamente a atualização otimista e exibir uma notificação de erro.
7. THE banco de dados SHALL garantir unicidade do par `(user_id, song_id)` na tabela `favorites`, impedindo duplicatas.

---

### Requirement 8: Compartilhamento de Músicas

**User Story:** Como um músico, quero compartilhar o link de uma música específica, para que outros possam acessar os detalhes diretamente sem precisar buscar no repertório.

#### Acceptance Criteria

1. THE SongDetailModal e a rota `/song/$songId` SHALL exibir um botão "Compartilhar".
2. WHEN um Usuário clica no botão "Compartilhar", THE Sistema SHALL copiar a URL `/song/$songId` para a área de transferência do navegador e exibir uma notificação de confirmação (Snackbar).
3. THE rota `/song/$songId` SHALL incluir meta tags `og:title` com o título da Música, `og:description` com artista e tema, e `og:url` com a URL canônica da página.
4. THE Sistema SHALL utilizar o `id` UUID da Música como identificador na URL compartilhável.

---

### Requirement 9: Segurança e Controle de Acesso (RLS)

**User Story:** Como administrador do sistema, quero que as políticas de segurança do banco de dados garantam que cada usuário acesse apenas os dados que lhe são permitidos, para que o repertório seja protegido contra acessos não autorizados.

#### Acceptance Criteria

1. THE banco de dados SHALL aplicar RLS na tabela `songs` permitindo SELECT para qualquer Usuário (autenticado ou não) e INSERT, UPDATE, DELETE apenas para o Músico cujo `auth.uid()` corresponde ao `created_by` do registro ou para o Admin.
2. THE banco de dados SHALL aplicar RLS na tabela `favorites` permitindo SELECT, INSERT e DELETE apenas para o Usuário cujo `auth.uid()` corresponde ao `user_id` do registro.
3. THE banco de dados SHALL aplicar RLS na tabela `user_roles` permitindo SELECT apenas para o próprio Usuário visualizar seu papel e gerenciamento completo apenas para o Admin.
4. THE Sistema SHALL implementar a função `has_role()` com `SECURITY DEFINER` para verificação de papéis, evitando recursão nas políticas RLS.
5. THE Server Functions que requerem autenticação SHALL utilizar o middleware `requireSupabaseAuth` e retornar erro 401 quando chamadas sem sessão válida.
6. THE Sistema SHALL garantir que a service role key do Supabase seja utilizada exclusivamente em Server Functions, nunca exposta ao cliente (browser).

---

### Requirement 10: Interface Visual e Tema

**User Story:** Como um usuário, quero uma interface visualmente agradável com suporte a tema claro e escuro, para que eu possa usar o aplicativo confortavelmente em diferentes condições de iluminação.

#### Acceptance Criteria

1. THE Sistema SHALL disponibilizar um ThemeToggle que alterna entre tema claro e escuro, persistindo a preferência do Usuário.
2. THE tema claro SHALL utilizar as cores: Primary `#1e3a5f` (indigo profundo), Secondary `#c9a84c` (dourado), Background `#fafbfc`, Accent `#e85d3a` (coral suave).
3. THE tema escuro SHALL utilizar as cores: Primary `#1e3a5f`, Secondary `#c9a84c`, Background `#0d1b2a`, Accent `#e85d3a`.
4. THE SongCard SHALL ter elevação 2 no estado padrão e elevação 4 ao receber hover, com `borderRadius` de 12px.
5. THE AppLayout SHALL exibir um Drawer lateral em telas menores que 600px (navegação por hamburger menu) e navegação inline em telas maiores que 900px.
6. THE Sistema SHALL utilizar a tipografia Roboto (padrão MUI) com peso 500–700 para headings e 400 para body text.
7. WHEN uma operação assíncrona é concluída com sucesso ou falha, THE Sistema SHALL exibir um Snackbar com a mensagem correspondente.

---

### Requirement 11: Papéis de Usuário e Administração

**User Story:** Como administrador, quero gerenciar os papéis dos usuários do sistema, para que eu possa controlar quem tem permissão de cadastrar e editar músicas.

#### Acceptance Criteria

1. THE banco de dados SHALL manter a tabela `user_roles` com os papéis `admin`, `musico` e `viewer` associados a cada Usuário.
2. THE Sistema SHALL armazenar papéis exclusivamente na tabela `user_roles`, nunca em campos da tabela de perfis de usuário, para evitar escalada de privilégios.
3. THE Admin SHALL ter permissão para atribuir e revogar papéis de qualquer Usuário via operações na tabela `user_roles`.
4. WHEN um Usuário sem papel `musico` ou `admin` tenta acessar rotas de cadastro ou edição de Músicas, THE Sistema SHALL retornar erro 403 e exibir mensagem de acesso negado.
