import React from 'react';
import { Link } from 'react-router-dom';
import { signOutUser } from '../services/auth';
import type { User } from '../types';
import LanguageToggle from '../components/LanguageToggle';
import { T } from '../components/TranslatedText';
import { 
  Plus, 
  FolderOpen, 
  Settings, 
  LogOut, 
  User as UserIcon,
  BarChart3
} from 'lucide-react';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Create Update',
      description: 'Add new progress update with photos',
      icon: Plus,
      href: '/update',
      color: 'bg-primary-500',
    },
    {
      title: 'My Projects',
      description: 'View assigned projects and tasks',
      icon: FolderOpen,
      href: '/projects',
      color: 'bg-success-500',
    },
    {
      title: 'Progress',
      description: 'View progress and analytics',
      icon: BarChart3,
      href: '/progress',
      color: 'bg-warning-500',
    },
  ];

  // Admin specific menu items
  if (user.role === 'admin') {
    menuItems[1] = {
      title: 'Manage Projects',
      description: 'Create, edit, and manage all projects',
      icon: FolderOpen,
      href: '/projects',
      color: 'bg-success-500',
    };
  }

  // Admin only items - remove Create Update for admin
  if (user.role === 'admin') {
    menuItems.shift(); // Remove Create Update from admin menu
    menuItems.push({
      title: 'Admin Panel',
      description: 'Manage users and settings',
      icon: Settings,
      href: '/admin',
      color: 'bg-gray-500',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                <T>Dashboard</T>
              </h1>
              <p className="text-sm text-gray-600">
                <T>Welcome</T>, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">
                  {user.role}
                </span>
              </div>
              <LanguageToggle size="sm" />
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {user.role === 'admin' ? '6' : '1'}
              </div>
              <div className="text-sm text-gray-600">
                <T>{user.role === 'admin' ? 'All Projects' : 'My Project'}</T>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {user.role === 'admin' ? '12' : '3'}
              </div>
              <div className="text-sm text-gray-600"><T>Updates Today</T></div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="block card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    <T>{item.title}</T>
                  </h3>
                  <p className="text-sm text-gray-600">
                    <T>{item.description}</T>
                  </p>
                </div>
                <div className="text-gray-400">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Updates */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Updates
          </h2>
          <div className="space-y-3">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Roof work completed
                  </h3>
                  <p className="text-sm text-gray-600">
                    China Town Project
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  2 hours ago
                </span>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Foundation progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sandhya Hotel Project
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  4 hours ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 