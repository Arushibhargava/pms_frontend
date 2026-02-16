import React, { useState, useEffect } from 'react';
import { FileText, User, Calendar, Eye, X, Clock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Notifications = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get('https://pms-backend-00j9.onrender.com/api/notifications/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Ensure we're working with an array
        const notifications = Array.isArray(response.data?.notifications) 
          ? response.data.notifications 
          : [];

        // Safely transform the data
        const formattedReports = notifications.map(notification => {
          // Handle sender object if it exists
          const senderEmail = typeof notification.sender === 'object'
            ? notification.sender.email || notification.sender.username || "Unknown"
            : notification.sender || "Unknown";

          return {
            id: notification.id || Date.now(),
            title: notification.title || "New Notification",
            email: senderEmail,
            created_at: notification.created_at || notification.timestamp || new Date().toISOString(),
            description: typeof notification.message === 'string' 
              ? notification.message 
              : JSON.stringify(notification.message) || ""
          };
        });
        
        setReports(formattedReports);
      } catch (err) {
        console.error('❌ Notification fetch error:', err);
        toast.error('Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const username = localStorage.getItem('username') || 'receiver';
    const socket = new WebSocket(`wss://pms-backend-00j9.onrender.com/ws/notifications/${username}/`);

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        toast.info(`📨 New message from ${data.sender}: ${data.message}`, {
          position: 'top-right',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });

        // Handle sender object if it exists
        const senderEmail = typeof data.sender === 'object'
          ? data.sender.email || data.sender.username || "Unknown"
          : data.sender || "Unknown";

        setReports((prev) => [
          {
            id: data.id || Date.now(),
            title: data.title || "New Notification",
            email: senderEmail,
            created_at: data.timestamp || new Date().toISOString(),
            description: typeof data.message === 'string'
              ? data.message
              : JSON.stringify(data.message) || ""
          },
          ...prev
        ]);
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Unknown date";
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? "Invalid date" 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reports Dashboard
              </h1>
              <p className="text-gray-600 mt-1">View and manage all submitted reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <ToastContainer />
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading reports...</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="text-sm">{report.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                          <span className="text-sm">{formatDate(report.created_at)}</span>
                        </div>
                      </div>

                      <div className="text-gray-700 text-sm mb-4 line-clamp-2">
                        {report.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => openModal(report)}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Available</h3>
            <p className="text-gray-600">Reports will appear here once they are submitted.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600">
              <h2 className="text-xl font-semibold text-white">{selectedReport.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">{selectedReport.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="text-sm font-medium">{formatDate(selectedReport.created_at)}</span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="max-w-none text-gray-800 text-sm leading-relaxed space-y-3">
                  {selectedReport.description.split('\n').map((line, index) => (
                    <p key={index} className="mb-3">
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;