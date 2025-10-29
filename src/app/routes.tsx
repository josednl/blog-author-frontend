import { createBrowserRouter } from 'react-router-dom';
import App from '@/app/App';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { Dashboard } from '@/features/dashboard/DashboardLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        // loader: authLoader,
        // errorElement: ,
      },
      {
        path: '/register',
        element: <RegisterForm />,
      },
      {
        path: '/login',
        element: <LoginForm />,
      },
    ]
  }
]);

export default router;
