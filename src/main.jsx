// Enable Ant Design v5 compatibility with React 19 (explicit ESM entry to satisfy Vite)
import '@ant-design/v5-patch-for-react-19/es';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouters from './router/AppRouters';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouters />
    </QueryClientProvider>
  </StrictMode>,
);
