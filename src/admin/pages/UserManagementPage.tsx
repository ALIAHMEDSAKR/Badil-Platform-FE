import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import type { UserDto } from '../../types/auth';
import {
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';

export function UserManagementPage() {
  const { isSuperAdmin } = useAuth();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    setError('');
    setSuccessMsg('');
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                role:
                  newRole === UserRole.SuperAdmin
                    ? 'SuperAdmin'
                    : newRole === UserRole.Admin
                    ? 'Admin'
                    : 'User',
              }
            : u
        )
      );
      setSuccessMsg('User role updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to update role.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(userId);
    setError('');
    setSuccessMsg('');
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSuccessMsg(`User ${userEmail} has been deleted.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to delete user.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const roleToEnum = (roleStr: string): UserRole => {
    if (roleStr === 'SuperAdmin') return UserRole.SuperAdmin;
    if (roleStr === 'Admin') return UserRole.Admin;
    return UserRole.User;
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>User Management</h1>
          <p className="admin-subtitle">
            View all users, update roles, and manage accounts across the platform.
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn" onClick={fetchUsers}>
            <RefreshCw size={16} strokeWidth={2} aria-hidden />
            Refresh
          </button>
          {isSuperAdmin && (
            <Link to="/admin/create" className="admin-btn admin-btn--primary" style={{ textDecoration: 'none' }}>
              <UserPlus size={16} strokeWidth={2} aria-hidden />
              Create Admin
            </Link>
          )}
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="admin-form-message admin-form-message--error" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="admin-form-message admin-form-message--success" style={{ marginBottom: '1rem' }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search */}
      <div className="admin-search-bar">
        <Search size={16} className="admin-search-icon" />
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by email, role, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2>All Users ({filteredUsers.length})</h2>
        </div>
        <div className="admin-table-wrap">
          {isLoading ? (
            <div className="admin-loading-state">
              <div className="admin-spinner" />
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-empty-state">
              <p>
                {searchQuery
                  ? 'No users match your search.'
                  : 'No users found.'}
              </p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <p className="admin-cell-sub" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {user.id.substring(0, 8)}...
                      </p>
                    </td>
                    <td>
                      <p className="admin-cell-title">{user.email}</p>
                    </td>
                    <td>
                      <select
                        className="admin-role-select"
                        value={roleToEnum(user.role)}
                        onChange={(e) =>
                          handleRoleChange(user.id, Number(e.target.value) as UserRole)
                        }
                        disabled={updatingId === user.id}
                      >
                        <option value={UserRole.User}>User</option>
                        <option value={UserRole.Admin}>Admin</option>
                        {isSuperAdmin && (
                          <option value={UserRole.SuperAdmin}>SuperAdmin</option>
                        )}
                      </select>
                    </td>
                    <td>
                      <div className="admin-actions-row">
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete user"
                          aria-label={`Delete ${user.email}`}
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={deletingId === user.id}
                        >
                          {deletingId === user.id ? (
                            <div className="admin-spinner-sm" />
                          ) : (
                            <Trash2 size={16} strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
