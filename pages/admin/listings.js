import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";

const listingRows = [
  ["Tigoni Heights", "Sale", "KES 43.5M", "5 Beds", "Active"],
  ["Kilimani Skyview", "Rent", "KES 210K", "3 Beds", "Active"],
  ["Rosslyn Grove", "Insights", "KES 21.8M", "4 Beds", "Draft"],
  ["Muthaiga Crest", "Sale", "KES 98M", "6 Beds", "Pending"],
];

const ListingsPage = () => {
  return (
    <AdminLayout
      title="Listings Management"
      subtitle="Curate sale, rent, and insights properties with clean, structured controls."
    >
      <SectionCard
        title="Listings Library"
        description="Manage core property data, media, and status states in one streamlined view."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
              Duplicate
            </button>
            <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
              Add listing
            </button>
          </div>
        }
      >
        <DataTable
          columns={["Listing", "Type", "Price", "Beds", "Status"]}
          rows={listingRows}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Property Details"
          description="Ensure all core fields, amenities, and media are complete."
        >
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="flex items-center justify-between">
              Core fields
              <span className="font-semibold text-slate-900">12/12 complete</span>
            </li>
            <li className="flex items-center justify-between">
              Gallery images
              <span className="font-semibold text-slate-900">14 files</span>
            </li>
            <li className="flex items-center justify-between">
              Amenities tagged
              <span className="font-semibold text-slate-900">8 amenities</span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Listing Actions"
          description="Quick controls for status, duplication, and visibility."
        >
          <div className="flex flex-col gap-3">
            {[
              "Toggle active status",
              "Duplicate listing",
              "Schedule refresh",
              "Archive draft",
            ].map((item) => (
              <button
                key={item}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {item}
                <span className="text-xs text-slate-400">›</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </AdminLayout>
  );
};

export default ListingsPage;
