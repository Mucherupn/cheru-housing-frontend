import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";

const BulkUploadPage = () => {
  return (
    <AdminLayout
      title="Bulk Upload"
      subtitle="Import listings at scale using the Cheru CSV/Excel template."
    >
      <SectionCard
        title="Upload Files"
        description="Drag and drop your spreadsheet and image folders. We will validate rows and preview before import."
        action={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Download template
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Listings file</p>
            <p className="mt-2">Upload CSV or XLSX with column headers.</p>
            <button className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
              Select file
            </button>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Image folders</p>
            <p className="mt-2">Attach the matching /public/images/listings directory.</p>
            <button className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
              Select folder
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Validation Preview"
        description="We will flag missing fields, invalid listing types, or image path mismatches."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Rows detected", value: "148" },
            { label: "Valid entries", value: "142" },
            { label: "Needs review", value: "6" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <button className="mt-6 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-white">
          Import listings
        </button>
      </SectionCard>
    </AdminLayout>
  );
};

export default BulkUploadPage;
