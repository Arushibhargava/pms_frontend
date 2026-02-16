import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Upload,
  Edit3,
  Save,
  X,
  Star,
  Users,
  Trophy,
  Sparkles,
  BarChart3,
  Search,
  ChevronDown
} from 'lucide-react';

const Mmarks = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [editingCell, setEditingCell] = useState(null);
  const [tempMarks, setTempMarks] = useState({});
  const [submitLoading, setSubmitLoading] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://pms-backend-00j9.onrender.com/api/mentor/marks/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }

        const data = await response.json();
        const teamsData = data.teams || [];

        const teamsWithSafeMembers = teamsData.map(team => ({
          ...team,
          members: Array.isArray(team.members) ? team.members : [],
        }));

        setTeams(teamsWithSafeMembers);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 95) return 'text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200';
    if (percentage >= 90) return 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100';
    if (percentage >= 80) return 'text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100';
    if (percentage >= 70) return 'text-cyan-600 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100';
    if (percentage >= 60) return 'text-teal-600 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100';
    return 'text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
  };

  const getGradeBadge = (percentage) => {
    const grade = calculateGrade(percentage);
    const icons = {
      'A+': '🏆',
      'A': '⭐',
      'B': '👍',
      'C': '📈',
      'D': '📊',
      'F': '❌'
    };
    return { grade, icon: icons[grade] };
  };

  const handleMarksChange = (studentId, value) => {
    setTempMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const submitMarks = async (teamUsername, studentId) => {
    const marksValue = tempMarks[studentId];
    if (!marksValue || isNaN(marksValue)) {
      setNotification('Please enter valid marks');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    setSubmitLoading(studentId);

    try {
      const token = localStorage.getItem('access_token');
      const body = {
        [`mentor_marks_${studentId}`]: parseInt(marksValue),
      };

      const response = await fetch(`http://pms-backend-00j9.onrender.com/api/marks/update/mentor/${teamUsername}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to update marks');
      }

      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.team_username === teamUsername
            ? {
                ...team,
                members: (team.members || []).map(member =>
                  member.stu_rollno === studentId
                    ? {
                        ...member,
                        mentor_marks: parseInt(marksValue),
                        percentage: (parseInt(marksValue) + member.coordinator_marks) / 2,
                        grade: calculateGrade((parseInt(marksValue) + member.coordinator_marks) / 2)
                      }
                    : member
                )
              }
            : team
        )
      );

      setTempMarks(prev => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
      setEditingCell(null);
      setNotification('✨ Marks updated successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error('Failed to update marks:', err);
      setNotification('Failed to update marks. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setSubmitLoading(null);
    }
  };

  const calculateTeamStats = (members) => {
    const mentorMarks = members.reduce((sum, member) => sum + (member.mentor_marks || 0), 0);
    const coordinatorMarks = members.reduce((sum, member) => sum + (member.coordinator_marks || 0), 0);
    const totalMarks = members.reduce((sum, member) => sum + (member.percentage || 0), 0);
    const average = totalMarks / members.length;
    const highest = Math.max(...members.map(m => m.percentage || 0));
    const lowest = Math.min(...members.map(m => m.percentage || 0));
    return { 
      average: average.toFixed(1), 
      highest, 
      lowest, 
      total: members.length,
      mentorMarks: (mentorMarks / members.length).toFixed(1),
      coordinatorMarks: (coordinatorMarks / members.length).toFixed(1)
    };
  };

  const calculateOverallStats = () => {
    const allMembers = teams.flatMap(team => team.members);
    const totalMarks = allMembers.reduce((sum, member) => sum + (member.percentage || 0), 0);
    const average = totalMarks / allMembers.length;
    const topPerformers = allMembers.filter(m => (m.percentage || 0) >= 90).length;
    const totalStudents = allMembers.length;
    return { 
      average: average.toFixed(1), 
      topPerformers, 
      totalStudents, 
      totalTeams: teams.length 
    };
  };

  const filteredTeams = Array.isArray(teams)
    ? teams.filter(team => {
        const matchesSearch = searchTerm === '' ||
          team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (team.members ?? []).some(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.stu_rollno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesTeamFilter = selectedTeam === 'all' || team.team_username === selectedTeam;

        return matchesSearch && matchesTeamFilter;
      })
    : [];

  const overallStats = calculateOverallStats();

  if (loading && teams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent shadow-lg mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading mentor marks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Floating Header */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Main Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-2xl">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Mentor Marks Dashboard
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Evaluate and manage student performance with our comprehensive marking system
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{overallStats.totalStudents}</h3>
                <p className="text-gray-600">Total Students</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{overallStats.average}%</h3>
                <p className="text-gray-600">Average Score</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{overallStats.topPerformers}</h3>
                <p className="text-gray-600">Top Performers</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{overallStats.totalTeams}</h3>
                <p className="text-gray-600">Active Teams</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, roll number, or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative w-full md:w-64">
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Teams</option>
                  {teams.map((team, idx) => (
                    <option key={idx} value={team.team_username}>{team.team_name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        {/* Notification */}
        {notification && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-blue-800 shadow-lg animate-bounce">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 mr-3" />
              <span className="text-lg font-medium">{notification}</span>
            </div>
          </div>
        )}

        {/* Teams Grid */}
        <div className="space-y-8">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team, teamIndex) => {
              const stats = calculateTeamStats(team.members);
              return (
                <div 
                  key={team.team_username} 
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl border border-white/20"
                >
                  {/* Team Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold mb-2">{team.team_name}</h2>
                            <p className="text-white/80 text-lg">{stats.total} team members</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl mb-2">🚀</div>
                          <div className="text-sm text-white/80">Team #{teamIndex + 1}</div>
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                          <div className="text-3xl font-bold mb-1">{stats.average}%</div>
                          <div className="text-white/80 text-sm">Average Score</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                          <div className="text-3xl font-bold mb-1">{stats.highest}%</div>
                          <div className="text-white/80 text-sm">Top Score</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                          <div className="text-3xl font-bold mb-1">{stats.lowest}%</div>
                          <div className="text-white/80 text-sm">Min Score</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Members Table */}
                  <div className="p-8">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Student</th>
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Roll No</th>
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Email</th>
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Mentor Marks</th>
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Percentage</th>
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Grade</th>
                            <th className="text-left py-6 px-4 font-bold text-gray-700 text-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.members.map((member, index) => {
                            const gradeBadge = getGradeBadge(member.percentage || 0);
                            return (
                              <tr key={member.stu_rollno} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                                <td className="py-6 px-4">
                                  <div className="flex items-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                      <span className="font-bold text-gray-800 text-lg">{member.name}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-6 px-4">
                                  <span className="font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                    {member.stu_rollno}
                                  </span>
                                </td>
                                <td className="py-6 px-4 text-gray-600">{member.email}</td>
                                <td className="py-6 px-4">
                                  {editingCell === member.stu_rollno ? (
                                    <div className="flex items-center space-x-3">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={tempMarks[member.stu_rollno] || member.mentor_marks || 0}
                                        onChange={(e) => handleMarksChange(member.stu_rollno, e.target.value)}
                                        className="w-20 px-3 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => submitMarks(team.team_username, member.stu_rollno)}
                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                        disabled={submitLoading === member.stu_rollno}
                                      >
                                        {submitLoading === member.stu_rollno ? (
                                          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Save className="w-5 h-5" />
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingCell(null);
                                          setTempMarks(prev => {
                                            const newState = { ...prev };
                                            delete newState[member.stu_rollno];
                                            return newState;
                                          });
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-3">
                                      <div className={`px-4 py-2 rounded-2xl border-2 ${getGradeColor(member.mentor_marks || 0)} font-bold text-lg shadow-sm`}>
                                        {member.mentor_marks || 'N/A'}
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="py-6 px-4">
                                  <div className={`px-4 py-2 rounded-2xl border-2 ${getGradeColor(member.percentage || 0)} font-bold text-lg shadow-sm`}>
                                    {(member.percentage || 0).toFixed(1)}%
                                  </div>
                                </td>
                                <td className="py-6 px-4">
                                  <div className={`inline-flex items-center px-3 py-2 rounded-2xl border-2 ${getGradeColor(member.percentage || 0)} font-bold shadow-sm`}>
                                    <span className="mr-2 text-lg">{gradeBadge.icon}</span>
                                    <span>{gradeBadge.grade}</span>
                                  </div>
                                </td>
                                <td className="py-6 px-4">
                                  <button
                                    onClick={() => {
                                      setEditingCell(member.stu_rollno);
                                      setTempMarks(prev => ({
                                        ...prev,
                                        [member.stu_rollno]: member.mentor_marks || 0
                                      }));
                                    }}
                                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
                                    disabled={editingCell !== null && editingCell !== member.stu_rollno}
                                  >
                                    <Edit3 className="w-5 h-5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No teams found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? "No teams match your search criteria. Try a different search term."
                  : "There are currently no teams available. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mmarks;