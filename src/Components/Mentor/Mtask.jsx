import React, { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Eye, Search, Filter, Download, Bell, User, Settings, MoreVertical, Upload, X, Check, Clock, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Mtask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('access_token'); // JWT Access token
        const response = await axios.get('https://pms-backend-00j9.onrender.com/api/mentor/tasks/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.tasks || []); // Default to empty array if tasks is undefined
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('end_date');
  const [isLoading, setIsLoading] = useState(false);

  const [newTask, setNewTask] = useState({
    doc_title: '',
    start_date: '',
    end_date: '',
    description: '',
    files: null,
  });

  const priorityColors = {
    high: 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200',
    medium: 'bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border-orange-200',
    low: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200'
  };

  const statusStyles = {
    active: { bg: 'bg-blue-500', text: 'text-blue-600', icon: Clock },
    completed: { bg: 'bg-green-500', text: 'text-green-600', icon: Check },
    overdue: { bg: 'bg-red-500', text: 'text-red-600', icon: AlertCircle },
      Pending: { bg: 'bg-yellow-500', text: 'text-yellow-600', icon: Clock }, // ✅ Add this line
  default: { bg: 'bg-gray-500', text: 'text-gray-600', icon: Clock }
    
  };

  
  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('document-title', newTask.doc_title);
    formData.append('start-date', newTask.start_date);
    formData.append('end-date', newTask.end_date);
    formData.append('description', newTask.description || '');

    // Append file (only one file based on your Django API)
    if (newTask.files && newTask.files.length > 0) {
      formData.append('file-upload', newTask.files[0]); // only the first file
    }

    try {
      const token = localStorage.getItem("access_token"); // JWT token
      const res = await fetch("http://localhost:8000/api/mentor/tasks/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Auth header
        },
        body: formData, // must be FormData, not JSON
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Task created successfully!");
        setShowAddModal(false);
        // Reset form
        setNewTask({
          doc_title: '',
          start_date: '',
          end_date: '',
          description: '',
          files: null,
        });
        // Refetch tasks
        const response = await axios.get('http://pms-backend-00j9.onrender.com/api/mentor/tasks/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data.tasks || []);
      } else {
        alert("❌ Failed to create task: " + (data.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("❌ Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.doc_title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'end_date') return new Date(a.end_date) - new Date(b.end_date);
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    }
    return (a.doc_title || '').localeCompare(b.doc_title || '');
  });

  const getTaskProgress = (task) => {
    const totalTeams = 5; // Assuming 5 teams total
    const submittedCount = task.submissions?.length || 0;
    return (submittedCount / totalTeams) * 100;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">TaskFlow</h1>
                  <p className="text-xs text-slate-500">Project Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-all duration-200 group">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700">Mentor</span>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-blue-800 bg-clip-text text-transparent">
                  Tasks Dashboard
                </h2>
                <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Active</span>
                </div>
              </div>
              <p className="text-slate-600 text-lg">Manage and track your project tasks with enhanced visibility</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Plus className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Create Task</span>
            </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <div className="group relative bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-800">{tasks.length}</p>
                    <p className="text-sm text-blue-600 font-medium">+2 this week</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Total Tasks</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-800">{tasks.filter(t => t.status === 'active').length}</p>
                    <p className="text-sm text-green-600 font-medium">85% on track</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Active Tasks</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Upload className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-800">{tasks.reduce((acc, task) => acc + task.submissions.length, 0)}</p>
                    <p className="text-sm text-blue-600 font-medium">3 pending</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Submissions</p>
              </div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-white to-orange-50/50 rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-800">
                      {Math.round(tasks.reduce((acc, task) => acc + getTaskProgress(task), 0) / tasks.length || 0)}%
                    </p>
                    <p className="text-sm text-orange-600 font-medium">↑ 12% growth</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium">Avg. Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none transition-all duration-200 w-full sm:w-64 backdrop-blur-sm"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none transition-all duration-200 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/60 border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 outline-none text-sm transition-all duration-200 backdrop-blur-sm"
              >
                <option value="end_date">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedTasks.map((task) => {
            const StatusIcon = statusStyles[task.status].icon;
            return (
              <div key={task.task_id} className="group relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${statusStyles[task.status].bg} rounded-full shadow-lg animate-pulse`}></div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority?.toLowerCase()] || priorityColors.medium}`}>
  {(task.priority || 'medium').toUpperCase()}
</div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white/60 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-3 text-lg leading-tight group-hover:text-blue-800 transition-colors">
                    {task.doc_title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-2">{task.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Progress</span>
                      <span className="font-bold text-slate-800">{getTaskProgress(task).toFixed(0)}%</span>
                    </div>
                    <div className="relative w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${getTaskProgress(task)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-6 p-3 bg-slate-50/80 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Due: {new Date(task.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold">{task.submissions.length}/5 submitted</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowSubmissionsModal(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-50 to-blue-50 text-blue-700 px-4 py-3 rounded-xl font-semibold hover:from-blue-100 hover:to-blue-100 transition-all duration-200 flex items-center justify-center space-x-2 border border-blue-200/50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Submissions</span>
                    </button>
                    
                    {task.file_upload && (
                      <button className="bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200 shadow-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No tasks found</h3>
            <p className="text-slate-600 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Enhanced Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/40">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Create New Task</h3>
                <p className="text-slate-600 mt-1">Add a new task to your project</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddTask} className="space-y-6">
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">Task Title</label>
    <input
      type="text"
      value={newTask.doc_title}
      onChange={(e) => setNewTask({...newTask, doc_title: e.target.value})}
      className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
      placeholder="Enter task title..."
      required
    />
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">Start Date</label>
      <input
        type="date"
        value={newTask.start_date}
        onChange={(e) => setNewTask({...newTask, start_date: e.target.value})}
        className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
        required
      />
    </div>
    
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">End Date</label>
      <input
        type="date"
        value={newTask.end_date}
        onChange={(e) => setNewTask({...newTask, end_date: e.target.value})}
        className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
        required
      />
    </div>
  </div>
  
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">Description</label>
    <textarea
      value={newTask.description}
      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
      rows={4}
      className="w-full px-4 py-3 bg-white/70 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 outline-none resize-none transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
      placeholder="Describe the task requirements..."
      required
    />
  </div>
  
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">Attach Files</label>
    <div className="relative">
      <input
        type="file"
        multiple
        onChange={(e) => setNewTask({...newTask, files: e.target.files})}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
      />
      <div className="w-full px-4 py-6 bg-gradient-to-br from-white/80 to-white/60 border-2 border-dashed border-blue-300 rounded-xl transition-all duration-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-white/70 backdrop-blur-sm shadow-sm hover:shadow-md cursor-pointer">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">Click to upload files</p>
            <p className="text-xs text-slate-500 mt-1">PDF, DOC, TXT, Images (Max 10MB each)</p>
          </div>
        </div>
      </div>
      {newTask.files && newTask.files.length > 0 && (
        <div className="mt-3 space-y-2">
          {Array.from(newTask.files).map((file, index) => (
            <div key={index} className="flex items-center justify-between px-3 py-2 bg-white/80 rounded-lg border border-white/40 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  
  <div className="flex space-x-4 pt-6">
    <button
      type="button"
      onClick={() => setShowAddModal(false)}
      className="flex-1 px-6 py-3 border-2 border-slate-300/80 text-slate-700 rounded-xl font-semibold hover:bg-white/60 hover:border-slate-400 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isLoading}
      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          <span>Create Task</span>
        </>
      )}
    </button>
  </div>
</form>
          </div>
        </div>
      )}

      {/* Enhanced Submissions Modal */}
      {showSubmissionsModal && selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-3xl w-full p-8 max-h-[80vh] overflow-y-auto shadow-2xl border border-white/40">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Task Submissions
                </h3>
                <p className="text-slate-600 mt-1">"{selectedTask.doc_title}"</p>
              </div>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {selectedTask.submissions.length > 0 ? (
  <div className="space-y-4">
    {selectedTask.submissions.map((submission, index) => (
      <div key={index} className="group bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {submission.team_name?.split(' ')[1]?.[0] || submission.team_name?.[0] || '?'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{submission.team_name}</h4>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-slate-600">
                  Team ID: <span className="font-semibold">{submission.team_id}</span>
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-slate-500">
                    Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-gradient-to-r from-blue-50 to-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:from-blue-100 hover:to-blue-100 transition-all duration-200 flex items-center space-x-2 border border-blue-200/50 group-hover:shadow-md">
              <Eye className="w-4 h-4" />
              <span>Review</span>
            </button>

            {submission.file_upload && (
              <a
                href={`http://127.0.0.1:8000${submission.file_upload}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold hover:bg-green-200 transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>View File</span>
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
      <Upload className="w-12 h-12 text-slate-400" />
    </div>
    <h4 className="text-xl font-bold text-slate-800 mb-3">No submissions yet</h4>
    <p className="text-slate-600">Teams haven't submitted their work for this task</p>
    <div className="mt-6 flex justify-center">
      <div className="flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
        <Clock className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium text-orange-700">Awaiting submissions</span>
      </div>
    </div>
  </div>
)}

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-600">
                    Progress: <span className="font-semibold text-slate-800">{selectedTask.submissions.length}/5 teams</span>
                  </div>
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(selectedTask.submissions.length / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mtask;