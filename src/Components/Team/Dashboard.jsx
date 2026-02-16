import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, CreditCard, GraduationCap, BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('https://pms-backend-00j9.onrender.com/api/team/dashboard/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => setTeamMembers(res.data))
    .catch((err) => {
      console.error("Failed to fetch team members", err);
      if (err.response.status === 401) navigate('/login');
    });
  }, [navigate]);

  // The rest of your design stays the same — just replace the dummy data with `teamMembers`
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                👥 Team Members
              </h1>
              <p className="text-gray-600 text-lg">Manage your team and track member information</p>
            </div>
          <Link to="/team/add-member">
  <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
    Create New Member
  </button>
</Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(teamMembers.map(m => m.class)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                    {member.avatar}
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <p className="text-white/80 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {member.branch}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Semester</p>
                    <p className="text-lg font-semibold text-gray-900">{member.semester}th</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Class</p>
                    <p className="text-lg font-semibold text-gray-900">{member.class}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Roll Number</p>
                      <p className="font-medium text-gray-900">{member.rollNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 truncate">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{member.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 group">
                    <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Edit
                  </button>
                  <button className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 group">
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for when adding more cards */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200">
            <Plus className="w-4 h-4" />
            <span>Add more team members to see them here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;