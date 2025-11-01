import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/provider/AuthProvider';
import { User as UserIcon, Mail, Image as ImageIcon, Trash2, Save, RefreshCw } from 'lucide-react';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import { usersAPI } from '@/features/user/services/usersAPI';
import { User } from '@/features/user/types/userTypes';
import { ReloadButton } from '@/shared/components/ReloadButton';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await usersAPI.getById(user.id);
      setProfile(data);
    } catch (error: any) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleChange = (field: keyof User, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setIsSaving(true);
      const updated = await usersAPI.update(profile.id, {
        name: profile.name,
        username: profile.username,
        email: profile.email,
        bio: profile.bio,
      });
      setProfile(updated);
      showSuccessToast('Profile updated successfully.');
    } catch (error: any) {
      showErrorToast(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      await usersAPI.delete(profile.id);
      showSuccessToast('Your account has been deleted.');
    } catch (error: any) {
      showErrorToast(error);
    }
  };

  if (!user || !profile) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {isLoading ? 'Loading user data...' : 'User data not found.'}
      </div>
    );
  }

  const profileImageUrl =
    profile.profilePicId || 'https://via.placeholder.com/150?text=No+Photo';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Profile Settings
        </h1>
        <ReloadButton onClick={fetchData} isLoading={isLoading} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-accent dark:border-indigo-400 shadow-lg">
            <img
              src={profileImageUrl}
              alt={`${profile.name}'s profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" /> Upload New Photo
          </button>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            JPG or PNG. Max 5MB.
          </p>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={profile.name || ''}
                disabled={isSaving || isLoading}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                value={profile.username || ''}
                disabled={isSaving || isLoading}
                onChange={(e) => handleChange('username', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={profile.email || ''}
              disabled={isSaving || isLoading}
              onChange={(e) => handleChange('email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={profile.bio || ''}
              disabled={isSaving || isLoading}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm p-2"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
