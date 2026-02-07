import AdminLayout from "../../components/admin/AdminLayout";
import SectionCard from "../../components/admin/SectionCard";

const EstimatorPage = () => {
  return (
    <AdminLayout
      title="Estimator Data"
      subtitle="Control AVM inputs and adjustment factors for accurate valuations."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Base Pricing"
          description="Adjust base price, price per sqm, and land rates by location."
          action={
            <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white">
              Update rates
            </button>
          }
        >
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="flex items-center justify-between">
              Westlands base price
              <span className="font-semibold text-slate-900">KES 18.2M</span>
            </li>
            <li className="flex items-center justify-between">
              Karen price per sqm
              <span className="font-semibold text-slate-900">KES 134K</span>
            </li>
            <li className="flex items-center justify-between">
              Runda land rate per acre
              <span className="font-semibold text-slate-900">KES 42M</span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Adjustment Values"
          description="Tune pricing adjustments for amenities, age, view, and condition."
        >
          <div className="grid gap-3 text-sm text-slate-500">
            {[
              "Luxury amenities: +12%",
              "Age over 20 years: -6%",
              "Panoramic view: +8%",
              "Poor condition: -10%",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AdminLayout>
  );
};

export default EstimatorPage;
