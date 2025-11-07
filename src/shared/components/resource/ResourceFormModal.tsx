import { useEffect, useMemo } from 'react';
import { useForm, RegisterOptions, FieldError, FieldPath } from 'react-hook-form';
import { X } from 'lucide-react';

type FieldOption = string | { label: string; value: string };

export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'password' | 'checkbox-group';
  options?: FieldOption[];
  rules?: RegisterOptions;
  placeholder?: string;
};

type Props = {
  item?: Record<string, any> | null;
  isEdit?: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<void>;
  fields: Field[];
  isSaving?: boolean;
};

const preprocessItem = (item: Record<string, any> | null, fields: Field[]): Record<string, any> => {
  if (!item) return {};
  const processed: Record<string, any> = { ...item };

  fields.forEach((field) => {
    if (field.type === 'checkbox-group') {
      const value = item[field.name];
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && 'id' in value[0]) {
        processed[field.name] = value.map((obj) => obj.id);
      }
    }
  });

  return processed;
};

export const ResourceFormModal = ({
  item,
  isEdit,
  onClose,
  onSave,
  fields,
  isSaving = false,
}: Props) => {
  const defaultValues = useMemo(() => preprocessItem(item || null, fields), [item, fields]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultValues || {} });

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  const onSubmit = async (data: Record<string, any>) => {
    if (isSaving) return;
    try {
      await onSave(data);
      onClose();
    } catch (error: any) {
      console.error('Submission failed:', error);
      if (error.errors && typeof error.errors === 'object') {
        Object.keys(error.errors).forEach((fieldName) => {
          setError(fieldName as FieldPath<any>, {
            type: 'server',
            message: error.errors[fieldName],
          });
        });
      }
    }
  };

  const renderErrorMessage = (error: FieldError | undefined) => {
    if (!error) return null;
    switch (error.type) {
      case 'required':
        return 'This field is required.';
      case 'minLength':
        return `Must be at least ${error.message} characters long.`;
      case 'maxLength':
        return `Cannot exceed ${error.message} characters.`;
      case 'pattern':
        return 'Invalid format.';
      case 'validate':
        return error.message || 'Validation error.';
      case 'server':
        return error.message;
      default:
        return 'Invalid data.';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-sm z-50 p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-light dark:bg-dark rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-transform duration-300 scale-100">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-light">
          {isEdit ? 'Edit' : 'Add'} {fields.length > 0 ? fields[0].label.replace(/s$/, '') : 'resource'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {fields.map((field) => {
            const fieldError = errors[field.name] as FieldError | undefined;
            const isInvalid = !!fieldError;

            return (
              <div key={field.name} className="flex flex-col">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
                >
                  {field.label}
                  {field.rules?.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>

                {field.type === 'checkbox-group' ? (
                  <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    {(field.options || []).map((opt) => {
                      const value = typeof opt === 'string' ? opt : opt.value;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      return (
                        <label key={value} className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={value}
                            {...register(field.name)}
                            className="rounded border-gray-300 dark:border-gray-500 text-accent focus:ring-accent"
                          />
                          <span className="text-gray-800 dark:text-gray-200">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    {...register(field.name, field.rules)}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-accent transition-all 
                      ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    {...register(field.name, field.rules)}
                    className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-accent transition-all appearance-none 
                      ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <option value="" disabled>
                      {field.placeholder || `Select a ${field.label.toLowerCase()}`}
                    </option>
                    {field.options?.map((opt) => {
                      const value = typeof opt === 'string' ? opt : opt.value;
                      const label = typeof opt === 'string' ? opt : opt.label;
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    {...register(field.name, field.rules)}
                    className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-accent focus:border-accent transition-all 
                      ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                )}

                {isInvalid && (
                  <p className="text-red-500 text-sm mt-1 animate-fadeIn">
                    {renderErrorMessage(fieldError)}
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isSubmitting}
              className="px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:brightness-110 transition disabled:opacity-50 shadow-md shadow-accent/40"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
