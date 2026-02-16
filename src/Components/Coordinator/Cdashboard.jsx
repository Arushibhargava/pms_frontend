import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, BookOpen, User, Search, Filter, ChevronDown,
  AlertCircle, CheckCircle, UserCheck, Edit3, Save, X, PlusCircle
} from 'lucide-react';

const API_URL = 'https://pms-backend-00j9.onrender.com/api/coordinator/dashboard/';

const Cdashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMentor, setFilterMentor] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        setMentors(response.data.mentors || []);
        setTeamsData(response.data.teams || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        showMessage('error', 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const showMessage = (type, text) => {
    setMessages([{ type, text }]);
    setTimeout(() => setMessages([]), 3000);
  };

  const handleSave = async (teamId, mentorUsername, groupId) => {
    try {
      const selectedMentor = mentors.find(m => m.username === mentorUsername);
      const targetTeam = teamsData.find(t => t.team_username === teamId);

      if (!selectedMentor || !targetTeam) {
        showMessage('error', 'Invalid mentor or team selection');
        return;
      }

      const payload = {
        group_id: groupId,
        team: teamId,
        mentor: selectedMentor.username, 
        project_name: targetTeam.project_name || 'Untitled',
      };

      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });

      setTeamsData(prev => prev.map(team =>
        team.team_username === teamId
          ? { 
              ...team, 
              allocated_mentor: selectedMentor.name,
              mentor_username: selectedMentor.username,
              mentor_email: selectedMentor.email,
              group_id: groupId
            }
          : team
      ));
      setEditingTeam(null);
      showMessage('success', 'Team updated successfully!');
    } catch (err) {
      console.error(err.response?.data || err);
      showMessage('error', err.response?.data?.detail || 'Update failed!');
    }
  };

  const filteredTeams = teamsData.filter(team => {
    if (filterMentor && team.mentor_username !== filterMentor) return false;
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      team.team_name?.toLowerCase().includes(searchLower) ||
      team.project_name?.toLowerCase().includes(searchLower) ||
      team.team_username?.toLowerCase().includes(searchLower) ||
      team.members?.some(m => m.member_name.toLowerCase().includes(searchLower))
    );
  });

  const handleEdit = (teamId) => setEditingTeam(teamId);
  const handleCancel = () => setEditingTeam(null);

  const totalTeams = teamsData.length;
  const assignedTeams = teamsData.filter(t => t.mentor_username).length;
  const availableMentors = mentors.length;
  const activeProjects = teamsData.filter(t => t.project_name).length;

  const StatCard = ({ icon, label, value, color }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {React.cloneElement(icon, { className: `${icon.props.className || ''} h-6 w-6` })}
          </div>
        </div>
      </div>
    );
  };

  const TableHeader = ({ children }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
      {children}
    </th>
  );

  const TeamRow = ({ team, mentors, isEditing, onEdit, onSave, onCancel }) => {
    const [selectedMentor, setSelectedMentor] = useState(
      mentors.find(m => m.username === team.mentor_username)?.username || ''
    );
    const [groupId, setGroupId] = useState(team.group_id || '');

    return (
      <tr className="hover:bg-blue-50 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {team.team_username}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {team.team_name}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="space-y-1">
            {(team.members || []).map((m, i) => (
              <div key={i} className="flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                <span>{m.member_name}</span>
              </div>
            ))}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="max-w-xs truncate" title={team.project_name}>
            {team.project_name || '-'}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {isEditing ? (
            <select
              value={selectedMentor}
              onChange={e => setSelectedMentor(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Mentor</option>
              {mentors.map(mentor => (
                <option key={mentor.username} value={mentor.username}>
                  {mentor.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center">
              {team.allocated_mentor ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  <span>{team.allocated_mentor}</span>
                </>
              ) : (
                <span className="text-gray-400">Not assigned</span>
              )}
            </div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {isEditing ? (
            <input
              type="text"
              value={groupId}
              onChange={e => setGroupId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter group ID"
            />
          ) : (
            <span className={team.group_id ? 'text-gray-900' : 'text-gray-400'}>
              {team.group_id || 'Not set'}
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => onSave(team.team_username, selectedMentor, groupId)}
                className="text-green-600 hover:text-green-900"
                title="Save"
              >
                <Save className="h-5 w-5" />
              </button>
              <button
                onClick={onCancel}
                className="text-red-600 hover:text-red-900"
                title="Cancel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onEdit(team.team_username)}
              className="text-blue-600 hover:text-blue-900"
              title="Edit"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white shadow-xl border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Groups Management</h1>
                <p className="text-gray-600 mt-1">Manage teams, mentors, and project assignments</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-full">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-700 font-semibold">Coordinator</span>
            </div>
          </div>
        </div>
      </header>

      {messages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 p-4 rounded-xl flex items-center space-x-3 ${
              msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {msg.type === 'success' ? 
                <CheckCircle className="h-5 w-5 text-green-500" /> : 
                <AlertCircle className="h-5 w-5 text-red-500" />
              }
              <span className="font-medium">{msg.text}</span>
            </div>
          ))}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users className="h-6 w-6 text-blue-500" />} label="Total Teams" value={totalTeams} color="blue" />
          <StatCard icon={<UserCheck className="h-6 w-6 text-green-500" />} label="Assigned Teams" value={assignedTeams} color="green" />
          <StatCard icon={<User className="h-6 w-6 text-purple-500" />} label="Available Mentors" value={availableMentors} color="purple" />
          <StatCard icon={<BookOpen className="h-6 w-6 text-indigo-500" />} label="Active Projects" value={activeProjects} color="indigo" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex flex-col lg:flex-row justify-between gap-4 items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Users className="mr-3 h-6 w-6" /> Team Groups
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams, projects, members..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter</span>
                  <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Mentor</label>
                      <select
                        value={filterMentor}
                        onChange={e => setFilterMentor(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Mentors</option>
                        {mentors.map(mentor => (
                          <option key={mentor.username} value={mentor.username}>
                            {mentor.name} ({mentor.username})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setFilterMentor('');
                          setIsFilterOpen(false);
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTeams.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <TableHeader>Team ID</TableHeader>
                    <TableHeader>Team Name</TableHeader>
                    <TableHeader>Members</TableHeader>
                    <TableHeader>Project</TableHeader>
                    <TableHeader>Mentor</TableHeader>
                    <TableHeader>Group ID</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeams.map(team => (
                    <TeamRow
                      key={team.team_username}
                      team={team}
                      mentors={mentors}
                      isEditing={editingTeam === team.team_username}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <Users className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No teams found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterMentor ? 
                    "Try adjusting your search or filter criteria" : 
                    "No teams have been created yet"
                  }
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    Add New Team
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cdashboard;