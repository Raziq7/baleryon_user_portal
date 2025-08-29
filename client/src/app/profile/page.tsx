import React, { useEffect, useState } from 'react';
import api from '../../utils/baseUrl';

type User = {
  firstName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
};

type Address = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  number: string;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setUser(res.data.user);
        setAddress(res.data.address);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white px-4 py-10 transition-all">
      <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-8 p-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black dark:border-white shadow-md">
            <img
              src={user?.avatarUrl || '/profile.jpg'}
              alt="User Avatar"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold">{user?.firstName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.email}</p>
            <p className="text-gray-600 dark:text-gray-400">{user?.phone}</p>
          </div>
        </div>

        {/* Address Section */}
        <div className="border-t border-gray-300 dark:border-gray-700 px-8 py-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Shipping Address</h2>
            {address ? (
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <p><strong>{address.name}</strong></p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.number}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address saved yet.</p>
            )}
          </div>

          <div className="pt-4 text-center sm:text-left">
            <button
              className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black font-medium rounded-md hover:opacity-90 transition-all"
              onClick={() => window.location.href = '/profile/edit'}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;