import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, createTestUsers } from '../services/auth';
import type { User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Crown, User as UserIcon } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creatingUsers, setCreatingUsers] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user: User = await signInWithEmail(email, password);
      console.log('Logged in user:', user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'manager') => {
    setLoading(true);
    setError('');

    try {
      const testEmail = role === 'admin' ? 'admin@construction.com' : 'suresh@construction.com';
      console.log(`Attempting quick login as ${role} with email:`, testEmail);
      const user: User = await signInWithEmail(testEmail, 'password');
      console.log('Quick login successful:', user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Quick login failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // Check if it's a user not found error
      if (errorMessage.includes('User document not found') || errorMessage.includes('user-not-found') || errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/invalid-credential')) {
        console.log('User not found, attempting to create test users...');
        setError('User not found. Creating test users...');
        
        try {
          setCreatingUsers(true);
          await createTestUsers();
          setError('Test users created! Please click the button again to login.');
        } catch (createError) {
          console.error('Failed to create test users:', createError);
          setError(`Failed to create test users: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
        } finally {
          setCreatingUsers(false);
        }
      } else {
        // Other types of errors
        setError(`Login failed: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Construction App</h1>
          <h2 className="text-lg text-gray-600">Sign in to your account</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Quick Login Section */}
        <div className="mb-6">
            <h3 className="text-center text-sm font-medium text-gray-700 mb-4">
              Quick Login (Testing)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={loading || creatingUsers}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Crown className="w-4 h-4 mr-2" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                disabled={loading || creatingUsers}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Site Head
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in manually</span>
          </div>
        </div>

          {/* Manual Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className={`text-sm text-center ${error.includes('created') || error.includes('Creating') ? 'text-blue-600' : 'text-red-600'}`}>
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || creatingUsers}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 