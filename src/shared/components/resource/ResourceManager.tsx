import { useState, ReactNode } from 'react';
import { ResourceFormModal, Field } from './ResourceFormModal';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

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
    <section className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-light">
          {title}
        </h1>

        {onCreate && (
          <button
            onClick={handleCreate}
            disabled={isLoading || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg shadow-md hover:brightness-110 transition disabled:opacity-50"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        )}
      </div>

      <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-accent">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            <p className="text-base">Loading {title.toLowerCase()}...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No {title.toLowerCase()} found.</p>
            {onCreate && (
              <p className="mt-2">
                Click <span className="text-accent font-semibold">“Add”</span> to create a new one.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 ${column.className || ''}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {resources.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 ease-in-out ${
                      index % 2 === 0
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-50 dark:bg-gray-800/60'
                    } hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                      >
                        {column.key === 'actions' ? (
                          <div className="flex items-center gap-3">
                            {onEdit && (
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-accent hover:text-accent/80 transition"
                                title="Edit"
                              >
                                <Pencil size={18} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(item.id)}
                                className="text-red-500 hover:text-red-400 transition"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ) : column.render ? (
                          column.render(item)
                        ) : (
                          String(item[column.key])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            if (!isSaving) setIsModalOpen(false);
          }}
          fields={typeof formFields === 'function' ? formFields(!!editingItem) : formFields}
          isSaving={isSaving}
          isEdit={!!editingItem}
        />
      )}
    </section>
  );
}
