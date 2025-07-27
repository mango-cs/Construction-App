import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Settings, Plus, Database } from 'lucide-react';
import type { User } from '../types';
import { importRealProjects } from '../services/projectService';

interface AdminPageProps {
  user: User;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);

  const handleImportRealProjects = async () => {
    if (window.confirm('This will import 6 real construction projects to Firebase. Continue?')) {
      try {
        setImporting(true);
        await importRealProjects();
        alert('✅ Successfully imported all 6 construction projects!');
      } catch (error) {
        console.error('Import error:', error);
        alert('❌ Failed to import projects. Please try again.');
      } finally {
        setImporting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-600">Manage users and system settings</p>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        
        {/* Data Import Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data Import</h2>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Import Real Construction Projects</h3>
            <p className="text-sm text-blue-700 mb-4">
              Import all 6 real construction projects (China Town Building, UNOS, Mango Building, 
              Sandhya G+2 Site, Sandhya Hotel, Sandhya Hospital) to Firebase.
            </p>
              <button
              onClick={handleImportRealProjects}
              disabled={importing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>{importing ? 'Importing...' : 'Import Real Projects'}</span>
              </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock user data - replace with Firebase users later */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Admin User</h3>
              <p className="text-sm text-gray-600">admin@construction.com</p>
              <p className="text-xs text-gray-500 mt-1">Role: Admin</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Suresh Reddy</h3>
              <p className="text-sm text-gray-600">suresh@construction.com</p>
              <p className="text-xs text-gray-500 mt-1">Role: Manager</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Ramesh Kumar</h3>
              <p className="text-sm text-gray-600">ramesh@construction.com</p>
              <p className="text-xs text-gray-500 mt-1">Role: Manager</p>
        </div>
      </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New User</span>
                </button>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Project Notifications</h3>
                <p className="text-sm text-gray-600">Send notifications for project updates</p>
              </div>
              <div className="bg-green-500 relative inline-block w-10 h-6 rounded-full">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Auto Backup</h3>
                <p className="text-sm text-gray-600">Automatically backup project data</p>
              </div>
              <div className="bg-green-500 relative inline-block w-10 h-6 rounded-full">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
          </div>
        </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-600">Put system in maintenance mode</p>
              </div>
              <div className="bg-gray-300 relative inline-block w-10 h-6 rounded-full">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 