import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import StatCard from "../../components/admin/StatCard";

const stats = [
  {
    label: "Total Listings",
    value: "1,284",
    trend: "+8.2%",
    helper: "Across sale, rent & insights",
  },
  {
    label: "New Listings",
    value: "96",
    trend: "+14.1%",
    helper: "This month",
  },
  {
    label: "Average Price",
    value: "KES 18.4M",
    trend: "+3.4%",
    helper: "Weighted by location",
  },
  {
    label: "Estimator Usage",
    value: "4,621",
    trend: "+11.8%",
    helper: "Last 30 days",
  },
];

const activityRows = [
  ["Highland Rise", "Rent", "KES 120K", "Active", "2 hours ago"],
  ["Tigoni Heights", "Sale", "KES 43.5M", "Pending", "Yesterday"],
  ["Rosslyn Grove", "Insights", "KES 21.8M", "Active", "2 days ago"],
];

const locationRows = [
  ["Westlands", "KES 22.3M", "Apartments, Penthouses", "+4.3%"],
  ["Karen", "KES 48.9M", "Villas, Estates", "+2.1%"],
  ["Runda", "KES 56.4M", "Family Homes", "+1.8%"],
];

const AdminDashboard = () => {
  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="A curated overview of your listings, estimator usage, and market signals."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Insights by Location"
          description="Track high-performing locations and property mix trends."
          action={
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
              View report
            </button>
          }
        >
          <DataTable
            columns={["Location", "Avg Price", "Top Types", "MoM"]}
            rows={locationRows}
          />
        </SectionCard>

        <SectionCard
          title="Recent Activity"
          description="Latest listings and edits across the marketplace."
          action={
            <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
              Review queue
            </button>
          }
        >
          <DataTable
            columns={["Listing", "Type", "Price", "Status", "Updated"]}
            rows={activityRows}
          />
        </SectionCard>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
