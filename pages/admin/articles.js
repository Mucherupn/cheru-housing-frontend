import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DataTable from "../../components/admin/DataTable";
import SectionCard from "../../components/admin/SectionCard";
import { apiRequest } from "../../utils/adminApi";

const initialForm = {
  title: "",
  slug: "",
  content: "",
  status: "draft",
  featuredImage: "",
  locationId: "",
};

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formState, setFormState] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [articlesPayload, locationsPayload] = await Promise.all([
      apiRequest("/api/admin/articles"),
      apiRequest("/api/admin/locations"),
    ]);
    setArticles(articlesPayload.articles || []);
    setLocations(locationsPayload.locations || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await apiRequest(`/api/admin/articles/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(formState),
      });
    } else {
      await apiRequest("/api/admin/articles", {
        method: "POST",
        body: JSON.stringify(formState),
      });
    }
    setFormState(initialForm);
    setEditingId(null);
    await loadData();
  };

  const handleEdit = (article) => {
    setEditingId(article.id);
    setFormState({
      title: article.title || "",
      slug: article.slug || "",
      content: article.content || "",
      status: article.status || "draft",
      featuredImage: article.featured_image || "",
      locationId: article.location_id || "",
    });
  };

  const handleDelete = async (id) => {
    await apiRequest(`/api/admin/articles/${id}`, { method: "DELETE" });
    await loadData();
  };

  const rows = articles.map((article) => [
    article.title,
    article.slug,
    article.status,
    locations.find((location) => location.id === article.location_id)?.name || "-",
    new Date(article.created_at).toLocaleDateString(),
    <div key={article.id} className="flex gap-2">
      <button
        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
        type="button"
        onClick={() => handleEdit(article)}
      >
        Edit
      </button>
      <button
        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-500"
        type="button"
        onClick={() => handleDelete(article.id)}
      >
        Delete
      </button>
    </div>,
  ]);

  return (
    <AdminLayout
      title="Articles"
      subtitle="Publish market insights and editorial content from the same console."
    >
      <SectionCard
        title={editingId ? "Edit Article" : "Create Article"}
        description="Manage titles, slugs, and publishing status."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              Title
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                value={formState.title}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label className="flex flex-col gap-2">
              Slug
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                value={formState.slug}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    slug: event.target.value,
                  }))
                }
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            Location
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
              value={formState.locationId}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  locationId: event.target.value,
                }))
              }
            >
              <option value="">Global</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            Content
            <textarea
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
              rows={4}
              value={formState.content}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  content: event.target.value,
                }))
              }
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              Featured Image URL
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                value={formState.featuredImage}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    featuredImage: event.target.value,
                  }))
                }
              />
            </label>
            <label className="flex flex-col gap-2">
              Status
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2"
                value={formState.status}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>

          <button
            className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white"
            type="submit"
          >
            {editingId ? "Update article" : "Publish article"}
          </button>
        </form>
      </SectionCard>

      <SectionCard
        title="Articles Library"
        description="Review the latest editorial content."
      >
        <DataTable
          columns={["Title", "Slug", "Status", "Location", "Created", "Actions"]}
          rows={rows}
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default ArticlesPage;
