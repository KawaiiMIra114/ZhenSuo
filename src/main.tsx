import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const SESSION_MARK = 'zhensuo_session_loaded';
const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
const isReload = navEntry?.type === 'reload';
if (isReload && sessionStorage.getItem(SESSION_MARK)) {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('zhensuo_save_')) {
      localStorage.removeItem(key);
    }
  });
}
sessionStorage.setItem(SESSION_MARK, '1');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
