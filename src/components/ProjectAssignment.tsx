import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import type { User as UserType, Project } from '../types';
import { getAllSiteHeads } from '../services/userService';
import { assignSiteHeadToProject, removeSiteHeadFromProject } from '../services/projectService';

interface ProjectAssignmentProps {
  project: Project;
  onAssignmentUpdate: () => void;
  isAdmin: boolean;
}

const ProjectAssignment: React.FC<ProjectAssignmentProps> = ({ 
  project, 
  onAssignmentUpdate, 
  isAdmin 
}) => {
  const [siteHeads, setSiteHeads] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadSiteHeads();
    }
  }, [isAdmin]);

  const loadSiteHeads = async () => {
    try {
      setLoading(true);
      const heads = await getAllSiteHeads();
      setSiteHeads(heads);
    } catch (error) {
      console.error('Error loading site heads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (selectedUserId: string) => {
    if (!selectedUserId || assigning) return;

    try {
      setAssigning(true);
      
      if (selectedUserId === 'unassign') {
        await removeSiteHeadFromProject(project.id);
      } else {
        const selectedUser = siteHeads.find(user => user.id === selectedUserId);
        if (selectedUser) {
          await assignSiteHeadToProject(project.id, {
            userId: selectedUser.id,
            userName: selectedUser.name,
            userEmail: selectedUser.email
          });
        }
      }
      
      onAssignmentUpdate();
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  if (!isAdmin) {
    // Show assignment info for non-admins
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="w-4 h-4" />
        {project.assignedTo ? (
          <span>{project.assignedTo.userName}</span>
        ) : (
          <span className="text-gray-400">No site head assigned</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <User className="w-4 h-4 text-gray-500" />
      <div className="flex-1">
        {loading ? (
          <div className="text-sm text-gray-500">Loading site heads...</div>
        ) : (
          <select
            value={project.assignedTo?.userId || ''}
            onChange={(e) => handleAssignment(e.target.value)}
            disabled={assigning}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
          >
            <option value="">Select Site Head</option>
            {project.assignedTo && (
              <option value="unassign" className="text-red-600">
                🗑️ Remove Assignment
              </option>
            )}
            {siteHeads.map((siteHead) => (
              <option key={siteHead.id} value={siteHead.id}>
                {siteHead.name} ({siteHead.email})
              </option>
            ))}
          </select>
        )}
        
        {assigning && (
          <div className="text-xs text-blue-600 mt-1">
            Updating assignment...
          </div>
        )}
        
        {project.assignedTo && (
          <div className="text-xs text-green-600 mt-1">
            ✅ Assigned to: {project.assignedTo.userName}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectAssignment; 