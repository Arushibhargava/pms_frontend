import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, FileText } from 'lucide-react';
import axios from 'axios';

const Cprojectproposals = () => {
  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [processingIds, setProcessingIds] = useState(new Set());
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('https://pms-backend-00j9.onrender.com/api/coordinator/project/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched Projects:", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.response?.data?.error || error.message || 'Failed to load projects');
        showMessage('Failed to load projects', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const showMessage = (text, type) => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleStatusUpdate = async (projectId, newStatus) => {
    setProcessingIds(prev => new Set(prev).add(projectId));

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `http://localhost:8000/api/coordinator/project/approval/${projectId}/`,
        { approval: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(prev =>
        prev.map(project =>
          project.project_id === projectId
            ? { ...project, approval: newStatus.toLowerCase() }
            : project
        )
      );

      showMessage(response.data.message, 'success');
    } catch (error) {
      console.error('Error updating project status:', error);
      showMessage(
        error.response?.data?.error || 'Failed to update project status',
        'error'
      );
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          className: 'bg-green-500 text-white',
          icon: <CheckCircle className="w-4 h-4" />,
          displayText: 'Approved'
        };
      case 'rejected':
        return {
          className: 'bg-red-500 text-white',
          icon: <XCircle className="w-4 h-4" />,
          displayText: 'Rejected'
        };
      default:
        return {
          className: 'bg-orange-500 text-white',
          icon: <Clock className="w-4 h-4" />,
          displayText: 'Pending'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {message.show && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          message.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ?
              <CheckCircle className="w-5 h-5" /> :
              <XCircle className="w-5 h-5" />
            }
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Project Proposals</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => {
              const statusConfig = getStatusConfig(project.approval);
              const isProcessing = processingIds.has(project.project_id);

              return (
                <div key={project.project_id} className={`relative ${isProcessing ? 'pointer-events-none' : ''}`}>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-blue-900/70 rounded-lg z-10 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-700/30">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-blue-100 mb-2">
                          {project.project_name}
                        </h3>
                        <div className="flex items-center gap-2 text-blue-200 mb-3">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{project.team}</span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                        {statusConfig.icon}
                        {statusConfig.displayText}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-blue-200 mb-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Description</span>
                      </div>
                      <p className="text-blue-100 text-sm leading-relaxed bg-blue-800/30 p-3 rounded border border-blue-700/30">
                        {project.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-blue-200 mb-2">
                        <span className="text-sm font-medium">Tech Stack</span>
                      </div>
                      <p className="text-blue-100 text-sm">
                        {project.tech_stack}
                      </p>
                    </div>

                    {project.approval !== 'approved' && project.approval !== 'rejected' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusUpdate(project.project_id, 'approved')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => handleStatusUpdate(project.project_id, 'rejected')}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Project Proposals</h3>
                  <p className="text-gray-600 text-sm">There are currently no project proposals to review.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cprojectproposals;
