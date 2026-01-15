'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, Edit2, Save, X, User, AlertCircle, Lock, Mail } from 'lucide-react';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    subject: '',
    message: '',
    recipientFilter: 'all'
  });
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/');
      return;
    }
    
    if (!adminEmails.includes(session.user.email)) {
      alert('⛔ You do not have admin access');
      router.push('/');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session && adminEmails.includes(session.user.email)) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users');
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({
      ...user,
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt).toISOString().slice(0, 16) : '',
      subscriptionExpiresAt: user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toISOString().slice(0, 16) : ''
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser._id,
          updates: {
            name: editingUser.name,
            subscriptionStatus: editingUser.subscriptionStatus,
            isOnTrial: editingUser.isOnTrial,
            trialEndsAt: editingUser.trialEndsAt || null,
            subscriptionExpiresAt: editingUser.subscriptionExpiresAt || null
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('✓ User updated successfully!');
        setEditingUser(null);
        fetchUsers();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementData.subject || !announcementData.message) {
      alert('Пополнете наслов и порака');
      return;
    }

    if (!confirm(`Испрати емаил до ${announcementData.recipientFilter === 'all' ? 'сите' : announcementData.recipientFilter} корисници?`)) {
      return;
    }
  
    try {
      setSendingAnnouncement(true);
      const response = await fetch('/api/admin/send-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData)
      });
    
      const data = await response.json();
    
      if (response.ok) {
        alert(`✓ Емаил испратен до ${data.sentCount} корисници! Неуспешни: ${data.failedCount}`);
        setShowAnnouncementModal(false);
        setAnnouncementData({ subject: '', message: '', recipientFilter: 'all' });
      } else {
        alert('Грешка: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Неуспешно испраќање');
    } finally {
      setSendingAnnouncement(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (date) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Loading auth check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null; // Will redirect
  }

  // Not authorized
  if (!adminEmails.includes(session.user.email)) {
    return null; // Will redirect
  }

  // Loading users
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-xl font-bold">Error Loading Users</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage user subscriptions and trial periods</p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Mail size={16} />
                Испрати известување
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.subscriptionStatus === 'pro' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscriptionStatus === 'pro' ? '⭐ Pro' : '🆓 Basic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isOnTrial ? (
                        <div>
                          <div className="text-sm text-green-600 font-medium">✓ On Trial</div>
                          <div className="text-xs text-gray-500">
                            Ends: {formatDate(user.trialEndsAt)}
                          </div>
                          {getDaysRemaining(user.trialEndsAt) !== null && (
                            <div className="text-xs text-gray-500">
                              ({getDaysRemaining(user.trialEndsAt)} days left)
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No trial</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.subscriptionExpiresAt ? (
                        <div>
                          <div className="text-sm text-gray-900">{formatDate(user.subscriptionExpiresAt)}</div>
                          {getDaysRemaining(user.subscriptionExpiresAt) !== null && (
                            <div className="text-xs text-gray-500">
                              ({getDaysRemaining(user.subscriptionExpiresAt)} days left)
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {/* Total Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Status</label>
                  <select
                    value={editingUser.subscriptionStatus}
                    onChange={(e) => setEditingUser({...editingUser, subscriptionStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.isOnTrial}
                      onChange={(e) => setEditingUser({...editingUser, isOnTrial: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Is on trial</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trial Ends At</label>
                  <input
                    type="datetime-local"
                    value={editingUser.trialEndsAt}
                    onChange={(e) => setEditingUser({...editingUser, trialEndsAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Expires At</label>
                  <input
                    type="datetime-local"
                    value={editingUser.subscriptionExpiresAt}
                    onChange={(e) => setEditingUser({...editingUser, subscriptionExpiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        const date = new Date();
                        date.setMonth(date.getMonth() + 1);
                        setEditingUser({
                          ...editingUser,
                          subscriptionStatus: 'pro',
                          isOnTrial: false,
                          subscriptionExpiresAt: date.toISOString().slice(0, 16)
                        });
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Set Pro (1 month)
                    </button>
                    <button
                      onClick={() => {
                        const date = new Date();
                        date.setMonth(date.getMonth() + 3);
                        setEditingUser({
                          ...editingUser,
                          subscriptionStatus: 'pro',
                          isOnTrial: false,
                          subscriptionExpiresAt: date.toISOString().slice(0, 16)
                        });
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Set Pro (3 months)
                    </button>
                    <button
                      onClick={() => {
                        const date = new Date();
                        date.setFullYear(date.getFullYear() + 1);
                        setEditingUser({
                          ...editingUser,
                          subscriptionStatus: 'pro',
                          isOnTrial: false,
                          subscriptionExpiresAt: date.toISOString().slice(0, 16)
                        });
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Set Pro (1 year)
                    </button>
                    <button
                      onClick={() => {
                        setEditingUser({
                          ...editingUser,
                          subscriptionStatus: 'basic',
                          isOnTrial: false,
                          trialEndsAt: '',
                          subscriptionExpiresAt: ''
                        });
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Reset to Basic
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Испрати известување</h2>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
      
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Примачи
                  </label>
                  <select
                    value={announcementData.recipientFilter}
                    onChange={(e) => setAnnouncementData({...announcementData, recipientFilter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Сите корисници</option>
                    <option value="pro">Само Pro корисници</option>
                    <option value="basic">Само Basic корисници</option>
                    <option value="trial">Само корисници на пробен период</option>
                  </select>
                </div>
      
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Наслов
                  </label>
                  <input
                    type="text"
                    value={announcementData.subject}
                    onChange={(e) => setAnnouncementData({...announcementData, subject: e.target.value})}
                    placeholder="Нови функции на Konekta!"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
      
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Порака (HTML поддржан)
                  </label>
                  <textarea
                    value={announcementData.message}
                    onChange={(e) => setAnnouncementData({...announcementData, message: e.target.value})}
                    placeholder="<p>Ви ја објавуваме...</p>"
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Користете HTML за форматирање. Пример: &lt;p&gt;текст&lt;/p&gt;, &lt;strong&gt;задебелено&lt;/strong&gt;
                  </p>
                </div>
              </div>
      
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={sendingAnnouncement}
                >
                  Откажи
                </button>
                <button
                  onClick={handleSendAnnouncement}
                  disabled={sendingAnnouncement}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingAnnouncement ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Се испраќа...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Испрати
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}