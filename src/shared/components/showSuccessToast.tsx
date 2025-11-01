import { toast } from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

export const showSuccessToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`
          flex items-start gap-3 bg-green-100 border border-green-400 text-green-800 
          p-4 rounded-md shadow-md max-w-sm
          ${t.visible ? 'animate-enter' : 'animate-leave'}
        `}
      >
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
        <div>
          <strong className="block font-semibold mb-1">Success</strong>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    ),
    { duration: 4000 }
  );
};
