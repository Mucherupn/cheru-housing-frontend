import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const payload = await apiRequest("/api/admin/locations");
    setLocations(payload.locations || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const locationRows = locations.map((location) => {
    return [
      location.name,
      location.slug || "-",
      <button
        key={location.id}
        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500"
        type="button"
        onClick={async () => {
          await apiRequest(`/api/admin/locations/${location.id}`, {
            method: "DELETE",
          });
          await loadData();
        }}
      >
        Delete
      </button>,
    ];
  });

  const handleAddLocation = async () => {
    if (!locationName.trim()) return;
    await apiRequest("/api/admin/locations", {
      method: "POST",
      body: JSON.stringify({ name: locationName }),
    });
    setLocationName("");
    setMessage("Location added.");
    await loadData();
  };

  return (
    <AdminLayout
      title="Locations"
      subtitle="Maintain the pricing intelligence for each market cluster."
    >
      <SectionCard
        title="Locations Directory"
        description="Update market coverage for your location directory."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Add new location"
            value={locationName}
            onChange={(event) => setLocationName(event.target.value)}
          />
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
            type="button"
            onClick={handleAddLocation}
          >
            Add location
          </button>
        </div>

        <DataTable
          columns={["Location", "Slug", "Actions"]}
          rows={locationRows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default LocationsPage;
