import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { User } from '../types';

/**
 * Get all users with manager role (site heads) for assignment
 */
export const getAllSiteHeads = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where('role', '==', 'manager'),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const siteHeads: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      siteHeads.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        projectId: data.projectId,
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    return siteHeads;
  } catch (error) {
    console.error('Error fetching site heads:', error);
    throw new Error('Failed to fetch site heads');
  }
};

/**
 * Get all users (for admin management)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('name', 'asc'));
    
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        projectId: data.projectId,
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

/**
 * Update user's assigned project
 */
export const updateUserProject = async (userId: string, projectId: string | null): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      projectId: projectId
    });
  } catch (error) {
    console.error('Error updating user project:', error);
    throw new Error('Failed to update user project assignment');
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const users = await getAllUsers();
    return users.find(user => user.id === userId) || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}; 