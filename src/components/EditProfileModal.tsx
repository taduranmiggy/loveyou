import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/authApi';
import { pillsApi } from '../services/pillsApi';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onProfileUpdated }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pillTypes, setPillTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nickname: '',
    pillType: '',
    cycleLength: 28
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        pillType: user.pillType || '',
        cycleLength: user.cycleLength || 28
      });
    }
    fetchPillTypes();
  }, [user, isOpen]);

  const fetchPillTypes = async () => {
    try {
      const result = await pillsApi.getPillTypes();
      setPillTypes(result);
    } catch (error) {
      // Fallback pill types
      setPillTypes([
        { id: '1', name: 'Diane-35', type: 'Combined Oral Contraceptive' },
        { id: '2', name: 'Althea', type: 'Combined Oral Contraceptive' },
        { id: '3', name: 'Yasmin', type: 'Combined Oral Contraceptive' },
        { id: '4', name: 'Marvelon', type: 'Combined Oral Contraceptive' },
        { id: '5', name: 'Levora', type: 'Combined Oral Contraceptive' },
        { id: '6', name: 'Microgestin', type: 'Combined Oral Contraceptive' },
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cycleLength' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.nickname.trim()) {
        toast.error('Please enter a nickname');
        setLoading(false);
        return;
      }

      if (!formData.pillType) {
        toast.error('Please select a pill type');
        setLoading(false);
        return;
      }

      if (formData.cycleLength < 21 || formData.cycleLength > 35) {
        toast.error('Cycle length must be between 21 and 35 days');
        setLoading(false);
        return;
      }

      // Update user profile
      await authApi.updateProfile({
        nickname: formData.nickname.trim(),
        pillType: formData.pillType,
        cycleLength: formData.cycleLength
      });

      // Update AuthContext
      if (user && updateUser) {
        updateUser({
          ...user,
          nickname: formData.nickname.trim(),
          pillType: formData.pillType,
          cycleLength: formData.cycleLength
        });
      }
      toast.success('Profile updated successfully! 💕');
      onProfileUpdated?.();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Connection error. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Nickname */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Nickname 💕
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="Enter your nickname"
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 bg-pink-50/50 transition-colors"
                  />
                </div>

                {/* Pill Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pill Type 💊
                  </label>
                  <select
                    name="pillType"
                    value={formData.pillType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 bg-pink-50/50 appearance-none cursor-pointer transition-colors"
                  >
                    <option value="">Select your pill type</option>
                    {pillTypes.map((pill) => (
                      <option key={pill.id} value={pill.name || pill.id}>
                        {pill.name || pill.id} - {pill.type || 'Combined Oral Contraceptive'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cycle Length */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cycle Length: <span className="text-pink-500">{formData.cycleLength} days</span>
                  </label>
                  <input
                    type="range"
                    name="cycleLength"
                    min="21"
                    max="35"
                    value={formData.cycleLength}
                    onChange={handleChange}
                    className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>21 days</span>
                    <span>35 days</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
                  <p className="font-medium mb-1">💜 Cycle Information</p>
                  <p>Most contraceptive pills follow a 28-day cycle (21 active + 7 inactive). Adjust based on your specific pill.</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
