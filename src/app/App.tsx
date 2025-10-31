import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/shared/components/Navbar';

function App() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'>
      <Navbar />
      <main className='grow'>
        {isLoading ? (
          <LoadingSpinner message='Loading...' />
        ) : (
          <Suspense fallback={<LoadingSpinner message='Loading...' />}>
            <Outlet />
          </Suspense>
        )}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App
