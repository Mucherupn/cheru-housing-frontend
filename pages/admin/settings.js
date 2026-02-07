import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";

const SettingsPage = () => {
  return (
    <AdminLayout
      title="Platform Settings"
      subtitle="Secure the admin environment and configure global preferences."
    >
      <SectionCard
        title="Authentication"
        description="JWT-based login and session controls for admin users."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Session duration</p>
            <p className="mt-2">12 hours</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Token issuer</p>
            <p className="mt-2">auth.cheru.ke</p>
          </div>
        </div>
      </SectionCard>
    </AdminLayout>
  );
};

export default SettingsPage;
