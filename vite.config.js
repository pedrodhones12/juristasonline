import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawUrl = (env.VITE_SUPABASE_URL || '').trim();
  const rawKey = (env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

  // Aceita os Secrets mesmo se URL e chave tiverem sido trocados.
  const values = [rawUrl, rawKey].filter(Boolean);
  const detectedUrl = values.find(v => /^https?:\/\/[^\s]+\.supabase\.co\/?$/i.test(v));
  const detectedProjectRef = values.find(v => /^[a-z0-9]{15,}$/i.test(v) && !/^https?:\/\//i.test(v));
  const supabaseUrl = detectedUrl || (detectedProjectRef ? `https://${detectedProjectRef}.supabase.co` : '');
  const supabaseKey = values.find(v => v !== detectedUrl && v !== detectedProjectRef && !/^https?:\/\//i.test(v)) || (detectedProjectRef && detectedUrl ? detectedProjectRef : '');

  return {
    plugins: [react()],
    base: '/juristasonline/',
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabaseKey),
    },
  };
});
