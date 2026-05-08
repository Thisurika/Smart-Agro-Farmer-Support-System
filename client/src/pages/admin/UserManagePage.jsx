import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRoleStatus, deleteUser, clearUserErrors } from '../../redux/slices/userSlice';
import { FiTrash2, FiToggleLeft, FiToggleRight, FiShield, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const UserManagePage = () => {
  const dispatch = useDispatch();
  const { users, loading, error, updateError, deleteError, deleteLoading } = useSelector((state) => state.users);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Provide defaults to prevent undefined mapping if something fails
  const safeUsers = Array.isArray(users) ? users : [];

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearUserErrors()); }
    if (updateError) { toast.error(updateError); dispatch(clearUserErrors()); }
    if (deleteError) { toast.error(deleteError); dispatch(clearUserErrors()); }
  }, [error, updateError, deleteError, dispatch]);

  const handleRoleToggle = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    dispatch(updateUserRoleStatus({ id: user._id, role: newRole, isActive: user.isActive }))
      .unwrap()
      .then(() => toast.success(`User role updated to ${newRole}`))
      .catch((err) => toast.error(err || 'Failed to update role'));
  };

  const handleStatusToggle = (user) => {
    const newStatus = !user.isActive;
    dispatch(updateUserRoleStatus({ id: user._id, role: user.role, isActive: newStatus }))
      .unwrap()
      .then(() => toast.success(`User set to ${newStatus ? 'Active' : 'Inactive'}`))
      .catch((err) => toast.error(err || 'Failed to update status'));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteUser(deleteTarget))
      .unwrap()
      .then(() => {
        toast.success('User deleted successfully');
        setDeleteTarget(null);
      })
      .catch((err) => toast.error(err || 'Failed to delete user'));
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-extrabold font-heading text-neutral-900 dark:text-white">
          User Management
        </h2>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-6 pb-2.5 shadow-sm dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Role
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.firstName} {user.lastName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button 
                        onClick={() => handleRoleToggle(user)}
                        className={`inline-flex rounded-full py-1 px-3 text-sm font-medium transition-colors ${
                          user.role === 'admin'
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <span className="flex items-center gap-1"><FiShield /> Admin</span>
                        ) : (
                          <span className="flex items-center gap-1"><FiUser /> User</span>
                        )}
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button 
                        onClick={() => handleStatusToggle(user)}
                        className={`inline-flex items-center gap-1 py-1 text-sm font-medium transition-colors ${
                          user.isActive
                            ? 'text-green-500 hover:text-green-600'
                            : 'text-red-500 hover:text-red-600'
                        }`}
                      >
                        {user.isActive ? <FiToggleRight className="text-xl" /> : <FiToggleLeft className="text-xl" />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center justify-end space-x-3.5">
                        <button 
                          onClick={() => setDeleteTarget(user._id)}
                          className="hover:text-red-500 text-gray-500 transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete User Account"
        message="Are you sure you want to delete this user? This action will permanently remove their access to the system. This cannot be undone."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default UserManagePage;
