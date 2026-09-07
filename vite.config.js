import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawUrl = (env.VITE_SUPABASE_URL || '').trim();
  const rawKey = (env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

  // Evita que valores trocados nos Secrets derrubem toda a aplicação.
  // Se o campo URL receber apenas o project-ref, normalizamos para a URL correta.
  const supabaseUrl = rawUrl.startsWith('http')
    ? rawUrl
    : rawUrl
      ? `https://${rawUrl.replace(/\/$/, '')}.supabase.co`
      : '';

  // Uma URL no campo da chave indica que os Secrets foram invertidos.
  // Nesse caso, deixamos a autenticação desativada em vez de quebrar o app.
  const supabaseKey = rawKey.startsWith('http') ? '' : rawKey;

  return {
    plugins: [react()],
    base: './',
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabaseKey),
    },
  };
});
