import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/features/auth/provider/AuthProvider';
import { authAPI } from '@/features/auth/services/authAPI';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterForm = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await authAPI.register({ name, username, email, password, confirmPassword });
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration error');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-light dark:bg-dark transition-colors duration-300'>
      <div className='w-full max-w-sm bg-white dark:bg-dark/80 rounded-xl shadow-md p-8'>
        <h2 className='text-2xl font-bold text-center mb-6 text-dark dark:text-light'>
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-dark dark:text-light mb-1'>
              Full Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='w-full px-3 py-2 border border-dark/30 dark:border-light/30 rounded-md bg-transparent text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-dark dark:text-light mb-1'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='w-full px-3 py-2 border border-dark/30 dark:border-light/30 rounded-md bg-transparent text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-dark dark:text-light mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-3 py-2 border border-dark/30 dark:border-light/30 rounded-md bg-transparent text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-dark dark:text-light mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-3 py-2 border border-dark/30 dark:border-light/30 rounded-md bg-transparent text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-dark dark:text-light mb-1'>
              Confirm Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full px-3 py-2 border border-dark/30 dark:border-light/30 rounded-md bg-transparent text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent'
            />
          </div>

          {error && <p className='text-red-600 text-sm'>{error}</p>}

          <button
            type='submit'
            className='w-full py-2 mt-2 bg-accent text-dark font-semibold rounded-md hover:opacity-90 transition-opacity'
          >
            Register
          </button>
        </form>

        <p className='mt-4 text-center text-sm text-dark dark:text-light'>
          Already have an account?{' '}
          <Link to='/login' className='text-accent hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
