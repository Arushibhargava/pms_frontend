// src/components/Login/SignupSuccess.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const SignupSuccess = () => {
  const location = useLocation();
  const team_id = location.state?.team_id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 to-black text-white p-6">
      <div className="bg-white text-black p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Signup Successful!</h1>
        <p className="text-lg">Your Team ID is:</p>
        <p className="text-2xl font-bold text-indigo-700 mt-2">{team_id}</p>
        <p className="mt-4 text-gray-600">Please save this Team ID for login and future use.</p>
      </div>
    </div>
  );
};

export default SignupSuccess;
