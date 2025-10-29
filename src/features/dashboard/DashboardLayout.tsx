import { useAuth } from '@/features/auth/provider/AuthProvider';
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard';
import { EditorDashboard } from '@/features/dashboard/components/EditorDashboard';

export const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Unauthorized</p>;

  switch (user.roleName) {
    case 'admin':
      return <AdminDashboard />;
    case 'editor':
      return <EditorDashboard />;
    default:
      return <div>No role assigned</div>;
  }
};
