import { Send, Users, Bell, CheckCircle, AlertCircle, MessageSquare, Sparkles,User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mnotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    recipient: '',
    description: ''
  });

  const [recipients, setRecipients] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchTeamsForMentor = async () => {
      try {
        const res = await axios.get('https://pms-backend-00j9.onrender.com/api/mentor-teams/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setTeamData(res.data);

        // Extract unique recipients (team + coordinator)
        const memberMap = new Map();
        res.data.forEach(entry => {
          const { team, coordinator } = entry;
          if (team && !memberMap.has(team.username)) {
            memberMap.set(team.username, { ...team, role: 'team' });
          }
          if (coordinator && !memberMap.has(coordinator.username)) {
            memberMap.set(coordinator.username, { ...coordinator, role: 'coordinator' });
          }
        });

        setRecipients(Array.from(memberMap.values()));
      } catch (error) {
        console.error("Failed to fetch mentor teams:", error);
      }
    };

    fetchTeamsForMentor();

    const username = localStorage.getItem('username');
    const socket = new WebSocket(`wss://pms-backend-00j9.onrender.com/ws/notifications/${username}/`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      alert(`🔔 New notification from ${data.sender}: ${data.message}`);
    };

    socket.onclose = () => console.log("WebSocket closed");

    return () => socket.close();
  }, [accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(
        'https://pms-backend-00j9.onrender.com/api/notifications/send/',
        {
          title: formData.title,
          message: formData.description,
          receiver: formData.recipient
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        setSubmitStatus('success');
        setShowSuccess(true);
        setFormData({ title: '', recipient: '', description: '' });
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Notification failed:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-2xl animate-pulse">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Team Notification Center
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with your teams and coordinators instantly with beautiful notifications
          </p>
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 shadow-2xl transform animate-bounce">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
                <p className="text-gray-600">Your notification has been sent successfully</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Create Notification</h2>
                      <p className="text-blue-100 mt-1">Send updates to your team members</p>
                    </div>
                  </div>
                  <Sparkles className="w-8 h-8 text-white/60 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Form Fields */}
              <div className="grid gap-6">
                {/* Title */}
                <div className="space-y-3 group">
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    📝 Notification Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 text-lg"
                    placeholder="Enter an engaging title..."
                  />
                </div>

                {/* Recipient Dropdown */}
                <div className="space-y-3 group">
                  <label htmlFor="recipient" className="block text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    👥 Send To
                  </label>
                  <select
                    id="recipient"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 text-lg"
                  >
                    <option value="">Choose your recipient...</option>
                    {recipients.map((member) => (
                      <option key={member.username} value={member.username}>
                        {member.role === 'team' ? '👥' : '🎯'} {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-3 group">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    💬 Message
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 backdrop-blur-sm resize-none transition-all duration-300 hover:border-gray-300 text-lg"
                    placeholder="Craft your message here..."
                  />
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.title || !formData.recipient || !formData.description}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-8 rounded-2xl font-bold text-xl flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Send Notification</span>
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && !showSuccess && (
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl flex items-center space-x-4 animate-slideIn">
                  <div className="p-2 bg-green-500 rounded-full">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-lg">Notification sent successfully!</p>
                    <p className="text-green-600 text-sm">Your message has been delivered to the recipient</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl flex items-center space-x-4 animate-slideIn">
                  <div className="p-2 bg-red-500 rounded-full">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-red-800 font-bold text-lg">Failed to send notification</p>
                    <p className="text-red-600 text-sm">Please try again in a moment</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Team Overview */}
          <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Your Teams
              </h3>
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {teamData.length} Teams
              </div>
            </div>
            
            <div className="grid gap-4">
              {teamData.map(({ team, coordinator }, index) => (
                <div 
                  key={team.username} 
                  className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">{team.name}</div>
                        <div className="text-sm text-gray-500">@{team.username}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700 flex items-center justify-end">
                        <User className="w-4 h-4 mr-1 text-blue-500" />
                        {coordinator?.name || 'No Coordinator'}
                      </div>
                      <div className="text-xs text-gray-500">{coordinator?.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mnotification;