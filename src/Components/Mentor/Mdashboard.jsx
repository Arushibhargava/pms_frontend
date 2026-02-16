import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Eye, Mail, Phone, BookOpen, Hash,
  UserCheck, Building, ChevronRight, FileText,
  Calendar, Clock, CheckCircle, XCircle, GitPullRequest,
  Code, Layout, FileCode, Settings, BarChart2, Bell
} from 'lucide-react';
import Mweeklyprogress from './Mweeklyprogress';

const Mdashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mentorData, setMentorData] = useState({
    mentor_username: '',
    mentor_name: '',
    team_details: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('https://pms-backend-00j9.onrender.com/api/mentor/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMentorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleProjectDetails = (team) => {
    setSelectedTeam(team);
    setShowProjectModal(true);
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-blue-600 font-medium">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your team details</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Mentor Dashboard</h1>
                <p className="text-blue-100 mt-1 max-w-lg">
                  Welcome, {mentorData.mentor_name} ({mentorData.mentor_username})
                </p>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 min-w-[120px]">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{mentorData.team_details.length}</div>
                <div className="text-sm text-blue-100">Assigned Teams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams List */}
        {mentorData.team_details.map((team) => (
          <div key={team.team_id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Team Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">{team.team_name}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-blue-100 text-sm">Team ID: {team.team_id}</span>
                    <span className="text-blue-100 text-sm">•</span>
                    <span className="text-blue-100 text-sm">{team.members.length} Members</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleProjectDetails(team)}
                  className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Eye size={18} />
                  <span>Project Details</span>
                </button>
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      <Hash size={14} className="inline mr-1" /> #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      <UserCheck size={14} className="inline mr-1" /> Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      <BookOpen size={14} className="inline mr-1" /> Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      <Building size={14} className="inline mr-1" /> Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      <Mail size={14} className="inline mr-1" /> Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      <Phone size={14} className="inline mr-1" /> Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Roll No.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {team.members.map((member, index) => (
                    <tr key={member.stu_id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-xs">{member.name.charAt(0)}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.stu_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <a href={`tel:${member.phone_no}`} className="text-blue-600 hover:underline">{member.phone_no}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.semester}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.roll_no}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'tasks': return <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"><h2 className="text-2xl font-bold text-blue-800 mb-4">Tasks</h2><p className="text-gray-700">Tasks management content will be displayed here.</p></div>;
      case 'marks': return <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"><h2 className="text-2xl font-bold text-blue-800 mb-4">Marks</h2><p className="text-gray-700">Marks and grades content will be displayed here.</p></div>;
      case 'notification': return <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"><h2 className="text-2xl font-bold text-blue-800 mb-4">Notifications</h2><p className="text-gray-700">Notification center content will be displayed here.</p></div>;
      case 'report': return <Mweeklyprogress />;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <Users size={18} className="mr-2" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          <BarChart2 size={18} className="mr-2" />
          Reports
        </button>
      </div>

      {renderContent()}

      {/* Team Project Details Modal */}
      {showProjectModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.team_name} - Project Details</h2>
              <button 
                onClick={() => setShowProjectModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="mr-2 text-blue-600" size={20} />
                  Project Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                      <p className="mt-1 text-gray-900 font-medium">
                        {selectedTeam.project.project_name || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-gray-700">
                        {selectedTeam.project.description || 'No description provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Technology Stack</h4>
                      <p className="mt-1 text-gray-900 font-medium">
                        {selectedTeam.project.tech_stack || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Approval Status</h4>
                      <div className="mt-1 flex items-center">
                        {selectedTeam.project.approval === "approved" ? (
                          <CheckCircle className="text-green-500 mr-2" size={18} />
                        ) : selectedTeam.project.approval === "pending" ? (
                          <Clock className="text-yellow-500 mr-2" size={18} />
                        ) : (
                          <XCircle className="text-red-500 mr-2" size={18} />
                        )}
                        <span className="font-medium capitalize">{selectedTeam.project.approval}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="mr-2 text-blue-600" size={20} />
                  Team Members ({selectedTeam.members.length})
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-blue-800">#</th>
                        <th className="px-4 py-2 text-left font-medium text-blue-800">Name</th>
                        <th className="px-4 py-2 text-left font-medium text-blue-800">Class</th>
                        <th className="px-4 py-2 text-left font-medium text-blue-800">Branch</th>
                        <th className="px-4 py-2 text-left font-medium text-blue-800">Email</th>
                        <th className="px-4 py-2 text-left font-medium text-blue-800">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedTeam.members.map((member, index) => (
                        <tr key={member.stu_id} className="hover:bg-blue-50">
                          <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium">{member.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{member.class}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{member.branch}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                              {member.email}
                            </a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a href={`tel:${member.phone_no}`} className="text-blue-600 hover:underline">
                              {member.phone_no}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mdashboard;