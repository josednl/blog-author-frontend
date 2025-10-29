type LoadingSpinnerProps = {
  message?: string;
};

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => (
  <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
    <div className='w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4' />
    {message && <p className='text-gray-700 dark:text-gray-300 text-lg'>{message}</p>}
  </div>
);

export default LoadingSpinner;
