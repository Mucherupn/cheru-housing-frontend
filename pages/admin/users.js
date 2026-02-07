import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";

const UsersPage = () => {
  return (
    <AdminLayout
      title="Users & Roles"
      subtitle="Prepare for multi-admin operations with role-based access control."
    >
      <SectionCard
        title="Admin Access"
        description="Currently configured for a single super admin account."
        action={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Invite admin
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Cheru HQ</p>
            <p className="mt-2 text-xs text-slate-500">cheru@hq.io</p>
            <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              Super Admin
            </span>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Invite additional roles to support editors and agents when ready.
          </div>
        </div>
      </SectionCard>
    </AdminLayout>
  );
};

export default UsersPage;
