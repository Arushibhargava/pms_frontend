import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Mentorsignup = () => {
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
        user_type: 'mentor'
      };

      const response = await axios.post('https://pms-backend-00j9.onrender.com/api/signup/', payload);

      setSuccess(`Signup successful! Redirecting to login...`);
      setTimeout(() => navigate('/mentor-login'), 2000);
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 to-blue-900 text-white p-4">
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Registration</h1>
          <p className="text-gray-600 mt-2">Create your team account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'team_id', label: 'Team ID', placeholder: 'e.g. Team_123' },
            { name: 'team_name', label: 'Team Name', placeholder: 'e.g. Avengers' },
            { name: 'email', label: 'Email', placeholder: 'yourteam@gmail.com', type: 'email' },
            { name: 'phone_number', label: 'Phone Number', placeholder: '10-digit number', type: 'tel' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '8 characters' },
            { name: 'confirm_password', label: 'Confirm Password', type: 'password' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type || 'text'}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/team-login')} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mentorsignup;
