import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formState, setFormState] = useState({
    locationId: "",
    propertyType: "",
    averagePrice: "",
    month: "",
    year: "",
  });

  const loadData = async () => {
    const [insightsPayload, locationPayload] = await Promise.all([
      apiRequest("/api/admin/insights"),
      apiRequest("/api/admin/locations"),
    ]);
    setInsights(insightsPayload.insights || []);
    setLocations(locationPayload.locations || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await apiRequest("/api/admin/insights", {
      method: "POST",
      body: JSON.stringify(formState),
    });
    setFormState({
      locationId: "",
      propertyType: "",
      averagePrice: "",
      month: "",
      year: "",
    });
    await loadData();
  };

  const rows = insights.map((insight) => [
    insight.locations?.name || "-",
    insight.property_type,
    insight.average_price ? `KES ${Number(insight.average_price).toLocaleString()}` : "-",
    `${insight.month}/${insight.year}`,
    <button
      key={insight.id}
      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500"
      type="button"
      onClick={async () => {
        await apiRequest(`/api/admin/insights/${insight.id}`, {
          method: "DELETE",
        });
        await loadData();
      }}
    >
      Delete
    </button>,
  ]);

  return (
    <AdminLayout
      title="Insights"
      subtitle="Track market pricing signals and monthly performance trends."
    >
      <SectionCard
        title="Market Insights"
        description="Add monthly average pricing signals for each location."
      >
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4 md:grid-cols-5">
          <select
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            value={formState.locationId}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                locationId: event.target.value,
              }))
            }
            required
          >
            <option value="">Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Property type"
            value={formState.propertyType}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                propertyType: event.target.value,
              }))
            }
            required
          />
          <input
            type="number"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Average price"
            value={formState.averagePrice}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                averagePrice: event.target.value,
              }))
            }
          />
          <input
            type="number"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Month"
            value={formState.month}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                month: event.target.value,
              }))
            }
            required
          />
          <input
            type="number"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Year"
            value={formState.year}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                year: event.target.value,
              }))
            }
            required
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Add insight
          </button>
        </form>

        <DataTable
          columns={[
            "Location",
            "Property Type",
            "Avg Price",
            "Month",
            "Actions",
          ]}
          rows={rows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default InsightsPage;
