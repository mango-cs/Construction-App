import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import type { User } from '../types';

interface ProgressPageProps {
  user: User;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ user }) => {
  // Mock data - in real app this would come from Firebase
  const progressData = {
    totalProjects: user.role === 'admin' ? 6 : 1,
    completedTasks: user.role === 'admin' ? 45 : 8,
    totalTasks: user.role === 'admin' ? 60 : 12,
    averageProgress: user.role === 'admin' ? 75 : 67,
    weeklyUpdates: user.role === 'admin' ? 24 : 5,
    monthlyUpdates: user.role === 'admin' ? 89 : 18,
  };

  const projectProgress = [
    {
      name: 'China Town',
      progress: 50,
      status: 'active',
      lastUpdate: '2 hours ago',
    },
    {
      name: 'Sandhya Hotel',
      progress: 5,
      status: 'active',
      lastUpdate: '1 day ago',
    },
    {
      name: 'Mango Structure',
      progress: 50,
      status: 'active',
      lastUpdate: '3 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Progress Analytics
                </h1>
                <p className="text-sm text-gray-600">
                  {user.role === 'admin' ? 'All Projects Overview' : 'My Project Progress'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {progressData.totalProjects}
              </div>
              <div className="text-sm text-gray-600">
                {user.role === 'admin' ? 'Total Projects' : 'My Projects'}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {progressData.completedTasks}/{progressData.totalTasks}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
          </div>
          <div className="card md:col-span-1 col-span-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {progressData.averageProgress}%
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              Weekly Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Updates</span>
                <span className="text-sm font-medium">{progressData.weeklyUpdates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((progressData.weeklyUpdates / 30) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Target: 30 updates/week
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-success-600" />
              Monthly Trends
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Updates</span>
                <span className="text-sm font-medium">{progressData.monthlyUpdates}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((progressData.monthlyUpdates / 120) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Target: 120 updates/month
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-warning-600" />
            {user.role === 'admin' ? 'All Projects Progress' : 'My Project Progress'}
          </h3>
          <div className="space-y-4">
            {projectProgress.map((project, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <span className="text-sm text-gray-500">{project.lastUpdate}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-warning-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {project.progress}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 capitalize">{project.status}</span>
                  <span className="text-xs text-gray-500">
                    {project.progress < 25 ? 'Foundation' : 
                     project.progress < 50 ? 'Structure' : 
                     project.progress < 75 ? 'Finishing' : 'Near Completion'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage; 