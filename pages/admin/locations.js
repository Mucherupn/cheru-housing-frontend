import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";

const locationRows = [
  ["Westlands", "KES 22.3M", "Apartments, Penthouses", "Active"],
  ["Karen", "KES 48.9M", "Villas, Estates", "Active"],
  ["Runda", "KES 56.4M", "Family Homes", "Draft"],
];

const LocationsPage = () => {
  return (
    <AdminLayout
      title="Locations & Neighbourhoods"
      subtitle="Maintain the pricing intelligence for each market cluster."
    >
      <SectionCard
        title="Locations Directory"
        description="Update average pricing, popular property types, and linked neighbourhoods."
        action={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Add location
          </button>
        }
      >
        <DataTable
          columns={["Location", "Avg Price", "Popular Types", "Status"]}
          rows={locationRows}
        />
      </SectionCard>

      <SectionCard
        title="Neighbourhoods"
        description="Map neighbourhoods to their parent locations for accurate search filtering."
      >
        <div className="flex flex-wrap gap-3">
          {[
            "Nyari · Karen",
            "Brookside · Westlands",
            "Runda Eden · Runda",
            "Rosslyn · Runda",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500"
            >
              {item}
            </span>
          ))}
        </div>
      </SectionCard>
    </AdminLayout>
  );
};

export default LocationsPage;
