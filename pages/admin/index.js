import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import StatCard from "../../components/admin/StatCard";
import { apiRequest } from "../../utils/adminApi";

const formatCurrency = (value) =>
  value ? `KES ${value.toLocaleString()}` : "KES 0";

const AdminDashboard = () => {
  const [listings, setListings] = useState([]);
  const [insights, setInsights] = useState([]);
  const [estimatorConfigs, setEstimatorConfigs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [listingPayload, insightsPayload, estimatorPayload] =
        await Promise.all([
          apiRequest("/api/admin/listings"),
          apiRequest("/api/admin/insights"),
          apiRequest("/api/admin/estimator"),
        ]);
      setListings(listingPayload.listings || []);
      setInsights(insightsPayload.insights || []);
      setEstimatorConfigs(estimatorPayload.configs || []);
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalListings = listings.length;
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const newListings = listings.filter(
      (listing) => new Date(listing.created_at) >= last30Days
    ).length;
    const averagePrice =
      listings.reduce((sum, listing) => sum + (Number(listing.price) || 0), 0) /
        (totalListings || 1) || 0;

    return [
      {
        label: "Total Listings",
        value: totalListings.toLocaleString(),
        trend: `${totalListings ? "+" : ""}${totalListings}`,
        helper: "Across sale, rent & insights",
      },
      {
        label: "New Listings",
        value: newListings.toLocaleString(),
        trend: `${newListings ? "+" : ""}${newListings}`,
        helper: "Last 30 days",
      },
      {
        label: "Average Price",
        value: formatCurrency(Math.round(averagePrice)),
        trend: "Updated",
        helper: "Weighted by location",
      },
      {
        label: "Estimator Configs",
        value: estimatorConfigs.length.toLocaleString(),
        trend: "Active",
        helper: "Pricing inputs tracked",
      },
    ];
  }, [listings, estimatorConfigs]);

  const activityRows = useMemo(
    () =>
      listings.slice(0, 5).map((listing) => [
        listing.title,
        listing.type,
        formatCurrency(Number(listing.price) || 0),
        new Date(listing.updated_at || listing.created_at).toLocaleDateString(),
      ]),
    [listings]
  );

  const locationRows = useMemo(() => {
    return insights.slice(0, 5).map((insight) => [
      insight.locations?.name || "Unknown",
      insight.title || "-",
      insight.year || "-",
    ]);
  }, [insights]);

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
            columns={["Location", "Title", "Year"]}
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
            columns={["Listing", "Type", "Price", "Updated"]}
            rows={activityRows}
          />
        </SectionCard>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
