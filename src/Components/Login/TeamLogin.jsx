import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const TeamLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    team_id: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { team_id, password } = formData;

      const payload = {
        username: team_id,
        password,
        user_type: 'team'
      };

      const res = await axios.post('https://pms-backend-00j9.onrender.com/api/login/', payload);

      const { access, refresh, username, user_type } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("user_type", user_type);

      setSuccess("Login successful");
      setError('');

      navigate("/team");

    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
      setSuccess('');
    } finally {
      setIsLoading(false);
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
            Login Portal
          </h2>
          <p className="text-blue-200/80 text-sm">
            Access your team dashboard
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
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
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
                  placeholder="Enter your team identifier"
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
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm text-white placeholder-blue-200/70 transition-all duration-200"
                  placeholder="Enter your secure password"
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      <span>Access Dashboard</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-10 space-y-4 text-center">
          <div className="h-px bg-blue-400/20"></div>
          <div className="space-y-3">
            <p className="text-sm text-blue-200/80">
              Don't have an account?{' '}
              <a 
                href="/team-signup" 
                className="text-white font-semibold hover:text-blue-200 transition-colors underline decoration-blue-400/60 hover:decoration-blue-300"
              >
                Sign Up
              </a>
            </p>
            <p className="text-sm">
              <a 
                href="/forgot-password" 
                className="text-blue-200/80 hover:text-white transition-colors underline decoration-blue-400/40 hover:decoration-blue-300"
              >
                Forgot your password?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;