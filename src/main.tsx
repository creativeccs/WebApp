import { createRoot } from 'react-dom/client';

// Import polyfills first
import './lib/polyfills.ts';

// Import fonts
import '@fontsource-variable/inter'; // English & Russian
import '@fontsource-variable/vazirmatn'; // Persian
import '@fontsource/noto-sans-arabic'; // Arabic

import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
