// Script para testar conexão com Supabase
// Execute com: node test-supabase-connection.js

require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('\n🔍 Testando configuração do Supabase...\n');

// Verificar variáveis de ambiente
console.log('1. Verificando variáveis de ambiente:');
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada'}`);
console.log(`   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${SUPABASE_KEY ? '✅ Configurada' : '❌ Não configurada'}`);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('\n❌ Erro: Variáveis de ambiente não configuradas!');
  console.log('   Copie .env.example para .env e configure suas credenciais.\n');
  process.exit(1);
}

// Testar conexão
console.log('\n2. Testando conexão com Supabase...');

fetch(`${SUPABASE_URL}/rest/v1/`, {
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  }
})
  .then(response => {
    if (response.ok) {
      console.log('   ✅ Conexão estabelecida com sucesso!');
      return testTables();
    } else {
      console.log(`   ❌ Erro na conexão: ${response.status} ${response.statusText}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.log(`   ❌ Erro ao conectar: ${error.message}`);
    process.exit(1);
  });

// Testar se as tabelas existem
async function testTables() {
  console.log('\n3. Verificando tabelas no banco de dados...');
  
  // Testar tabela songs
  try {
    const songsResponse = await fetch(`${SUPABASE_URL}/rest/v1/songs?limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (songsResponse.ok) {
      console.log('   ✅ Tabela "songs" existe');
    } else if (songsResponse.status === 404) {
      console.log('   ❌ Tabela "songs" não encontrada');
      console.log('      Execute o arquivo supabase-schema.sql no Supabase Dashboard');
    } else {
      console.log(`   ⚠️  Erro ao verificar tabela "songs": ${songsResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro ao verificar tabela "songs": ${error.message}`);
  }
  
  // Testar tabela favorites
  try {
    const favoritesResponse = await fetch(`${SUPABASE_URL}/rest/v1/favorites?limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (favoritesResponse.ok) {
      console.log('   ✅ Tabela "favorites" existe');
    } else if (favoritesResponse.status === 404) {
      console.log('   ❌ Tabela "favorites" não encontrada');
      console.log('      Execute o arquivo supabase-schema.sql no Supabase Dashboard');
    } else {
      console.log(`   ⚠️  Erro ao verificar tabela "favorites": ${favoritesResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Erro ao verificar tabela "favorites": ${error.message}`);
  }
  
  console.log('\n✅ Teste concluído!\n');
  console.log('📝 Próximos passos:');
  console.log('   1. Se as tabelas não existem, execute supabase-schema.sql no Supabase');
  console.log('   2. Reinicie o servidor: yarn dev');
  console.log('   3. Tente criar uma conta em http://localhost:3000/register\n');
}
