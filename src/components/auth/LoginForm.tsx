import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, token } = await authAPI.login(formData.email, formData.password);
      dispatch(setCredentials({ user, token }));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF5A5F]">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Illustration/Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[#FF5A5F] p-8">
          {/* Placeholder SVG illustration */}
          <svg width="180" height="180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="180" rx="24" fill="#fff" fillOpacity="0.2" />
            <circle cx="90" cy="90" r="60" fill="#fff" fillOpacity="0.4" />
            <rect x="60" y="60" width="60" height="60" rx="12" fill="#fff" fillOpacity="0.7" />
          </svg>
          <h2 className="text-white text-2xl font-bold mt-6">Sign In</h2>
          <p className="text-white text-opacity-80 mt-2 text-center">Welcome back! Please login to your account.</p>
        </div>
        {/* Form/Right Side */}
        <div className="flex-1 flex flex-col justify-center p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Sign In</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-gray-900"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-gray-900"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-[#FF5A5F] hover:bg-[#e14c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F] transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-sm text-center mt-4">
              <Link
                to="/register"
                className="font-medium text-[#FF5A5F] hover:underline"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 