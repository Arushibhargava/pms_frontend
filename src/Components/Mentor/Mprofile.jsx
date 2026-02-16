import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, UserCheck, Calendar, Award, Edit, Settings, Star, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mprofile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    phone_number: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await axios.get(`https://pms-backend-00j9.onrender.com/api/user-info/${username}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to load profile data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
<div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 flex items-center justify-center">        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent shadow-lg mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8 relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center flex-1">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                 Profile
              </h1>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-white">Your professional profile information</p>
          </div>
          
          {/* Empty div for balance */}
          <div className="w-24"></div>
        </div>

    
          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              {/* Name Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Full Name</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{profileData.name || 'Not available'}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Username Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Username</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">@{profileData.username || 'Not available'}</p>
                  </div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Email Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{profileData.email || 'Not available'}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Phone Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full flex items-center justify-center shadow-md">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{profileData.phone_number || 'Not available'}</p>
                  </div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 relative z-10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Profile Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-blue-600">Active</p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profile Score</p>
                    <p className="text-lg font-semibold text-indigo-600">100%</p>
                  </div>
                  <Star className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-semibold text-blue-600">2024</p>
                  </div>
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Mprofile;