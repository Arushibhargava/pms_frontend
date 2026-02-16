import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [uploadFiles, setUploadFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('https://pms-backend-00j9.onrender.com/api/team-tasks/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handle file selection
  const handleFileChange = (taskId, file) => {
    setUploadFiles((prev) => ({
      ...prev,
      [taskId]: file
    }));
    setUploadStatus((prev) => ({
      ...prev,
      [taskId]: null
    }));
  };

  // Handle upload
 const handleUpload = async (taskId) => {
  const file = uploadFiles[taskId];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file_upload', file); // Exactly matches backend expectation

  try {
    const response = await axios.post(
      `https://pms-backend-00j9.onrender.com/api/team-tasks/upload/${taskId}/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          // No Content-Type header - let browser set it automatically
        }
      }
    );
    
    if (response.status === 201) {
      alert('File uploaded!');
      // Refresh your task list here
    }
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    alert(`Upload failed: ${error.response?.data?.error || 'Server error'}`);
  }
};

  // Status Icons & Badges
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';
    switch (status) {
      case 'completed':
        return `${base} bg-green-100 text-green-800`;
      case 'in-progress':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'overdue':
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks Dashboard</h1>
              <p className="text-gray-600">Manage and track your team tasks</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.task_id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-900">{task.doc_title}</h3>
                      {getStatusIcon(task.status)}
                      <span className={getStatusBadge(task.status)}>{task.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <div className="text-sm font-medium text-indigo-700">{task.start_date}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                    <div className="text-sm font-medium text-purple-700">{task.end_date}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Attachment</p>
                    {task.upload_file ? (
                     <a
  href={`https://pms-backend-00j9.onrender.com/${task.upload_file}`}  // ✅ Fix here
  target="_blank"
  rel="noopener noreferrer"
>


                       
                        View File
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No file</span>
                    )}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Upload your solution</p>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(task.task_id, e.target.files[0])}
                        className="text-sm"
                        disabled={uploading[task.task_id]}
                      />
                      <button
                        onClick={() => handleUpload(task.task_id)}
                        disabled={!uploadFiles[task.task_id] || uploading[task.task_id]}
                        className={`px-4 py-1.5 rounded flex items-center ${
                          uploading[task.task_id] 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                      >
                        {uploading[task.task_id] ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </>
                        )}
                      </button>
                    </div>
                    {uploadStatus[task.task_id] && (
                      <div className={`text-sm ${
                        uploadStatus[task.task_id].type === 'success' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}
                      >
                        {uploadStatus[task.task_id].message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 mt-10">No tasks assigned yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;