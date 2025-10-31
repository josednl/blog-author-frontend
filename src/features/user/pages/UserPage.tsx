import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { ResourceManager, ResourceColumn } from '@/shared/components/resource/ResourceManager';
import { Field } from '@/shared/components/resource/ResourceFormModal';
import { usersAPI } from '@/features/user/services/usersAPI';
import { rolesAPI } from '@/features/access/services/rolesAPI';
import { Role } from '@/features/access/types/accessTypes';
import { User } from '@/features/user/types/userTypes';
import { showErrorToast } from '@/shared/components/showErrorToast';

const createUserColumns = (availableRoles: Role[]): ResourceColumn<User>[] => [
  {
    key: 'name',
    header: 'Full name',
    render: (user) => <strong className="font-semibold">{user.name}</strong>,
  },
  {
    key: 'email',
    header: 'Email',
    render: (user) => <span className="text-gray-500 dark:text-gray-400">{user.email}</span>,
  },
  {

    key: 'roleId',
    header: 'Role',
    className: 'w-32 text-center',
    render: (user) => {
      const role = availableRoles.find(r => r.id === user.roleId);
      const roleName = role ? role.name : 'Sin Rol';

      return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full 
          ${roleName === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
          }`}
        >
          {roleName.toUpperCase()}
        </span>
      );
    },
  },
  { key: 'actions', header: 'Actions', className: 'w-24 text-center' },
];

export const UsersPage = () => {
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [usersData, rolesData] = await Promise.all([
          usersAPI.getAll(),
          rolesAPI.getAll(),
        ]);

        if (isMounted) {
          setLocalUsers(usersData);
          setAvailableRoles(rolesData);
        }
      } catch (error: any) {
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

  const columns = useMemo(() => createUserColumns(availableRoles), [availableRoles]);

  const getUserFormFields = (isEdit: boolean): Field[] => ([
    {
      name: 'name',
      label: 'Full name',
      type: 'text',
      placeholder: 'First and Last Name',
      rules: { required: true, minLength: { value: 2, message: 'Minimum 2 characters.' } }
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      rules: { required: true, minLength: { value: 2, message: 'Minimum 2 characters.' } }
    },
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      placeholder: 'example@domain.com',
      rules: {
        required: true,
        pattern: { value: /^\S+@\S+\.\S+$/, message: 'It must be a valid email address.' }
      }
    },
    {
      name: 'roleId',
      label: 'Assigned role',
      type: 'select',
      placeholder: 'Select a role',
      options: availableRoles.map(r => ({ label: r.name, value: r.id })),
      rules: { required: true }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: isEdit ? 'Leave blank to keep unchanged' : 'Minimun 8 characters',
      rules: isEdit ? {} : {
        required: { value: true, message: 'A password is required' },
        minLength: { value: 6, message: 'Minimun 8 caracteres.' }
      }
    },
    {
      name: 'confirmPassword',
      label: 'Confirm password',
      type: 'password',
      placeholder: 'Repeat the password',
      rules: isEdit ? {} : {
        required: { value: true, message: 'You must confirm your password.' },
        validate: (value: string, formValues: any) =>
          value === formValues.password || 'The passwords do not match.'
      }
    }
  ]);

  const handleCreateUser = async (data: any) => {
    setIsSaving(true);

    try {
      const createdUser = await usersAPI.create(data);

      const safeUser = { ...createdUser, password: undefined };

      setLocalUsers([...localUsers, safeUser]);
      toast.success('User created successfully!');
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUser = async (id: User['id'], data: Partial<User>) => {
    setIsSaving(true);
    const dataToSend = { ...data };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      const updated = await usersAPI.update(id, dataToSend);
      setLocalUsers(localUsers.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    } catch (error: any) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: User['id']) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      setLocalUsers(localUsers.filter((u) => u.id !== id));
    } catch (error: any) {
      showErrorToast(error);
    }
  };


  return (
    <div className="space-y-10">
      <ResourceManager<User>
        title="System users"
        resources={localUsers}
        columns={columns}
        formFields={getUserFormFields}
        isSaving={isSaving}
        isLoading={isLoading}
        // ----------------------------------------
        onCreate={handleCreateUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};
