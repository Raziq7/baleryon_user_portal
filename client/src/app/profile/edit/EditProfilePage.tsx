import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // replaces next/navigation
import api from '../../../utils/baseUrl';

const EditProfilePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate(); // replaces useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const { firstName, phone, gender } = res.data.user;
        setFormData({
          name: firstName,
          phone: phone || '',
          gender: gender || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await api.put('/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Profile updated successfully!');
      navigate('/profile'); // replaces router.push('/profile')
    } catch (error) {
      console.error('Update failed:', error);
      alert('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded hover:opacity-90"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
