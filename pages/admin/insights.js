import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";

const insightRows = [
  ["Westlands", "Apartments", "KES 22.3M", "Aug", "2024"],
  ["Karen", "Villas", "KES 48.9M", "Aug", "2024"],
  ["Runda", "Family Homes", "KES 56.4M", "Aug", "2024"],
];

const InsightsPage = () => {
  return (
    <AdminLayout
      title="Insights Data"
      subtitle="Manage market statistics and pricing trends used across Cheru insights."
    >
      <SectionCard
        title="Market Trends"
        description="Maintain the structured data that feeds charts and market reports."
        action={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Add data point
          </button>
        }
      >
        <DataTable
          columns={["Location", "Property Type", "Avg Price", "Month", "Year"]}
          rows={insightRows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default InsightsPage;
