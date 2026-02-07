import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";

const articleRows = [
  ["Market Pulse: Nairobi", "market-pulse-nairobi", "Draft", "Aug 14"],
  ["Cheru Buyer Guide", "cheru-buyer-guide", "Published", "Jul 28"],
  ["Luxury Rentals", "luxury-rentals", "Published", "Jul 10"],
];

const ArticlesPage = () => {
  return (
    <AdminLayout
      title="Articles & Content"
      subtitle="Manage blog posts and premium content delivered on the Cheru platform."
    >
      <SectionCard
        title="Content Library"
        description="Create, edit, and publish editorial content for Cheru users."
        action={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
            Create article
          </button>
        }
      >
        <DataTable
          columns={["Title", "Slug", "Status", "Publish Date"]}
          rows={articleRows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default ArticlesPage;
