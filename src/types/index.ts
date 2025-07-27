// User types
export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'admin' | 'manager';
  projectId?: string;
  createdAt: Date;
}

// Project types
export interface Project {
  id: string;
  name: string;
  location: string;
  plannedStructure?: string;
  status: 'active' | 'completed' | 'on-hold';
  percentComplete: number | null;
  currentPhase: string;
  nextAction: string;
  images?: string[]; // Array of image URLs
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export interface Task {
  id: string;
  projectId: string;
  managerId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Update types (core feature)
export interface Update {
  id: string;
  userId: string;
  title: string;
  description: string;
  projectId?: string;
  taskId?: string;
  photoCount: number;
  videoCount: number;
  createdAt: Date;
}

// Media types
export interface Media {
  id: string;
  updateId: string;
  type: 'photo' | 'video';
  firebaseUrl: string;
  thumbnailUrl?: string;
  filename: string;
  size: number;
  duration?: number; // for videos
  createdAt: Date;
}

// App Configuration types
export interface AppConfig {
  featureProjects: boolean;
  featureTasks: boolean;
  featureIncentives: boolean;
  featureReminders: boolean;
  workHoursStart: string;
  workHoursEnd: string;
  reminderDays: string[];
}

// Incentive types
export interface Incentive {
  id: string;
  userId: string;
  targetType: 'task-completion' | 'project-completion' | 'date-based';
  targetValue: number;
  rewardAmount: number;
  conditionText: string;
  progressPercent: number;
  isCompleted: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// Form types
export interface UpdateFormData {
  title: string;
  description: string;
  projectId?: string;
  taskId?: string;
  photos: File[];
  videos: File[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: 'admin' | 'manager';
} 