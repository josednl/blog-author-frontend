import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();

  let errorMessage = 'Oops! An unexpected error occurred.';
  let errorStatus = 500;
  let errorTitle = 'Internal Server Error';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorTitle = error.statusText || 'Error';

    if (error.status === 404) {
      errorMessage = "The page you are looking for does not exist or has been moved.";
      errorTitle = 'Page Not Found';
    } else {
      errorMessage = error.data?.message || error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const accentColor = 'text-accent dark:text-accent';
  const buttonClass = 'inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-accent hover:bg-accent/90 transition-all duration-150 ease-in-out dark:bg-accent dark:hover:bg-accent-dark';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-lg bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 hover:shadow-indigo-500/30">

        <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${accentColor}`} aria-hidden="true" />

        <p className={`text-7xl font-extrabold mb-4 ${accentColor}`}>
          {errorStatus}
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          {errorTitle}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {errorMessage}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {isRouteErrorResponse(error) ? `Error route: ${error.status} - ${error.statusText}` : errorMessage}
        </p>

        <Link to="/" className={buttonClass}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go to Dashboard
        </Link>

      </div>
    </div>
  );
};

export default ErrorPage;
