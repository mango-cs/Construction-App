import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Plus, Edit, Trash2, Camera, Eye, Settings } from 'lucide-react';
import type { User, Project } from '../types';
import { getAllProjects, createProject, updateProject, deleteProject } from '../services/projectService';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProjectsPageProps {
  user: User;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    plannedStructure: '',
    currentPhase: '',
    progress: 0,
    nextAction: ''
  });

  // Load projects from Firebase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const projects = await getAllProjects();
        setAllProjects(projects);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter projects based on user role
  const getProjectsForUser = (): Project[] => {
    if (user.role === 'admin') {
      return allProjects; // Admin sees all projects
    } else {
      // Managers see only their assigned project
      const assignedProject = allProjects.find(p => p.id === user.projectId);
      return assignedProject ? [assignedProject] : [];
    }
  };

  const projects = getProjectsForUser();

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      location: project.location,
      plannedStructure: project.plannedStructure || '',
      currentPhase: project.currentPhase,
      progress: project.percentComplete || 0,
      nextAction: project.nextAction
    });
    setShowEditModal(true);
    // Load actual project images from Firebase
    setExistingImages(project.images || []);
    setProjectImages([]);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleAddProject = () => {
    setFormData({
      name: '',
      location: '',
      plannedStructure: '',
      currentPhase: 'Site Preparation',
      progress: 0,
      nextAction: ''
    });
    setProjectImages([]);
    setExistingImages([]);
    setShowAddModal(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (projectImages.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    setProjectImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProject = async (isEdit: boolean = false) => {
    try {
      setSaving(true);
      console.log('Saving project:', formData);
      console.log('Images:', projectImages);
      console.log('Existing images:', existingImages);
      
      if (isEdit && selectedProject) {
        await updateProject(selectedProject.id, {
          name: formData.name,
          location: formData.location,
          plannedStructure: formData.plannedStructure,
          currentPhase: formData.currentPhase,
          percentComplete: formData.progress,
          nextAction: formData.nextAction,
          status: 'active'
        }, projectImages);
        
        alert('Project updated successfully!');
      } else {
        await createProject({
          name: formData.name,
          location: formData.location,
          plannedStructure: formData.plannedStructure,
          currentPhase: formData.currentPhase,
          percentComplete: formData.progress,
          nextAction: formData.nextAction,
          status: 'active'
        }, projectImages);
        
        alert('Project created successfully!');
      }
      
      // Reload projects from Firebase
      const projects = await getAllProjects();
      setAllProjects(projects);
      
      // Close modal and reset form
      setShowEditModal(false);
      setShowAddModal(false);
      setFormData({
        name: '',
        location: '',
        plannedStructure: '',
        currentPhase: 'Site Preparation',
        progress: 0,
        nextAction: ''
      });
      setProjectImages([]);
      setExistingImages([]);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSaving(true);
      console.log('Deleting project:', selectedProject?.name);
      
      if (selectedProject) {
        await deleteProject(selectedProject.id);
      alert('Project deleted successfully!');
        
        // Reload projects from Firebase
        const projects = await getAllProjects();
        setAllProjects(projects);
      }
      
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Prevent background scrolling when modals are open
  useEffect(() => {
    const isModalOpen = showAddModal || showEditModal || showDeleteModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showEditModal, showDeleteModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-semibold text-gray-900">
                  {user.role === 'admin' ? 'Manage Projects' : 'My Projects'}
                </h1>
                <p className="text-sm text-gray-600">
                  {user.role === 'admin' ? 'Create, edit, and manage all projects' : 'View your assigned projects'}
                </p>
              </div>
            </div>
            {user.role === 'admin' && (
              <button
                onClick={handleAddProject}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow">
              {/* Project Image */}
              <div className="relative mb-4">
                {project.images && project.images.length > 0 ? (
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={project.images[currentImageIndex[project.id] || 0]} 
                      alt={project.name}
                      className="w-full h-full object-cover transition-all duration-300"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg class="w-8 h-8 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          </div>
                        `;
                      }}
                    />
                    {/* Image counter */}
                    {project.images.length > 1 && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        {(currentImageIndex[project.id] || 0) + 1} / {project.images.length}
                      </div>
                    )}
                    {/* Navigation arrows */}
                    {project.images.length > 1 && (
                      <>
                        {/* Previous arrow */}
                        {(currentImageIndex[project.id] || 0) > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = currentImageIndex[project.id] || 0;
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [project.id]: currentIndex - 1
                              }));
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        {/* Next arrow */}
                        {(currentImageIndex[project.id] || 0) < project.images.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = currentImageIndex[project.id] || 0;
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [project.id]: currentIndex + 1
                              }));
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                    {/* Navigation dots */}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [project.id]: index
                              }));
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              (currentImageIndex[project.id] || 0) === index 
                                ? 'bg-white shadow-lg' 
                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'active' 
                      ? 'bg-success-100 text-success-800'
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                {user.role === 'admin' && (
                  <div className="absolute top-2 left-2 flex space-x-1">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <Edit className="w-3 h-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="p-1 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    {project.plannedStructure && (
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {project.plannedStructure}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {project.percentComplete !== null && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{project.percentComplete}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          project.percentComplete < 25 ? 'bg-red-500' :
                          project.percentComplete < 50 ? 'bg-yellow-500' :
                          project.percentComplete < 75 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${project.percentComplete}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Current Phase */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Settings className="w-3 h-3 mr-1" />
                    Current Phase
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {project.currentPhase}
                  </p>
                </div>

                {/* Next Action */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Next Action
                  </h4>
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                    {project.nextAction}
                  </p>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated: {project.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {user.role === 'admin' ? 'No projects created' : 'No projects assigned'}
            </h3>
            <p className="text-gray-600">
              {user.role === 'admin' 
                ? 'Create your first project to get started.' 
                : 'Contact your admin to get assigned to projects.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Structure</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g., G+2, Basement-1 + G+3"
                  value={formData.plannedStructure}
                  onChange={(e) => handleInputChange('plannedStructure', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Phase</label>
                <select 
                  className="input-field"
                  value={formData.currentPhase}
                  onChange={(e) => handleInputChange('currentPhase', e.target.value)}
                >
                  <option>Site Preparation</option>
                  <option>Excavation & Foundation</option>
                  <option>Substructure</option>
                  <option>Superstructure - Columns & Beams</option>
                  <option>Superstructure - Slabs & Walls</option>
                  <option>Roofing & Waterproofing</option>
                  <option>Electrical & Plumbing</option>
                  <option>HVAC & Fire Safety</option>
                  <option>Interior Finishing</option>
                  <option>Exterior Finishing</option>
                  <option>Landscaping & External Works</option>
                  <option>Testing & Commissioning</option>
                  <option>Dismantling & Demolition</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="input-field" 
                  placeholder="0-100"
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                <textarea 
                  className="input-field" 
                  rows={3} 
                  placeholder="Describe next action"
                  value={formData.nextAction}
                  onChange={(e) => handleInputChange('nextAction', e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Project Images Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Project Images</h4>
              
              {/* Upload New Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Images</label>
                <div className="space-y-3">
                  {/* Upload Button */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="add-image-upload"
                    />
                    <label htmlFor="add-image-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">Maximum 10 images, JPG/PNG</p>
                    </label>
                  </div>

                  {/* Preview New Images */}
                  {projectImages.length > 0 && (
                                         <div>
                       <p className="text-sm text-gray-600 mb-2">Selected Images ({projectImages.length}/10)</p>
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {projectImages.map((file, index) => (
                          <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveProject(false)}
                  disabled={saving}
                className="btn-primary flex-1"
              >
                  {saving ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto my-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Project</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned Structure</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.plannedStructure}
                    onChange={(e) => handleInputChange('plannedStructure', e.target.value)}
                    placeholder="e.g., G+2, Basement-1 + G+3" 
                  />
                </div>
              </div>

              {/* Right Column - Progress Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Phase</label>
                  <select 
                    className="input-field" 
                    value={formData.currentPhase}
                    onChange={(e) => handleInputChange('currentPhase', e.target.value)}
                  >
                    <option>Site Preparation</option>
                    <option>Excavation & Foundation</option>
                    <option>Substructure</option>
                    <option>Superstructure - Columns & Beams</option>
                    <option>Superstructure - Slabs & Walls</option>
                    <option>Roofing & Waterproofing</option>
                    <option>Electrical & Plumbing</option>
                    <option>HVAC & Fire Safety</option>
                    <option>Interior Finishing</option>
                    <option>Exterior Finishing</option>
                    <option>Landscaping & External Works</option>
                    <option>Testing & Commissioning</option>
                    <option>Dismantling & Demolition</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="input-field" 
                    value={formData.progress}
                    onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    value={formData.nextAction}
                    onChange={(e) => handleInputChange('nextAction', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Project Images Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Project Images</h4>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={`${imageUrl}-${index}`} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center';
                            fallback.innerHTML = `<span class="text-white text-xs">Image ${index + 1}</span>`;
                            target.parentElement!.insertBefore(fallback, target);
                          }}
                        />
                        <button
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
                <div className="space-y-3">
                  {/* Upload Button */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">Maximum 10 images, JPG/PNG</p>
                    </label>
                  </div>

                  {/* Preview New Images */}
                  {projectImages.length > 0 && (
                                         <div>
                       <p className="text-sm text-gray-600 mb-2">New Images ({projectImages.length}/10)</p>
                       <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {projectImages.map((file, index) => (
                          <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveProject(true)}
                  disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full p-6 my-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Project</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedProject.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                disabled={saving}
                className="btn-danger flex-1"
              >
                {saving ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 