import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, UserCheck, Calendar, Code, FileText, Award } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    tech_stack: ''
  });

  const [projects, setProjects] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone_number: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fetchProfile = async () => {
    try {
      const username = localStorage.getItem('username'); // or wherever you store it

const response = await axios.get(`https://pms-backend-00j9.onrender.com/api/user-info/${username}/`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  }
});
      setProfileData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to load profile data',
        type: 'error'
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://pms-backend-00j9.onrender.com/api/project/all/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to load projects',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      setLoading(true);
      const response = await axios.post(
        'http://pms-backend-00j9.onrender.com/api/project/submit/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage({
        text: response.data.message || 'Project submitted successfully!',
        type: 'success'
      });
      
      await fetchProjects(); // Refresh projects list
      
      // Reset form
      setFormData({
        project_name: '',
        description: '',
        tech_stack: ''
      });
    } catch (err) {
      console.error('Submission error:', err);
      setMessage({
        text: err.response?.data?.message || 'Submission failed. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <Award className="w-4 h-4" />;
      case 'rejected':
        return <FileText className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent shadow-lg mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Team Profile</h1>
          <p className="text-gray-700">Manage your projects and team information</p>
        </div>

        {/* Profile Information Card - Now with real data */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Team Profile</h2>
              <p className="text-gray-600">Your team information and details</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData.name || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-lg font-semibold text-gray-900">@{profileData.username || 'Not available'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData.email || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{profileData.phone_number || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
   {/* Project Submission Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Submit New Project</h2>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack
                </label>
                <input
                  type="text"
                  name="tech_stack"
                  value={formData.tech_stack}
                  onChange={handleChange}
                  placeholder="e.g. React, Django, MongoDB"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                rows={4}
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Project'}
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Your Projects</h3>
            </div>
            <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full border border-blue-100">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </div>
          </div>
          
          {loading && projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.project_id} 
                  className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-semibold text-blue-700">{project.project_name}</h4>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.approval)}`}>
                      {getStatusIcon(project.approval)}
                      <span className="capitalize">{project.approval}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Tech Stack:</span>
                      <span className="text-sm font-medium text-gray-900">{project.tech_stack}</span>
                    </div>
                    
                    {project.created_at && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Submitted:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(project.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No projects submitted yet.</p>
              <p className="text-gray-400 text-sm">Submit your first project using the form above!</p>
            </div>
                  )}
        </div>
      </div>
    </div>
  );
};


export default Profile;