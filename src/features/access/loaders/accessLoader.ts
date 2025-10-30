import { rolesAPI } from '@/features/access/services/rolesAPI';
import { permissionsAPI } from '@/features/access/services/permissionAPI';

export async function accessLoader() {
  const [roles, permissions] = await Promise.all([
    rolesAPI.getAll(),
    permissionsAPI.getAll(),
  ]);

  return { roles, permissions };
}
