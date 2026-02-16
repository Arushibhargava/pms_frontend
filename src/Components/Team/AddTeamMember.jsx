import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, CreditCard, GraduationCap, BookOpen, Save, CheckCircle, AlertCircle, Link } from 'lucide-react';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
const AddTeamMember = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    studentClass: '',
    branch: '',
    stuId: '',
    email: '',
    phone: '',
    semester: '',
    rollNo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
    if (!nameRegex.test(formData.name.trim())) {
      newErrors.name = "Name should start with a capital letter and contain only letters.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email must be a valid Gmail address (e.g. example@gmail.com).";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Student ID validation
    const stuIdRegex = /^[a-zA-Z0-9]{10,}$/;
    if (!stuIdRegex.test(formData.stuId.trim())) {
      newErrors.stuId = "Student ID must be at least 10 alphanumeric characters.";
    }

    // Roll No validation
    const rollNoRegex = /^[0-9]{7,}$/;
    if (!rollNoRegex.test(formData.rollNo.trim())) {
      newErrors.rollNo = "Roll No must be at least 7 digits and contain digits only.";
    }

    // Required field validation
    Object.keys(formData).forEach(key => {
      if (!formData[key].trim()) {
        newErrors[key] = "This field is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("Payload:", {
  stu_id: formData.stuId,
  member_name: formData.name,
  student_class: formData.studentClass,
  branch: formData.branch,
  semester: formData.semester,
  stu_rollno: formData.rollNo,
  phone_no: formData.phone,
  email: formData.email,
  team_id: localStorage.getItem('team_id')
});
    const response = await axios.post(
  'https://pms-backend-00j9.onrender.com/api/team/member/add/',
  {
    stu_id: formData.stuId,
    member_name: formData.name,
    student_class: formData.studentClass,
    branch: formData.branch,
    semester: formData.semester,
    stu_rollno: formData.rollNo,
    phone_no: formData.phone,
    email: formData.email,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  }
);

    console.log('Success:', response.data);
    setShowSuccess(true);
    setFormData({
      name: '',
      studentClass: '',
      branch: '',
      stuId: '',
      email: '',
      phone: '',
      semester: '',
      rollNo: ''
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    alert(error.response?.data?.error || 'Something went wrong!');
  } finally {
    setIsSubmitting(false);
    setTimeout(() => setShowSuccess(false), 2000);
  }
};

  const inputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white/50 backdrop-blur-sm";
    const errorClasses = errors[fieldName] ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-400 hover:border-gray-300";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Back Button */}
       <button
  onClick={() => navigate("/team")}
  className="absolute top-8 left-8 z-10 group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-105"
>
  <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
    <ArrowLeft className="w-6 h-6" />
  </div>
  <span className="font-medium">Back to Dashboard</span>
</button>
    

      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-8 right-8 z-20 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5" />
          <span>Team member added successfully!</span>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 shadow-2xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Add Team Member</h1>
            <p className="text-blue-200">Fill in the details to add a new member to your team</p>
          </div>
     <form onSubmit={handleSubmit}>
          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <User className="w-4 h-4 text-blue-300" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClasses('name')}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Class Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <GraduationCap className="w-4 h-4 text-blue-300" />
                    Class
                  </label>
                  <select
                    name="studentClass"
                    value={formData.studentClass}
                    onChange={handleInputChange}
                    className={inputClasses('studentClass')}
                  >
                    <option value="">Select Class</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                  {errors.studentClass && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.studentClass}
                    </p>
                  )}
                </div>

                {/* Branch Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <BookOpen className="w-4 h-4 text-blue-300" />
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className={inputClasses('branch')}
                  >
                    <option value="">Select Branch</option>
                    <option value="CS">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="CS-AI">CS with AI</option>
                  </select>
                  {errors.branch && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.branch}
                    </p>
                  )}
                </div>

                {/* Student ID Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <CreditCard className="w-4 h-4 text-blue-300" />
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="stuId"
                    value={formData.stuId}
                    onChange={handleInputChange}
                    className={inputClasses('stuId')}
                    placeholder="Enter student ID"
                  />
                  {errors.stuId && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.stuId}
                    </p>
                  )}
                </div>

                {/* Semester Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <BookOpen className="w-4 h-4 text-blue-300" />
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className={inputClasses('semester')}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">I</option>
                    <option value="2">II</option>
                    <option value="3">III</option>
                    <option value="4">IV</option>
                    <option value="5">V</option>
                    <option value="6">VI</option>
                  </select>
                  {errors.semester && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.semester}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <Mail className="w-4 h-4 text-blue-300" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClasses('email')}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <Phone className="w-4 h-4 text-blue-300" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClasses('phone')}
                    placeholder="1234567890"
                    maxLength="10"
                  />
                  {errors.phone && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Roll Number Field */}
                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <CreditCard className="w-4 h-4 text-blue-300" />
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className={inputClasses('rollNo')}
                    placeholder="Enter roll number"
                  />
                  {errors.rollNo && (
                    <p className="text-red-300 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.rollNo}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Adding Member...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Add Team Member</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
</form>
          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-200/70 text-sm">
              Make sure all information is accurate before submitting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMember;