import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const AmenitiesPage = () => {
  const [amenities, setAmenities] = useState([]);
  const [name, setName] = useState("");

  const loadData = async () => {
    const payload = await apiRequest("/api/admin/amenities");
    setAmenities(payload.amenities || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAmenity = async () => {
    if (!name.trim()) return;
    await apiRequest("/api/admin/amenities", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setName("");
    await loadData();
  };

  const handleDelete = async (id) => {
    await apiRequest(`/api/admin/amenities/${id}`, { method: "DELETE" });
    await loadData();
  };

  return (
    <AdminLayout
      title="Amenities Manager"
      subtitle="Curate the amenity library for listings, estimators, and insights."
    >
      <SectionCard
        title="Amenity Library"
        description="Add or update amenity tags used across the platform."
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Amenity name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
            type="button"
            onClick={handleAddAmenity}
          >
            Add amenity
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {amenities.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700"
            >
              {item.name}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Created {new Date(item.created_at).toLocaleDateString()}</span>
                <button
                  className="text-rose-500"
                  type="button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </AdminLayout>
  );
};

export default AmenitiesPage;
