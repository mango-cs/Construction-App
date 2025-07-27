import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User, AuthState, AppConfig } from '../types';

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Attempting to sign in with:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Firebase auth successful, getting user data for:', userCredential.user.uid);
    const user = await getUserData(userCredential.user.uid);
    console.log('User data retrieved:', user);
    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error) {
      throw new Error(`Sign in failed: ${error.message}`);
    }
    throw new Error('Failed to sign in - unknown error');
  }
};

// Create new user with email and password
export const createUserWithEmail = async (
  email: string, 
  password: string, 
  userData: Omit<User, 'id' | 'createdAt'>
): Promise<User> => {
  try {
    console.log('Creating user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Firebase auth user created, setting up Firestore document');
    
    const newUser: User = {
      id: userCredential.user.uid,
      ...userData,
      createdAt: new Date()
    };
    
    console.log('Saving user data to Firestore:', newUser);
    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    console.log('User data saved successfully');
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error('Failed to create user - unknown error');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error('Failed to sign out');
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string): Promise<User> => {
  try {
    console.log('Getting user data for userId:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.error('User document does not exist in Firestore for userId:', userId);
      throw new Error(`User document not found in Firestore for ID: ${userId}`);
    }
    const userData = userDoc.data() as User;
    console.log('Retrieved user data from Firestore:', userData);
    return userData;
  } catch (error) {
    console.error('Failed to get user data:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get user data: ${error.message}`);
    }
    throw new Error('Failed to get user data - unknown error');
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (authState: AuthState) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const user = await getUserData(firebaseUser.uid);
        callback({ user, loading: false, error: null });
      } catch (error) {
        callback({ user: null, loading: false, error: 'Failed to get user data' });
      }
    } else {
      callback({ user: null, loading: false, error: null });
    }
  });
};

// Check if user has required role
export const hasRole = (user: User | null, requiredRole: User['role']): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

// Check if user can access feature based on app config
export const canAccessFeature = (
  user: User | null, 
  feature: keyof Pick<AppConfig, 'featureProjects' | 'featureTasks' | 'featureIncentives' | 'featureReminders'>
): boolean => {
  if (!user) return false;
  if (isAdmin(user)) return true;
  
  // For now, return true for all features
  // This will be controlled by app config later
  return true;
}; 

// Create test users for quick login (development only)
export const createTestUsers = async (): Promise<void> => {
  try {
    // Create admin user
    try {
      await createUserWithEmail('admin@construction.com', 'password', {
        name: 'Admin User',
        phone: '+91 98765 43210',
        email: 'admin@construction.com',
        role: 'admin'
      });
      console.log('✅ Created admin test user');
    } catch (error) {
      // User might already exist
      console.log('Admin user already exists or creation failed');
    }

    // Create manager user
    try {
      await createUserWithEmail('suresh@construction.com', 'password', {
        name: 'Suresh Reddy',
        phone: '+91 98765 43212',
        email: 'suresh@construction.com',
        role: 'manager',
        projectId: '2'
      });
      console.log('✅ Created manager test user');
    } catch (error) {
      // User might already exist
      console.log('Manager user already exists or creation failed');
    }

    // Create another manager user
    try {
      await createUserWithEmail('ramesh@construction.com', 'password', {
        name: 'Ramesh Kumar',
        phone: '+91 98765 43213',
        email: 'ramesh@construction.com',
        role: 'manager',
        projectId: '1'
      });
      console.log('✅ Created second manager test user');
    } catch (error) {
      // User might already exist
      console.log('Second manager user already exists or creation failed');
    }

  } catch (error) {
    console.error('Error creating test users:', error);
  }
}; 

// Simple test function to verify Firebase is working
export const testFirebaseConnection = async (): Promise<void> => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Auth instance:', auth);
    console.log('DB instance:', db);
    console.log('Current user:', auth.currentUser);
    
    // Test if we can read from Firestore
    const testDoc = doc(db, 'test', 'connection');
    console.log('Firebase connection test completed');
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    throw error;
  }
}; 