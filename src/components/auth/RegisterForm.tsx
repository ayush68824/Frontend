import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error('You must agree to all terms');
      return;
    }
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { user, token } = await authAPI.register(
        formData.name,
        formData.email,
        formData.password
      );
      dispatch(setCredentials({ user, token }));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
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
          <h2 className="text-white text-2xl font-bold mt-6">Sign Up</h2>
          <p className="text-white text-opacity-80 mt-2 text-center">Create your account to get started!</p>
        </div>
        {/* Form/Right Side */}
        <div className="flex-1 flex flex-col justify-center p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Sign Up</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-gray-900"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
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
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] text-gray-900"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="h-4 w-4 text-[#FF5A5F] focus:ring-[#FF5A5F] border-gray-300 rounded"
              />
              <label htmlFor="agree" className="text-gray-700 text-sm">
                I agree to all terms
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-[#FF5A5F] hover:bg-[#e14c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F] transition"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <div className="text-sm text-center mt-4">
              <Link
                to="/login"
                className="font-medium text-[#FF5A5F] hover:underline"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 