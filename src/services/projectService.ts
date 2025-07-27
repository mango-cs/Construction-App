import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';
import { db, storage } from './firebase';
import type { Project } from '../types';

// Collection names
const PROJECTS_COLLECTION = 'projects';
const PROJECT_IMAGES_PATH = 'project-images';

// Type for project data without id (for creation)
export type ProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

// Type for project updates
export type ProjectUpdate = Partial<ProjectData>;

/**
 * Create a new project
 */
export const createProject = async (
  projectData: ProjectData, 
  images: File[] = []
): Promise<string> => {
  try {
    // Upload images first if provided
    let imageUrls: string[] = [];
    
    // Create project document first to get ID
    const projectRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      images: [], // Initialize empty array
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Upload images with project ID and get URLs
    if (images.length > 0) {
      imageUrls = await uploadProjectImages(projectRef.id, images);
      
      // Update project with image URLs
      await updateDoc(projectRef, {
        images: imageUrls,
        updatedAt: Timestamp.now()
      });
    }

    console.log('Project created with ID:', projectRef.id);
    console.log('Images uploaded:', imageUrls.length);
    return projectRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (
  projectId: string,
  updates: ProjectUpdate,
  newImages: File[] = [],
  imagesToDelete: string[] = []
): Promise<void> => {
  try {
    // Get current project to preserve existing images
    const currentProject = await getProject(projectId);
    let existingImages = currentProject?.images || [];

    // Delete specified images from storage and array
    if (imagesToDelete.length > 0) {
      await deleteProjectImages(projectId, imagesToDelete);
      existingImages = existingImages.filter(url => !imagesToDelete.includes(url));
    }

    // Upload new images and get URLs
    let newImageUrls: string[] = [];
    if (newImages.length > 0) {
      newImageUrls = await uploadProjectImages(projectId, newImages);
    }

    // Combine existing and new image URLs
    const allImages = [...existingImages, ...newImageUrls];

    // Update project document with image URLs
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      images: allImages,
      updatedAt: Timestamp.now()
    });

    console.log('Project updated successfully with images:', projectId);
    console.log('Total images:', allImages.length);
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

/**
 * Delete a project and all its images
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    // Delete all project images first
    await deleteAllProjectImages(projectId);

    // Delete project document
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);

    console.log('Project deleted successfully:', projectId);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};

/**
 * Get all projects
 */
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Project);
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

/**
 * Get a single project by ID
 */
export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(projectRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
};

/**
 * Upload images for a project
 */
export const uploadProjectImages = async (
  projectId: string, 
  images: File[]
): Promise<string[]> => {
  try {
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${index}-${image.name}`;
      const imageRef = ref(storage, `${PROJECT_IMAGES_PATH}/${projectId}/${fileName}`);
      
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    });

    const downloadURLs = await Promise.all(uploadPromises);
    console.log('Images uploaded successfully:', downloadURLs);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Failed to upload images');
  }
};

/**
 * Get all images for a project
 */
export const getProjectImages = async (projectId: string): Promise<string[]> => {
  try {
    const imagesRef = ref(storage, `${PROJECT_IMAGES_PATH}/${projectId}`);
    const result = await listAll(imagesRef);
    
    const urlPromises = result.items.map(imageRef => getDownloadURL(imageRef));
    const urls = await Promise.all(urlPromises);
    
    return urls;
  } catch (error) {
    console.error('Error fetching project images:', error);
    // Return empty array if folder doesn't exist (new project)
    return [];
  }
};

/**
 * Delete specific images from a project
 */
export const deleteProjectImages = async (
  projectId: string, 
  imageUrls: string[]
): Promise<void> => {
  try {
    const deletePromises = imageUrls.map(async (url) => {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    });

    await Promise.all(deletePromises);
    console.log('Images deleted successfully');
  } catch (error) {
    console.error('Error deleting images:', error);
    throw new Error('Failed to delete images');
  }
};

/**
 * Delete all images for a project
 */
export const deleteAllProjectImages = async (projectId: string): Promise<void> => {
  try {
    const imagesRef = ref(storage, `${PROJECT_IMAGES_PATH}/${projectId}`);
    const result = await listAll(imagesRef);
    
    const deletePromises = result.items.map(imageRef => deleteObject(imageRef));
    await Promise.all(deletePromises);
    
    console.log('All project images deleted successfully');
  } catch (error) {
    console.error('Error deleting all project images:', error);
    // Don't throw error if folder doesn't exist
    if (error instanceof Error && !error.message.includes('object-not-found')) {
      throw new Error('Failed to delete project images');
    }
  }
};

/**
 * Search projects by name or location
 */
export const searchProjects = async (searchTerm: string): Promise<Project[]> => {
  try {
    const allProjects = await getAllProjects();
    const filteredProjects = allProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filteredProjects;
  } catch (error) {
    console.error('Error searching projects:', error);
    throw new Error('Failed to search projects');
  }
}; 

/**
 * Bulk import real construction projects (temporary admin function)
 */
export const importRealProjects = async (): Promise<void> => {
  try {
    const realProjects = [
      {
        name: 'China Town Building',
        location: 'Hyderabad, Telangana',
        plannedStructure: 'G+1',
        currentPhase: 'Roofing ongoing',
        nextAction: 'Finish roofing to full coverage',
        percentComplete: 35,
        status: 'active' as const
      },
      {
        name: 'UNOS Building (Dismantling)',
        location: 'Hyderabad, Telangana',
        plannedStructure: 'To be rebuilt (TBD)',
        currentPhase: 'Roof support rods removal in progress',
        nextAction: 'Complete rod dismantling; clear site for next phase',
        percentComplete: 15,
        status: 'active' as const
      },
      {
        name: 'Mango Building (Big Basket)',
        location: 'Hyderabad, Telangana',
        plannedStructure: 'G+3',
        currentPhase: 'Steel structure complete; ground floor brickwork done; internal and utility work pending',
        nextAction: 'Begin wall plastering; install bathrooms, drainage, electricity',
        percentComplete: null,
        status: 'active' as const
      },
      {
        name: 'Sandhya G+2 Site',
        location: 'Hyderabad, Telangana',
        plannedStructure: 'G+2',
        currentPhase: 'Site cleared and ready for foundation',
        nextAction: 'Lay foundation and begin superstructure work',
        percentComplete: 0,
        status: 'active' as const
      },
      {
        name: 'Sandhya Hotel (AMP‑M)',
        location: 'Hyderabad, Telangana',
        plannedStructure: 'Basement‑1 + G+3',
        currentPhase: 'Foundation stage',
        nextAction: 'Continue footing work; prepare for vertical construction',
        percentComplete: 10,
        status: 'active' as const
      },
      {
        name: 'Sandhya Hospital (Behind Petrol Bunk)',
        location: 'Hyderabad, Telangana',
        plannedStructure: 'Basement‑2 + G+4',
        currentPhase: 'Basement concrete pour 50% complete; external basement wall 20% done',
        nextAction: 'Complete remaining basement slab and external basement wall formwork',
        percentComplete: 35,
        status: 'active' as const
      }
    ];

    console.log('Starting bulk import of real construction projects...');
    
    for (const project of realProjects) {
      await createProject(project);
      console.log(`✅ Imported: ${project.name}`);
    }

    console.log('🎉 All 6 construction projects imported successfully!');
  } catch (error) {
    console.error('❌ Error importing projects:', error);
    throw new Error('Failed to import real projects');
  }
}; 