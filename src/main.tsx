import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './app/routes';
import { AuthProvider } from './features/auth/provider/AuthProvider';
import { LoadingProvider } from '@/shared/components/LoadingProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <RouterProvider router={router} />
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>,
);
