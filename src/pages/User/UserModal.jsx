import React from 'react';

export default function UserModal({
  showModal,
  closeModal,
  isEditing,
  isDark,
  form,
  handleChange,
  handleSubmit,
  submitting,
  submitError,
  departements,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit User' : 'Add New User'}</h2>
            <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isEditing ? 'Update user details.' : 'Fill in the details to register a new user.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {!isEditing && (
              <div>
                <label className="block text-xs font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
              )}
            <div>
              <label className="block text-xs font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Account Status</label>
              <select
                name="isActive"
                value={String(form.isActive)}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {!isEditing && (
              <div>
                <label className="block text-xs font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
          </div>

          
          {form.role === 'student' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Student Code</label>
                  <input
                    type="text"
                    name="studentCode"
                    value={form.studentCode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                    required={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Level</label>
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Group</label>
                  <input
                    type="text"
                    name="group"
                    placeholder="ex: G1, A..."
                    value={form.group}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Département</label>
                <select
                  name="departement"
                  value={form.departement}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Sélectionner un département</option>
                  {departements.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.nom || dep.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

         
          {form.role === 'teacher' && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    value={form.speciality}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                    required={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Office</label>
                  <input
                    type="text"
                    name="office"
                    value={form.office}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Département</label>
                <select
                  name="departement"
                  value={form.departement}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Sélectionner un département</option>
                  {departements.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.nom || dep.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}