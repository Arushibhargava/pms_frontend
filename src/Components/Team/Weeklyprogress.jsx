import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Calendar, Target, CheckCircle, Clock, X, ChevronRight } from 'lucide-react';

const Weeklyprogress = () => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [progressList, setProgressList] = useState([]);
  const [weekNumber, setWeekNumber] = useState('');
  const [goalTasks, setGoalTasks] = useState('');
  const [completedTasks, setCompletedTasks] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Fetch Weekly Progress Data
  const fetchProgress = async () => {
    try {
      const response = await axios.get('https://pms-backend-00j9.onrender.com/api/weekly-progress/', { headers });
      if (Array.isArray(response.data)) {
        setProgressList(response.data);
      } else {
        setProgressList([]);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressList([]);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  // Submit Weekly Goal (POST)
  const submitWeeklyGoal = async () => {
    if (!weekNumber || !goalTasks) return alert("Week number and goal tasks are required");
    setLoading(true);
    try {
      const response = await axios.post(
        'https://pms-backend-00j9.onrender.com/api/weekly-progress/create/',
        {
          week_number: parseInt(weekNumber),
          goal_tasks: goalTasks.split(',').map(task => task.trim())
        },
        { headers }
      );
      alert('Weekly goal submitted!');
      fetchProgress();
    } catch (error) {
      alert('Error submitting weekly goal: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Update Completed Tasks (PATCH)
  const updateCompletedTasks = async () => {
    if (!weekNumber || !completedTasks) return alert("Week number and completed tasks are required");
    setLoading(true);
    try {
      const response = await axios.patch(
        'https://pms-backend-00j9.onrender.com/api/weekly-progress/update/',
        {
          week_number: parseInt(weekNumber),
          completed_tasks: completedTasks.split(',').map(task => task.trim())
        },
        { headers }
      );
      alert('Progress updated!');
      fetchProgress();
    } catch (error) {
      alert('Error updating progress: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Open details modal
  const openWeekDetails = (week) => {
    setSelectedWeek(week);
    setShowDetailsModal(true);
  };

  // Close details modal
  const closeWeekDetails = () => {
    setShowDetailsModal(false);
    setSelectedWeek(null);
  };

  // Calculate stats for dashboard
  const totalWeeks = progressList.length;
  const averageProgress = totalWeeks > 0 ? 
    progressList.reduce((sum, week) => sum + week.progress_percent, 0) / totalWeeks : 0;
  const currentWeek = progressList.length > 0 ? 
    Math.max(...progressList.map(week => week.week_number)) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">Week {label}</p>
          <p className="text-blue-600">Progress: {payload[0].value}%</p>
          <p className="text-sm text-gray-600">
            Completed: {data.completed_tasks?.length || 0} / {data.goal_tasks?.length || 0} tasks
          </p>
        </div>
      );
    }
    return null;
  };

  const TaskCard = ({ week }) => {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Week {week.week_number}</h3>
              <p className="text-sm text-gray-500">
                {new Date(week.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                week.progress_percent >= 80 ? 'text-green-500' :
                week.progress_percent >= 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {week.progress_percent}%
              </div>
              <div className="text-sm text-gray-500">completion</div>
            </div>
            <button 
              onClick={() => openWeekDetails(week)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="View details"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              week.progress_percent >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              week.progress_percent >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${week.progress_percent}%` }}
          />
        </div>
      </div>
    );
  };

  const WeekDetailsModal = ({ week, onClose }) => {
    if (!week) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              Week {week.week_number} Details
            </h3>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium text-gray-700">Goal Tasks ({week.goal_tasks.length})</h4>
                </div>
                <div className="space-y-2">
                  {week.goal_tasks.map((task, idx) => (
                    <div key={idx} className={`flex items-start space-x-3 p-3 rounded-md ${
                      week.completed_tasks.includes(task) 
                        ? 'bg-green-50 border-l-4 border-green-400' 
                        : 'bg-gray-50 border-l-4 border-gray-300'
                    }`}>
                      {week.completed_tasks.includes(task) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        week.completed_tasks.includes(task) 
                          ? 'text-green-700 line-through' 
                          : 'text-gray-600'
                      }`}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium text-gray-700">Completed Tasks ({week.completed_tasks.length})</h4>
                </div>
                {week.completed_tasks.length > 0 ? (
                  <div className="space-y-2">
                    {week.completed_tasks.map((task, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-md border-l-4 border-green-400">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-700">{task}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md">
                    No tasks completed yet
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Progress Summary</h4>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                  <span className={`text-lg font-bold ${
                    week.progress_percent >= 80 ? 'text-green-500' :
                    week.progress_percent >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {week.progress_percent}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      week.progress_percent >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      week.progress_percent >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${week.progress_percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Weekly Progress Tracker
            </h1>
            <p className="text-blue-600/80 mt-2">Track your goals and monitor your weekly achievements</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Weeks</p>
                <p className="text-2xl font-bold text-blue-700">{totalWeeks}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average Progress</p>
                <p className="text-2xl font-bold text-green-700">{averageProgress.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Current Week</p>
                <p className="text-2xl font-bold text-blue-700">{currentWeek}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Weekly Goals</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Week Number</label>
                <input
                  type="number"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  placeholder="Enter week number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Goal Tasks</label>
                <input
                  type="text"
                  value={goalTasks}
                  onChange={(e) => setGoalTasks(e.target.value)}
                  placeholder="Task 1, Task 2, Task 3..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Completed Tasks</label>
                <input
                  type="text"
                  value={completedTasks}
                  onChange={(e) => setCompletedTasks(e.target.value)}
                  placeholder="Task 1, Task 2..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={submitWeeklyGoal}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Submit Weekly Goal
                  </>
                )}
              </button>

              <button
                onClick={updateCompletedTasks}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Update Progress
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Line Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Weekly Progress Overview</h2>
          </div>

          {Array.isArray(progressList) && progressList.length > 0 ? (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 mb-8">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={progressList}>
                    <XAxis 
                      dataKey="week_number" 
                      label={{ value: "Week", position: "insideBottom", offset: -5 }}
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tickFormatter={(val) => `${val}%`}
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                    />
                    <Line
                      type="monotone"
                      dataKey="progress_percent"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={{ r: 8, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 10, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Task Cards Section */}
              <div className="mt-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Weekly Task Details</h2>
                </div>

                <div className="space-y-6">
                  {progressList.map((week, index) => (
                    <TaskCard key={index} week={week} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data Yet</h3>
              <p className="text-gray-500">Start by adding your first weekly goal to see your progress chart.</p>
            </div>
          )}
        </div>
      </div>

      {/* Week Details Modal */}
      {showDetailsModal && (
        <WeekDetailsModal 
          week={selectedWeek} 
          onClose={closeWeekDetails} 
        />
      )}
    </div>
  );
};

export default Weeklyprogress;