import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Mail, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

const TeamSignup = () => {
  const [formData, setFormData] = useState({
    team_id: '',
    team_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const { team_id, team_name, email, phone_number, password, confirm_password } = formData;

    const teamIdRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const teamNameRegex = /^[A-Z][a-zA-Z\s]*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!teamIdRegex.test(team_id)) {
      setError('Team ID must be 3–20 characters, letters/numbers/underscores only.');
      return false;
    }

    if (!teamNameRegex.test(team_name)) {
      setError('Team name must start with a capital letter and contain only alphabets.');
      return false;
    }

    if (!emailRegex.test(email)) {
      setError('Email must be a valid Gmail address (e.g. example@gmail.com).');
      return false;
    }

    if (!phoneRegex.test(phone_number)) {
      setError('Phone number must be a valid 10-digit Indian number.');
      return false;
    }

    if (password.length !== 8) {
      setError('Password must be exactly 8 characters long.');
      return false;
    }

    if (password !== confirm_password) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { team_id, team_name, email, phone_number, password } = formData;

      const payload = {
        username: team_id,
        name: team_name,
        email,
        phone_number,
        password,
        user_type: 'team'
      };

      const response = await axios.post('https://pms-backend-00j9.onrender.com/api/signup/', payload);

      setSuccess(`Signup successful! Redirecting to login...`);
      setTimeout(() => navigate('/team-login'), 2000);
    } catch (err) {
      if (err.response) {
        if (err.response.data.errors) {
          const errors = Object.entries(err.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setError(errors);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="bg-white/10 backdrop-blur-lg text-white p-12 rounded-2xl shadow-xl w-full max-w-lg border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            Team
          </h1>
          <h2 className="text-2xl font-light text-blue-200 mb-4">
            Registration Portal
          </h2>
          <p className="text-blue-200/80 text-sm">
            Create your team account to access the dashboard
          </p>
        </div>

        {/* Alert messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team ID Field */}
          <div>
            <label className="block mb-3 font-medium text-blue-100 text-sm">
              TEAM IDENTIFIER
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type="text"
                name="team_id"
                value={formData.team_id}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="e.g. Team_123"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
              />
            </div>
          </div>

          {/* Team Name Field */}
          <div>
            <label className="block mb-3 font-medium text-blue-100 text-sm">
              TEAM NAME
            </label>
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type="text"
                name="team_name"
                value={formData.team_name}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="e.g. Avengers"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-3 font-medium text-blue-100 text-sm">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="yourteam@gmail.com"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block mb-3 font-medium text-blue-100 text-sm">
              PHONE NUMBER
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="10-digit number"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-3 font-medium text-blue-100 text-sm">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="8 characters"
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-blue-300 hover:text-blue-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block mb-3 font-medium text-blue-100 text-sm">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-blue-300" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-blue-300 hover:text-blue-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-10 space-y-4 text-center">
          <div className="h-px bg-blue-400/20"></div>
          <div className="space-y-3">
            <p className="text-sm text-blue-200/80">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/team-login')}
                className="text-white font-semibold hover:text-blue-200 transition-colors underline decoration-blue-400/60 hover:decoration-blue-300"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSignup;