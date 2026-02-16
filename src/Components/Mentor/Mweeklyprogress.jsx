import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Target, CheckCircle, Clock, TrendingUp, Users, Award, Activity } from 'lucide-react';

const Mweeklyprogress = () => {
  const [progressData, setProgressData] = useState({});
  const [rawProgressData, setRawProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('https://pms-backend-00j9.onrender.com/api/mentor/weekly-progress/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const rawData = response.data.progress_reports;
        setRawProgressData(rawData);

        // Group by team
        const teamGrouped = {};
        rawData.forEach(entry => {
          const team = entry.team;
          if (!teamGrouped[team]) teamGrouped[team] = [];

          teamGrouped[team].push({
            week: `Week ${entry.week_number}`,
            weekNumber: entry.week_number,
            progress: entry.progress_percent,
            goalTasks: entry.goal_tasks,
            completedTasks: entry.completed_tasks,
            createdAt: entry.created_at,
            id: entry.id
          });
        });

        setProgressData(teamGrouped);
      } catch (error) {
        console.error('Error fetching weekly progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const getOverallStats = () => {
    const totalTasks = rawProgressData.reduce((sum, entry) => sum + entry.goal_tasks.length, 0);
    const completedTasks = rawProgressData.reduce((sum, entry) => sum + entry.completed_tasks.length, 0);
    const averageProgress = rawProgressData.length > 0 
      ? rawProgressData.reduce((sum, entry) => sum + entry.progress_percent, 0) / rawProgressData.length 
      : 0;
    
    return {
      totalTasks,
      completedTasks,
      averageProgress: Math.round(averageProgress),
      totalWeeks: rawProgressData.length
    };
  };

  const stats = getOverallStats();

  const openTeamModal = (teamName) => {
    setSelectedTeam(teamName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">Progress: {payload[0].value}%</p>
          <p className="text-sm text-gray-600">
            Completed: {data.completedTasks?.length || 0} / {data.goalTasks?.length || 0} tasks
          </p>
        </div>
      );
    }
    return null;
  };

  const TaskCard = ({ entry, teamName }) => {
    const completionRate = entry.goalTasks.length > 0 
      ? (entry.completedTasks.length / entry.goalTasks.length) * 100 
      : 0;

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Week {entry.weekNumber}</h3>
              <p className="text-sm text-gray-500">
                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              entry.progress >= 80 ? 'text-green-500' :
              entry.progress >= 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {entry.progress}%
            </div>
            <div className="text-sm text-gray-500">completion</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-500" />
              <h4 className="font-medium text-gray-700">Goal Tasks ({entry.goalTasks.length})</h4>
            </div>
            <div className="space-y-1">
              {entry.goalTasks.map((task, idx) => (
                <div key={idx} className={`flex items-center space-x-2 p-2 rounded-md ${
                  entry.completedTasks.includes(task) 
                    ? 'bg-green-50 border-l-4 border-green-400' 
                    : 'bg-gray-50 border-l-4 border-gray-300'
                }`}>
                  {entry.completedTasks.includes(task) ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${
                    entry.completedTasks.includes(task) 
                      ? 'text-green-700 line-through' 
                      : 'text-gray-600'
                  }`}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <h4 className="font-medium text-gray-700">Completed Tasks ({entry.completedTasks.length})</h4>
            </div>
            {entry.completedTasks.length > 0 ? (
              <div className="space-y-1">
                {entry.completedTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-2 bg-green-50 rounded-md border-l-4 border-green-400">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-700">{task}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic p-2">No tasks completed yet</div>
            )}
          </div>
        </div>

        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              entry.progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              entry.progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${entry.progress}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Weekly Team Progress Dashboard
          </h1>
          <p className="text-gray-600">Track your team's weekly goals and achievements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalTasks}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageProgress}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Weeks</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalWeeks}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {Object.keys(progressData).length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No progress data available</p>
          </div>
        ) : (
          Object.entries(progressData).map(([team, data], index) => (
            <div key={index} className="mb-8">
              {/* Team Header - Clickable */}
              <div 
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:bg-gray-50"
                onClick={() => openTeamModal(team)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                        {team}
                      </h2>
                      <p className="text-gray-500">{data.length} weeks tracked</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-3 rounded-full">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="text-blue-500 font-medium text-sm">
                      Click to view details →
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Chart - Always Visible */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="url(#colorGradient)"
                      strokeWidth={4}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#1d4ed8' }}
                      name="Progress %"
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))
        )}

        {/* Modal for Team Details */}
        {isModalOpen && selectedTeam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedTeam}</h2>
                      <p className="text-gray-500">{progressData[selectedTeam]?.length} weeks tracked</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Task Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="bg-blue-500 text-white p-2 rounded-lg">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Task Breakdown</h3>
                  </div>
                  <div className="grid gap-6">
                    {progressData[selectedTeam]?.map((entry, idx) => (
                      <TaskCard key={idx} entry={entry} teamName={selectedTeam} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mweeklyprogress;