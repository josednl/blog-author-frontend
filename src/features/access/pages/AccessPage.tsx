import { useState, useMemo, useEffect } from 'react';
import { ResourceManager, ResourceColumn } from '@/shared/components/resource/ResourceManager';
import { Field } from '@/shared/components/resource/ResourceFormModal';
import { Role, Permission } from '@/features/access/types/accessTypes';
import { rolesAPI } from '@/features/access/services/rolesAPI';
import { permissionsAPI } from '@/features/access/services/permissionAPI';
import { showErrorToast } from '@/shared/components/showErrorToast';

const roleColumns: ResourceColumn<Role>[] = [
  {
    key: 'name',
    header: 'Role name',
    render: (role) => <strong className="font-semibold text-indigo-600 dark:text-indigo-400">{role.name}</strong>,
  },
  {
    key: 'description',
    header: 'Description',
    className: 'hidden md:table-cell',
    render: (role) => <span className="text-gray-500 dark:text-gray-400 italic">{role.description || 'No description'}</span>,
  },
  {
    key: 'permissions',
    header: 'Permit No.',
    className: 'w-28 text-center',
    render: (role) => (
      <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
        {role.permissions ? role.permissions.length : '0'}
      </span>
    ),
  },
  { key: 'actions', header: 'Actions', className: 'w-24 text-center' },
];

const permissionColumns: ResourceColumn<Permission>[] = [
  {
    key: 'name',
    header: 'Permission key',
    render: (perm) => <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded text-sm text-yellow-600 dark:text-yellow-400">{perm.name}</code>,
  },
  {
    key: 'description',
    header: 'Description',
    render: (perm) => <span className="text-gray-600 dark:text-gray-300">{perm.description || 'No description'}</span>,
  },
  {
    key: 'roles',
    header: 'Roles',
    render: (perm) =>
      perm.roles?.length ? (
        <ul className="text-xs text-gray-500 dark:text-gray-300 space-y-1">
          {perm.roles.map((r) => (
            <li key={r.id}>• {r.name}</li>
          ))}
        </ul>
      ) : (
        <span className="text-gray-400 italic">No roles</span>
      ),
  },
  { key: 'actions', header: 'Actions', className: 'w-24 text-center' },
];


export const AccessPage = () => {
  const [localRoles, setLocalRoles] = useState<Role[]>([]);
  const [localPermissions, setLocalPermissions] = useState<Permission[]>([]);

  const [isRoleSaving, setIsRoleSaving] = useState(false);
  const [isPermissionSaving, setIsPermissionSaving] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [permissionsData, rolesData] = await Promise.all([
          permissionsAPI.getAll(),
          rolesAPI.getAll()
        ]);

        if (isMounted) {
          setLocalPermissions(permissionsData);
          setLocalRoles(rolesData);
        }
      } catch (error) {
        // console.error("Error loading initial data in AccessPage:", error);
        showErrorToast(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const roleFormFields: Field[] = useMemo(() => ([
    {
      name: 'name',
      label: 'Role name',
      type: 'text',
      placeholder: 'Ej: editor, user',
      rules: { required: true, minLength: { value: 2, message: 'Minimum 2 characters.' } }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Brief description of responsibilities.',
      rules: { maxLength: { value: 150, message: 'Maximun 150 characters.' } }
    },
    {
      name: 'permissions',
      label: 'Assigned permissions',
      type: 'checkbox-group',
      options: localPermissions.map((perm) => ({
        label: perm.name,
        value: perm.id,
      })),
    },
  ]), [localPermissions]);

  const permissionFormFields: Field[] = useMemo(() => ([
    {
      name: 'name',
      label: 'Permission key',
      type: 'text',
      placeholder: 'Ej: READ_USER, CREATE_POST, etc',
      rules: { required: true, pattern: { value: /^[A-Z0-9_:]+$/, message: 'Only uppercase letters, numbers, underscores, and colons.' } }
    },
    {
      name: 'description',
      label: 'Description (Optional)',
      type: 'textarea',
      placeholder: 'What this permit authorizes..',
      rules: { maxLength: { value: 150, message: 'Maximum 150 characters.' } }
    },
    {
      name: 'roles',
      label: 'Assigned roles',
      type: 'checkbox-group',
      options: localRoles.map((role) => ({
        label: role.name,
        value: role.id,
      })),
    },
  ]), [localRoles]);

  const handleCreateRole = async (data: any) => {
    setIsRoleSaving(true);
    try {
      const newRole = await rolesAPI.create(data);
      setLocalRoles([...localRoles, newRole]);
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsRoleSaving(false);
    }
  };

  const handleEditRole = async (id: Role['id'], data: Partial<Role>) => {
    setIsRoleSaving(true);
    try {
      console.log(data);
      const updated = await rolesAPI.update(id, data);
      setLocalRoles(localRoles.map((r) => (r.id === id ? updated : r)));
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsRoleSaving(false);
    }
  };

  const handleDeleteRole = async (id: Role['id']) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await rolesAPI.delete(id);
      setLocalRoles(localRoles.filter((r) => r.id !== id));
    } catch (error: any) {
      showErrorToast(error);
    }
  };

  const handleCreatePermission = async (data: any) => {
    setIsPermissionSaving(true);
    try {
      const newPerm = await permissionsAPI.create(data);
      setLocalPermissions([...localPermissions, newPerm]);
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsPermissionSaving(false);
    }
  };

  const handleEditPermission = async (id: Permission['id'], data: Partial<Permission>) => {
    setIsPermissionSaving(true);
    try {
      const updated = await permissionsAPI.update(id, data);
      setLocalPermissions(localPermissions.map((p) => (p.id === id ? updated : p)));
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsPermissionSaving(false);
    }
  };

  const handleDeletePermission = async (id: Permission['id']) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) return;
    try {
      await permissionsAPI.delete(id);
      setLocalPermissions(localPermissions.filter((p) => p.id !== id));
    } catch (error: any) {
      showErrorToast(error);
    }
  };

  return (
    <div className="space-y-12">

      <section>
        <ResourceManager<Role>
          title="System roles"
          resources={localRoles}
          columns={roleColumns}
          formFields={roleFormFields}
          isSaving={isRoleSaving}
          isLoading={isLoading}
          onCreate={handleCreateRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-12"></div>

      <section>
        <ResourceManager<Permission>
          title="Available permissions"
          resources={localPermissions}
          columns={permissionColumns}
          formFields={permissionFormFields}
          isSaving={isPermissionSaving}
          isLoading={isLoading}
          onCreate={handleCreatePermission}
          onEdit={handleEditPermission}
          onDelete={handleDeletePermission}
        />
      </section>
    </div>
  );
};
