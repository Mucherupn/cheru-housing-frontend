import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";
import { uploadListingsFromExcel } from "../../utils/bulkUpload";

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV or Excel file.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await uploadListingsFromExcel(file);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Bulk Upload"
      subtitle="Import listings at scale using the Cheru CSV/Excel template."
    >
      <SectionCard
        title="Upload Files"
        description="Upload a spreadsheet with the required headers. We'll validate and import rows automatically."
        action={
          <a
            href="/templates/listings-template.csv"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Download template
          </a>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Listings file</p>
            <p className="mt-2">Upload CSV or XLSX with column headers.</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="mt-4 block text-xs"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Image folders</p>
            <p className="mt-2">
              Upload images separately in Supabase Storage under listing-images.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Use the featuredImage and galleryImages columns to reference paths or
              URLs.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Validation Preview"
        description="We will flag missing fields, invalid listing types, or image path mismatches."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Rows detected", value: result?.successCount + (result?.failedCount || 0) || "-" },
            { label: "Valid entries", value: result?.successCount || "-" },
            { label: "Needs review", value: result?.failedCount || "-" },
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

        {error ? (
          <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
            {error}
          </p>
        ) : null}

        {result?.failedRows?.length ? (
          <div className="mt-6 space-y-2 text-xs text-slate-500">
            {result.failedRows.map((row) => (
              <p key={row.row}>Row {row.row}: {row.message}</p>
            ))}
          </div>
        ) : null}

        <button
          className="mt-6 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-white"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Importing..." : "Import listings"}
        </button>
      </SectionCard>
    </AdminLayout>
  );
};

export default BulkUploadPage;
