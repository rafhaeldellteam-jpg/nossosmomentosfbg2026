import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './components/Admin';
import { content } from './config/content';

// Se houver uma senha de admin configurada, o painel só abre com o parâmetro ?secret=...
const hasAdminSecret = content.adminSecret && content.adminSecret.trim().length > 0;
const isAdmin = () =>
  window.location.hash.startsWith('#/admin') &&
  (!hasAdminSecret || window.location.hash.includes('secret=' + content.adminSecret.trim()));

function Root() {
  const [admin, setAdmin] = useState(isAdmin);

  useEffect(() => {
    const onHash = () => setAdmin(isAdmin());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return admin ? <Admin /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
