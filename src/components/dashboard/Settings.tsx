import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import MainLayout from '../layout/MainLayout';
import { toast } from 'react-toastify';
// import { updateProfile } from '../../services/api'; // To be implemented
import { setCredentials } from '../../store/slices/authSlice';

const Settings: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Placeholder: updateProfile should be implemented in the API
      // const updated = await updateProfile(formData, token);
      // dispatch(setCredentials({ user: updated, token }));
      dispatch(setCredentials({
        user: {
          id: user?.id || '',
          name: formData.name,
          email: formData.email,
          avatar: formData.avatar,
          createdAt: user?.createdAt || '',
          updatedAt: user?.updatedAt || '',
        },
        token: token!
      }));
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-4">
          {avatarPreview && (
            <img src={avatarPreview} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#FF5A5F] file:text-white hover:file:bg-[#e14c4f]"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md text-white font-semibold bg-[#FF5A5F] hover:bg-[#e14c4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F] transition"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </MainLayout>
  );
};

export default Settings; 