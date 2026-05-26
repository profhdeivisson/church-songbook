# 🔒 Guia de Segurança

Este documento descreve as práticas de segurança implementadas no Church Songbook.

## 🛡️ Visão Geral

O projeto implementa múltiplas camadas de segurança:

1. **Autenticação** via Supabase Auth
2. **Row Level Security (RLS)** no banco de dados
3. **Middleware** para proteção de rotas
4. **Server Actions** para operações seguras
5. **Validação** de inputs
6. **Proteção de credenciais**

---

## 🔐 Autenticação

### Supabase Auth

O projeto usa Supabase Auth para gerenciar usuários:

- ✅ Email/senha com hash bcrypt
- ✅ Tokens JWT seguros
- ✅ Refresh tokens automáticos
- ✅ Sessões persistentes
- 🔜 Google OAuth (futuro)

### Fluxo de Autenticação

```
1. Usuário faz login → Supabase valida credenciais
2. Supabase retorna JWT token
3. Token armazenado em cookie httpOnly
4. Middleware valida token em cada request
5. Token renovado automaticamente antes de expirar
```

### Proteção de Rotas

O middleware protege rotas automaticamente:

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { user } = await supabase.auth.getUser();
  
  if (!user && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect('/login');
  }
  
  return NextResponse.next();
}
```

**Rotas Públicas:**
- `/login`
- `/register`
- `/` (listagem de músicas)

**Rotas Protegidas:**
- `/songs/new`
- `/favorites`
- Qualquer operação de edição/deleção

---

## 🗄️ Row Level Security (RLS)

### O que é RLS?

Row Level Security é uma camada de segurança no PostgreSQL que controla quais linhas um usuário pode acessar.

### Políticas Implementadas

#### Tabela `songs`

```sql
-- Qualquer pessoa pode VER músicas
CREATE POLICY "Songs are viewable by everyone" 
    ON songs FOR SELECT 
    USING (true);

-- Apenas autenticados podem CRIAR
CREATE POLICY "Authenticated users can insert songs" 
    ON songs FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

-- Apenas donos podem EDITAR
CREATE POLICY "Users can update their own songs" 
    ON songs FOR UPDATE 
    USING (auth.uid() = created_by);

-- Apenas donos podem DELETAR
CREATE POLICY "Users can delete their own songs" 
    ON songs FOR DELETE 
    USING (auth.uid() = created_by);
```

#### Tabela `favorites`

```sql
-- Usuários veem apenas SEUS favoritos
CREATE POLICY "Users can view their own favorites" 
    ON favorites FOR SELECT 
    USING (auth.uid() = user_id);

-- Usuários adicionam apenas SEUS favoritos
CREATE POLICY "Users can insert their own favorites" 
    ON favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Usuários removem apenas SEUS favoritos
CREATE POLICY "Users can delete their own favorites" 
    ON favorites FOR DELETE 
    USING (auth.uid() = user_id);
```

### Por que RLS é Importante?

Mesmo que alguém consiga acessar o banco diretamente, o RLS garante que:

- ❌ Usuário A não pode editar músicas do Usuário B
- ❌ Usuário A não pode ver favoritos do Usuário B
- ❌ Usuário não autenticado não pode criar músicas
- ✅ Apenas o dono pode modificar seus dados

---

## 🔑 Gerenciamento de Credenciais

### Variáveis de Ambiente

```env
# ✅ SEGURO - Pode ser exposto ao cliente
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...

# ⚠️ PRIVADO - Nunca exponha ao cliente
NEXT_PUBLIC_DATABASE_PASSWORD=sua-senha-aqui
```

### Boas Práticas

✅ **FAÇA:**
- Use `.env` para credenciais locais
- Adicione `.env` ao `.gitignore`
- Use variáveis de ambiente no Vercel/produção
- Rotacione senhas periodicamente
- Use senhas fortes (mínimo 16 caracteres)

❌ **NÃO FAÇA:**
- Commitar arquivo `.env` com credenciais reais
- Compartilhar credenciais em chat/email
- Usar mesma senha em múltiplos ambientes
- Hardcodar credenciais no código
- Expor service role key ao cliente

### Verificar Segurança

```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep .env

# Verificar se .env não está commitado
git status

# Verificar histórico do git
git log --all --full-history -- .env
```

---

## 🛡️ Server Actions

### Por que Server Actions?

Server Actions executam no servidor, não no cliente:

- ✅ Credenciais nunca expostas ao navegador
- ✅ Validação no servidor (não pode ser burlada)
- ✅ Acesso direto ao banco de dados
- ✅ Logs de auditoria centralizados

### Exemplo Seguro

```typescript
// ✅ SEGURO - Server Action
'use server';

export async function createSong(data: Partial<Song>) {
  const supabase = await createClient(); // Server client
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Não autenticado');
  }
  
  // Validação no servidor
  if (!data.title || !data.artist) {
    throw new Error('Campos obrigatórios faltando');
  }
  
  // Sanitização
  const sanitized = {
    title: data.title.trim(),
    artist: data.artist.trim(),
    created_by: user.id, // Sempre do token, nunca do cliente
  };
  
  return await supabase.from('songs').insert(sanitized);
}
```

```typescript
// ❌ INSEGURO - Cliente direto
'use client';

export function createSong(data: Partial<Song>) {
  const supabase = createClient(); // Client exposto
  
  // ⚠️ Cliente pode manipular created_by
  return supabase.from('songs').insert({
    ...data,
    created_by: 'qualquer-id', // VULNERÁVEL!
  });
}
```

---

## 🧹 Validação e Sanitização

### Validação de Inputs

```typescript
// Validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Email inválido');
}

// Validação de URL
try {
  new URL(url);
} catch {
  throw new Error('URL inválida');
}

// Validação de senha
if (password.length < 6) {
  throw new Error('Senha deve ter no mínimo 6 caracteres');
}
```

### Sanitização

```typescript
// Remover espaços
const title = data.title.trim();

// Limitar tamanho
const observations = data.observations?.slice(0, 1000);

// Escapar HTML (se necessário)
const escaped = text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
```

### Proteção contra XSS

```typescript
// ❌ VULNERÁVEL
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ SEGURO
<div>{userInput}</div> // React escapa automaticamente
```

---

## 🚨 Tratamento de Erros

### Não Exponha Detalhes Internos

```typescript
// ❌ INSEGURO
catch (error) {
  throw new Error(error.message); // Pode expor detalhes do banco
}

// ✅ SEGURO
catch (error) {
  console.error('Database error:', error); // Log interno
  throw new Error('Erro ao criar música'); // Mensagem genérica
}
```

### Logs de Auditoria

```typescript
// Registrar ações importantes
console.log(`[AUDIT] User ${user.id} created song ${song.id}`);
console.log(`[AUDIT] User ${user.id} deleted song ${song.id}`);
```

---

## 🔍 Monitoramento

### Supabase Dashboard

Monitore atividades suspeitas:

1. **Auth Logs:** Tentativas de login falhadas
2. **API Logs:** Requests anormais
3. **Database Logs:** Queries suspeitas

### Alertas

Configure alertas para:

- ⚠️ Múltiplas tentativas de login falhadas
- ⚠️ Criação massiva de registros
- ⚠️ Queries lentas ou pesadas
- ⚠️ Erros 500 frequentes

---

## 📋 Checklist de Segurança

### Desenvolvimento

- [x] `.env` no `.gitignore`
- [x] RLS ativo em todas as tabelas
- [x] Server Actions para operações sensíveis
- [x] Validação de inputs no servidor
- [x] Middleware protegendo rotas
- [ ] Validação com Zod (futuro)
- [ ] Rate limiting (futuro)

### Produção

- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS ativo (SSL)
- [ ] Senhas fortes
- [ ] Backup do banco de dados
- [ ] Monitoramento ativo
- [ ] Logs de auditoria
- [ ] Política de privacidade
- [ ] Termos de uso

### Manutenção

- [ ] Atualizar dependências regularmente
- [ ] Revisar logs semanalmente
- [ ] Rotacionar senhas trimestralmente
- [ ] Auditar permissões mensalmente
- [ ] Testar backups mensalmente

---

## 🆘 Incidentes de Segurança

### Se Credenciais Vazarem

1. **Imediatamente:**
   - Rotacione todas as senhas
   - Revogue tokens ativos
   - Verifique logs de acesso

2. **Investigação:**
   - Identifique o escopo do vazamento
   - Verifique se houve acesso não autorizado
   - Documente o incidente

3. **Prevenção:**
   - Atualize `.gitignore`
   - Revise processo de deploy
   - Treine equipe

### Contato

Para reportar vulnerabilidades:
- Email: security@seu-dominio.com
- Não divulgue publicamente antes de correção

---

## 📚 Recursos

- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Última atualização:** $(date)
**Responsável:** Equipe de Desenvolvimento
