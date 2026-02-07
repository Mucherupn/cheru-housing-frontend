import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const EstimatorPage = () => {
  const [configs, setConfigs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formState, setFormState] = useState({
    locationId: "",
    pricePerSqm: "",
    landPricePerAcre: "",
  });

  const loadData = async () => {
    const [configPayload, locationPayload] = await Promise.all([
      apiRequest("/api/admin/estimator"),
      apiRequest("/api/admin/locations"),
    ]);
    setConfigs(configPayload.configs || []);
    setLocations(locationPayload.locations || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await apiRequest("/api/admin/estimator", {
      method: "POST",
      body: JSON.stringify(formState),
    });
    setFormState({ locationId: "", pricePerSqm: "", landPricePerAcre: "" });
    await loadData();
  };

  const rows = configs.map((config) => [
    config.locations?.name || "-",
    config.price_per_sqm || "-",
    config.land_price_per_acre || "-",
    <button
      key={config.id}
      type="button"
      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500"
      onClick={async () => {
        await apiRequest(`/api/admin/estimator/${config.id}`, {
          method: "DELETE",
        });
        await loadData();
      }}
    >
      Delete
    </button>,
  ]);

  return (
    <AdminLayout
      title="Estimator"
      subtitle="Tune pricing weights for the Cheru estimator experience."
    >
      <SectionCard
        title="Estimator Inputs"
        description="Update default rates for build cost and land value."
      >
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4 md:grid-cols-4">
          <select
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            value={formState.locationId}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                locationId: event.target.value,
              }))
            }
            required
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Price per sqm"
            value={formState.pricePerSqm}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                pricePerSqm: event.target.value,
              }))
            }
          />
          <input
            type="number"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs"
            placeholder="Land price per acre"
            value={formState.landPricePerAcre}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                landPricePerAcre: event.target.value,
              }))
            }
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            Save config
          </button>
        </form>

        <DataTable
          columns={["Location", "Price / sqm", "Land / acre", "Actions"]}
          rows={rows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default EstimatorPage;
