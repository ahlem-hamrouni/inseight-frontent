import React from 'react';
import { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import  api from '../api/axios';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const[password , setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const { login, setUser } = useContext(AuthContext);
const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if(!email || !password){
      setError('Remplissez tous les champs');
      return;
    }
    setLoading(true);
    const res = await login ({email , password});
    setLoading(false);


    


    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user?.role;

      if (role === 'admin') {
        navigate('/admin/AdminDashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/TeacherDashboard');
      } else if (role === 'student') {
        navigate('/student/StudentDashboard');
      } else {
        navigate('/');
      }
      } catch  {
      setError('Identifiants invalides');
    }
  };

 return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
      
      <div className="w-full max-w-4xl bg-[#111827] rounded-lg border border-gray-800 grid grid-cols-1 md:grid-cols-2">
        
        <div className="p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-800">
          <div className="mb-4 text-3xl">🎓</div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Empower every learner with actionable inseights.
          </h1>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Monitor course engagement , quiz outcomes , and student progress in a single polished workspace.
          </p>
          <h1 className="text-xs font-bold text-gray-300 uppercase mb-3 flex items-center gap-2">
             WHY TEAMS LOVE EDUINSIGHT          </h1>

          <ul className="text-xs text-gray-400 space-y-2">
            <li>• Real-time teaching analyting</li>
            <li>• Beautiful daschboards for instructors and students </li>
            <li>• Secure authentication and modern UI</li>
          </ul>
        </div>

        <div className="p-8 flex flex-col justify-center">
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-400">Please sign in to your account</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-white placeholder-gray-600 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="........"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded bg-[#0b0f19] border border-gray-800 text-white outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              
              className="w-full py-2.5 bg-[#06b6d4] hover:bg-[#0891b2] text-black font-bold rounded text-sm mt-2 transition"
            >
              
        
              Login
      
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 underline font-medium">
              Create one
            </Link>
          </div>

        </div>

      </div>
    </div>
  );

}
export default Login;