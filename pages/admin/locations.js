import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [neighbourhoodName, setNeighbourhoodName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const payload = await apiRequest("/api/admin/locations");
    setLocations(payload.locations || []);
    setNeighbourhoods(payload.neighbourhoods || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const locationRows = locations.map((location) => {
    const neighbourhoodCount = neighbourhoods.filter(
      (item) => item.location_id === location.id
    ).length;
    return [
      location.name,
      `${neighbourhoodCount} neighbourhoods`,
      new Date(location.created_at).toLocaleDateString(),
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

  const neighbourhoodTags = useMemo(
    () =>
      neighbourhoods.map((item) => {
        const location = locations.find((loc) => loc.id === item.location_id);
        return {
          ...item,
          label: `${item.name} · ${location?.name || "Unassigned"}`,
        };
      }),
    [locations, neighbourhoods]
  );

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

  const handleAddNeighbourhood = async () => {
    if (!neighbourhoodName.trim() || !selectedLocation) return;
    await apiRequest("/api/admin/locations", {
      method: "POST",
      body: JSON.stringify({
        entity: "neighbourhood",
        name: neighbourhoodName,
        locationId: selectedLocation,
      }),
    });
    setNeighbourhoodName("");
    setSelectedLocation("");
    setMessage("Neighbourhood added.");
    await loadData();
  };

  return (
    <AdminLayout
      title="Locations & Neighbourhoods"
      subtitle="Maintain the pricing intelligence for each market cluster."
    >
      <SectionCard
        title="Locations Directory"
        description="Update average pricing, popular property types, and linked neighbourhoods."
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
          columns={["Location", "Neighbourhoods", "Created", "Actions"]}
          rows={locationRows}
        />
      </SectionCard>

      <SectionCard
        title="Neighbourhoods"
        description="Map neighbourhoods to their parent locations for accurate search filtering."
      >
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Neighbourhood name"
            value={neighbourhoodName}
            onChange={(event) => setNeighbourhoodName(event.target.value)}
          />
          <select
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
            type="button"
            onClick={handleAddNeighbourhood}
          >
            Add neighbourhood
          </button>
        </div>

        {message ? (
          <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-600">
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {neighbourhoodTags.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500"
            >
              {item.label}
              <button
                className="text-xs text-rose-500"
                type="button"
                onClick={async () => {
                  await apiRequest(`/api/admin/neighbourhoods/${item.id}`, {
                    method: "DELETE",
                  });
                  await loadData();
                }}
              >
                Remove
              </button>
            </span>
          ))}
        </div>
      </SectionCard>
    </AdminLayout>
  );
};

export default LocationsPage;
