import React, { useState, useEffect } from 'react';

const Cmarks = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [editingCell, setEditingCell] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [tempMarks, setTempMarks] = useState({});
  const [submitLoading, setSubmitLoading] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://pms-backend-00j9.onrender.com/api/coordinator/marks/', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
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

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800 border-green-200',
      'A': 'bg-blue-100 text-blue-800 border-blue-200',
      'B': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'C': 'bg-orange-100 text-orange-800 border-orange-200',
      'D': 'bg-red-100 text-red-800 border-red-200',
      'F': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[grade] || colors['F'];
  };

  const handleMarksChange = (studentId, value) => {
    setTempMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const submitMarks = async (teamUsername, studentId) => {
    const marksValue = tempMarks[studentId];
    if (!marksValue || isNaN(marksValue)) {
      alert('Please enter valid marks');
      return;
    }

    setSubmitLoading(studentId);

    try {
      const token = localStorage.getItem('access_token');
      const body = {
        [`coordinator_marks_${studentId}`]: parseInt(marksValue),
      };
      
      const response = await fetch(`http://pms-backend-00j9.onrender.com/api/coordinator/marks/update/${teamUsername}/`, {
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

      // Update local state after successful API call
      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.team_username === teamUsername
            ? {
                ...team,
                members: (team.members || []).map(member =>
                  member.stu_rollno === studentId
                    ? {
                        ...member,
                        coordinator_marks: parseInt(marksValue),
                        percentage: (member.mentor_marks + parseInt(marksValue)) / 2,
                        grade: calculateGrade((member.mentor_marks + parseInt(marksValue)) / 2),
                      }
                    : member
                ),
              }
            : team
        )
      );

      // Clear temp state
      setTempMarks(prev => {
        const newState = {...prev};
        delete newState[studentId];
        return newState;
      });
      setEditingCell(null);
    } catch (err) {
      console.error('Failed to update marks:', err);
      alert('Failed to update marks. Please try again.');
    } finally {
      setSubmitLoading(null);
    }
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

  // Calculate stats for display
  const totalStudents = teams.reduce((acc, team) => acc + team.members.length, 0);
  const avgPercentage = teams.length > 0 ? teams.reduce((acc, team) => {
    const teamAvg = team.members.length > 0 ? team.members.reduce((sum, member) => sum + (member.percentage || 0), 0) / team.members.length : 0;
    return acc + teamAvg;
  }, 0) / teams.length : 0;
  const aPlusStudents = teams.reduce((acc, team) => acc + team.members.filter(m => m.grade === 'A+').length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">Loading teams...</p>
              <p className="text-gray-500 mt-2">Please wait while we fetch the data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Coordinator Marks</h1>
              <p className="text-gray-600 mt-1">Manage and track student performance</p>
            </div>
          </div>

          {/* Stats Overview */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Teams</p>
                    <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{avgPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">A+ Students</p>
                    <p className="text-2xl font-bold text-gray-900">{aPlusStudents}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white min-w-48"
              >
                <option value="all">All Teams</option>
                {teams.map((team, idx) => (
                  <option key={idx} value={team.team_username}>{team.team_name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-8">
          {filteredTeams.map((team) => {
            const teamAvg = team.members.length > 0 ? team.members.reduce((sum, member) => sum + (member.percentage || 0), 0) / team.members.length : 0;
            
            return (
              <div key={team.team_username} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{team.team_name}</h2>
                        <p className="text-blue-100">{team.members.length} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-100">Team Average</p>
                      <p className="text-xl font-bold text-white">{teamAvg.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Roll No</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Mentor Marks</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Coordinator Marks</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Percentage</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Grade</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {team.members.map((member, index) => (
                        <tr key={member.stu_rollno} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-full">
                              {member.stu_rollno}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                {member.mentor_marks}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {editingCell === member.stu_rollno ? (
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  defaultValue={member.coordinator_marks}
                                  onChange={(e) => handleMarksChange(member.stu_rollno, e.target.value)}
                                  className="w-20 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                                {member.coordinator_marks}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">
                                  {(member.percentage || 0).toFixed(1)}%
                                </div>
                                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(member.percentage || 0, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(member.grade)}`}>
                              {member.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {editingCell === member.stu_rollno ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingCell(null);
                                    setTempMarks(prev => {
                                      const newState = {...prev};
                                      delete newState[member.stu_rollno];
                                      return newState;
                                    });
                                  }}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => submitMarks(team.team_username, member.stu_rollno)}
                                  disabled={submitLoading === member.stu_rollno}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                                >
                                  {submitLoading === member.stu_rollno ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Saving...
                                    </>
                                  ) : (
                                    'Save'
                                  )}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingCell(member.stu_rollno)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTeams.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cmarks;