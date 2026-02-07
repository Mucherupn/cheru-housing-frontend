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
    title: "",
    content: "",
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
      title: "",
      content: "",
      year: "",
    });
    await loadData();
  };

  const rows = insights.map((insight) => [
    insight.locations?.name || "-",
    insight.title || "-",
    insight.year || "-",
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
      subtitle="Track market pricing signals and annual performance trends."
    >
      <SectionCard
        title="Market Insights"
        description="Add annual market insights for each location."
      >
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4 md:grid-cols-4">
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
            placeholder="Insight title"
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
            required
          />
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Insight summary"
            value={formState.content}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                content: event.target.value,
              }))
            }
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
            "Title",
            "Year",
            "Actions",
          ]}
          rows={rows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default InsightsPage;
