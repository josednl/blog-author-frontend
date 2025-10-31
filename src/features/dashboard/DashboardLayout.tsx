import { useAuth } from '@/features/auth/provider/AuthProvider';
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard';
import { EditorDashboard } from '@/features/dashboard/components/EditorDashboard';
import { UnauthorizedPage } from '@/shared/components/UnauthorizedPage';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Unauthorized</p>;

  switch (user.roleName) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'editor':
      return <EditorDashboard />;
    default:
      return <UnauthorizedPage />;
  }
};
