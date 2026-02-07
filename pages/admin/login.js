const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Cheru Admin
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Sign in to Command Center
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Use your secure admin credentials to access the Cheru platform.
          </p>

          <form className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                type="email"
                placeholder="admin@cheru.ke"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            Protected by JWT session tokens and role-based access control.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
