import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    studentCode: '',
    level: 'L1',
    group: '',
    birthDate: '',
    speciality: '',
    office: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', { ...formData, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-lg p-6 border border-gray-800">
        <div className="text-center mb-6">
          <p className="text-cyan-400 text-xs font-bold uppercase">JOIN EDUINSIGHT</p>
          <h2 className="text-2xl font-bold">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          
          <div>
            <label className="block text-xs font-bold text-cyan-400 mb-1">I am a:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-white text-sm outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">First Name</label>
            <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Last Name</label>
            <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Phone Number (Optional)</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
          </div>

          {role === 'student' ? (
            <>
              <div>
                <label className="block text-xs text-cyan-400 mb-1">Student Code</label>
                <input type="text" name="studentCode" required value={formData.studentCode} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs text-cyan-400 mb-1">Level</label>
                <select name="level" value={formData.level} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none">
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-cyan-400 mb-1">Group</label>
                <input type="text" name="group" value={formData.group} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs text-cyan-400 mb-1">Birth Date</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs text-cyan-400 mb-1">Speciality</label>
                <input type="text" name="speciality" required value={formData.speciality} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs text-cyan-400 mb-1">Office (Optional)</label>
                <input type="text" name="office" value={formData.office} onChange={handleChange} className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-sm outline-none" />
              </div>
            </>
          )}

          <button type="submit" className="w-full py-2.5 bg-[#06b6d4] hover:bg-[#0891b2] text-black font-bold rounded text-sm mt-2 transition">
            Register as {role === 'student' ? 'Student' : 'Teacher'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          Already have an account? <Link to="/" className="text-cyan-400 underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;