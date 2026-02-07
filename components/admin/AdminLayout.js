import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiActivity,
  FiBarChart2,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiMapPin,
  FiSettings,
  FiUploadCloud,
  FiUsers,
} from "react-icons/fi";
import useAdminGuard from "../../hooks/useAdminGuard";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: FiGrid },
  { name: "Listings", href: "/admin/listings", icon: FiHome },
  { name: "Bulk Upload", href: "/admin/bulk-upload", icon: FiUploadCloud },
  { name: "Locations", href: "/admin/locations", icon: FiMapPin },
  { name: "Amenities", href: "/admin/amenities", icon: FiLayers },
  { name: "Estimator", href: "/admin/estimator", icon: FiBarChart2 },
  { name: "Insights", href: "/admin/insights", icon: FiActivity },
  { name: "Articles", href: "/admin/articles", icon: FiFileText },
  { name: "Users", href: "/admin/users", icon: FiUsers },
  { name: "Settings", href: "/admin/settings", icon: FiSettings },
];

const SidebarLink = ({ item, isActive }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-primary text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon className="text-lg" />
      <span>{item.name}</span>
    </Link>
  );
};

const AdminLayout = ({ title, subtitle, children }) => {
  const router = useRouter();
  const { session, loading } = useAdminGuard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading admin session...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="flex w-full flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm lg:w-72">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Cheru Admin
            </p>
            <h1 className="mt-2 text-xl font-semibold text-slate-900">
              Command Center
            </h1>
          </div>
          <nav className="flex flex-1 flex-col gap-2">
            {navigation.map((item) => (
              <SidebarLink
                key={item.name}
                item={item}
                isActive={router.pathname === item.href}
              />
            ))}
          </nav>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Status
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              All systems operational
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Last sync 2 minutes ago
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Admin Panel
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Admin: {session.user?.email || "Signed in"}
              </div>
              <button
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
                onClick={() => router.push("/admin/listings")}
                type="button"
              >
                New Action
              </button>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
