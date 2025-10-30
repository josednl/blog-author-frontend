import { useState, ReactNode } from 'react';
import { ResourceFormModal, Field } from './ResourceFormModal';

type Resource = {
  id: string;
  [key: string]: any;
};

export type ResourceColumn<T extends Resource> = {
  key: keyof T | 'actions';
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
};

type Props<T extends Resource> = {
  title: string;
  resources: T[];
  columns: ResourceColumn<T>[];
  isLoading?: boolean;
  formFields: Field[] | ((isEdit: boolean) => Field[]);
  isSaving?: boolean;
  // ------------------------------
  onCreate?: (data: Partial<T>) => Promise<void>;
  onEdit?: (id: string, data: Partial<T>) => Promise<void>;
  onDelete?: (id: string) => void;
};

export function ResourceManager<T extends Resource>({
  title,
  resources = [],
  columns,
  isLoading = false,
  formFields,
  isSaving = false,
  onCreate,
  onEdit,
  onDelete,
}: Props<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {onCreate && formFields.length > 0 && (
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg font-medium 
                       hover:opacity-90 transition-colors shadow-md disabled:opacity-50"
            disabled={isLoading || isSaving}
          >
            <span>+ Add</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {isLoading && (
          <div className="p-6 text-center text-accent">
            <p>Loading {title.toLowerCase()}...</p>
          </div>
        )}

        {!isLoading && resources.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">There are no registered {title.toLowerCase()}.</p>
            {onCreate && <p className="mt-2">Click "+ Add" ro create a new one.</p>}
          </div>
        ) : (
          !isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {(columns || []).map((column) => (
                      <th
                        key={String(column.key)}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 
                                                   uppercase tracking-wider dark:text-gray-400 ${column.className || ''}`}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {resources.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out">
                      {(columns || []).map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${column.className || ''}`}
                        >
                          {column.key === 'actions' ? (
                            <div className="flex space-x-3">
                              {onEdit && (
                                <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit">Edit</button>
                              )}
                              {onDelete && (
                                <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">Delete</button>
                              )}
                            </div>
                          ) : (
                            column.render ? column.render(item) : String(item[column.key])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <ResourceFormModal
          item={
            editingItem
              ? { ...editingItem, password: '', confirmPassword: '' }
              : null
          }
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            if (editingItem && onEdit) await onEdit(editingItem.id, data as any);
            else if (onCreate) await onCreate(data as any);
            if (!isSaving) {
              setIsModalOpen(false);
            }
          }}
          fields={typeof formFields === 'function' ? formFields(!!editingItem) : formFields}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
