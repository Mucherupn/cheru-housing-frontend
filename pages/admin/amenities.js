import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";

const AmenitiesPage = () => {
  return (
    <AdminLayout
      title="Amenities Manager"
      subtitle="Curate the amenity library for listings, estimators, and insights."
    >
      <SectionCard
        title="Amenity Library"
        description="Add or update amenity tags used across the platform."
        action={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Add amenity
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Pool",
            "Garden",
            "Gym",
            "Backup generator",
            "Smart security",
            "Water treatment",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700"
            >
              {item}
              <p className="mt-2 text-xs text-slate-400">Used in 23 listings</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AdminLayout>
  );
};

export default AmenitiesPage;
