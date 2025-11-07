import { toast } from 'react-hot-toast';

export const showErrorToast = (error: any) => {
  let rawErrors: any[] = [];
  let messages: string[] = [];

  if (Array.isArray(error)) {
    rawErrors = error;
  } else if (Array.isArray(error?.response?.data?.errors)) {
    rawErrors = error.response.data.errors;
  } else if (Array.isArray(error?.errors)) {
    rawErrors = error.errors;
  }

  if (rawErrors.length > 0) {
    messages = rawErrors.map((err: any) => {
      return (
        err.msg || 
        err.message || 
        err.error || 
        JSON.stringify(err) || 
        'Unknown error'
      );
    });
  } 
  else if (typeof error?.response?.data?.error === 'string') {
    messages = [error.response.data.error];
  } else if (typeof error?.response?.data?.message === 'string') {
    messages = [error.response.data.message];
  } else if (typeof error?.message === 'string') {
    messages = [error.message];
  } else if (typeof error === 'string') {
    messages = [error];
  } else {
    messages = ['An unexpected error occurred'];
  }

  toast.custom(
    (t) => (
      <div
        className={`bg-red-100 border border-red-400 text-red-800 p-4 rounded-md max-w-sm shadow-md ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}
      >
        <strong className="block mb-1 font-semibold">There were some errors:</strong>
        <ul className="list-disc pl-4 space-y-1">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    ),
    { duration: 5000 }
  );
};
