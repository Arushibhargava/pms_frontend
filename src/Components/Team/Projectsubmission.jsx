import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Projectsubmission = () => {
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    tech_stack: ''
  });

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('access_token');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://pms-backend-00j9.onrender.com/api/project/all/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        'http://pms-backend-00j9.onrender.com/api/project/submit/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage(response.data.message);
      fetchProjects(); // Refresh list after submission
      setFormData({
        project_name: '',
        description: '',
        tech_stack: ''
      });
    } catch (err) {
      setMessage('Submission failed.');
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Submit Project</h2>
      {message && <div className="mb-4 text-blue-600 font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          name="project_name"
          value={formData.project_name}
          onChange={handleChange}
          placeholder="Project Name"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="w-full border px-4 py-2 rounded"
          rows={4}
          required
        />
        <input
          type="text"
          name="tech_stack"
          value={formData.tech_stack}
          onChange={handleChange}
          placeholder="Tech Stack (e.g. React, Django, MongoDB)"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Your Submitted Projects</h3>
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.project_id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <h4 className="text-lg font-semibold text-blue-700">{project.project_name}</h4>
                <p className="text-gray-700 mt-1">{project.description}</p>
                <p className="text-sm mt-1 text-gray-500">Tech Stack: {project.tech_stack}</p>
                <p className={`text-sm mt-1 font-medium ${project.approval === 'approved' ? 'text-green-600' : project.approval === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                  Status: {project.approval}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Projectsubmission;
