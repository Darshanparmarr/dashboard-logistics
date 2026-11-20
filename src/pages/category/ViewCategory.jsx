import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const API_URL =
  "https://6ac377f7ae53bf25b80e97fa.mockapi.io/logistics/category";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchMatch =
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.code.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "all" ||
        category.status === (statusFilter === "active");

      return searchMatch && statusMatch;
    });
  }, [categories, search, statusFilter]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedCategory?.name || "",
      image: selectedCategory?.image || "",
      description: selectedCategory?.description || "",
      code: selectedCategory?.code || "",
      status: selectedCategory?.status ?? true,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required "),
      image: Yup.string()
        .url("Enter a valid Image URL ")
        .required("Image URL is required"),
      description: Yup.string().required("Description is required"),
      code: Yup.string().required("Category code is required"),
      status: Yup.boolean(),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(`${API_URL}/${selectedCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to update Category");
        }

        const updateCategory = await response.json();

        setCategories((prev) =>
          prev.map((category) =>
            category.id === selectedCategory.id ? updateCategory : category,
          ),
        );
        setSelectedCategory(null);
        alert("Category updated Successfully!");
      } catch (error) {
        alert(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((category) => category.id !== deleteId),
      );

      setDeleteId(null);
      alert("Category delete successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-orange-500";
  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-300"> Categories</h1>
            <p className="text-gray-300 text-sm mt-1">
              Manage your logistics product categories
            </p>
          </div>
          <Link
            to="/dashboard/add-category"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-center">
            {" "}
            Add Category
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">Total Categories</p>
            <h2 className="text-3xl font-bold mt-2">{categories.length}</h2>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">Active Categories</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {categories.filter((item) => item.status).length}
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">Inactive Categories</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {categories.filter((item) => !item.status).length}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search category name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${inputClass} sm:w-48`}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={fetchCategories}
              className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100">
              Refresh
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <h2 className="font-semibold text-lg px-2 pt-2">Category List</h2>
          <p className="text-sm text-gray-500 mt-1 p-2">
            Showing {filteredCategories.length} Categories
          </p>
        </div>
        {loading ?
          <div className="p-10 text-center text-gray-500">
            Loading categories...
          </div>
        : error ?
          <div className="p-10 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchCategories}
              className="mt-3 text-orange-600 underline">
              Try Again
            </button>
          </div>
        : filteredCategories.length === 0 ?
          <div className="p-10 text-center text-gray-500">
            No Categories Found.
          </div>
        : <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left ">
              <thead className="bg-gray-50 text-gray-600 text-sm ">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created At</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="bg-gray-50 hover:bg-gray-200">
                    <td className="px-5 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-48">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {category.code}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{category.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${category.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {category.createdAt ?
                        new Date(category.createdAt).toLocaleDateString()
                      : "-"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-200">
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(category.id)}
                          className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-200">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        {selectedCategory && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-xl font-semibold">Edit Category</h2>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 text-2xl">
                  &times;
                </button>
              </div>
              <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
                {[
                  { name: "name", label: "Category Name" },
                  { name: "code", label: "Category Code" },
                  { name: "image", label: "Image URL" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      {...formik.getFieldProps(field.name)}
                    />
                    {formik.touched[field.name] &&
                      formik.errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors[field.name]}
                        </p>
                      )}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className={inputClass}
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    className={inputClass}
                    value={formik.values.status.toString()}
                    onChange={(e) =>
                      formik.setFieldValue("status", e.target.value === "true")
                    }>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="px-5 py-2 rounded-lg border hover:bg-gray-100">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50">
                    {formik.isSubmitting ? "Updating..." : "Update Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="text-xl font-semibold text-gray-800">
                Delete category?
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to delete category? This action cannot
                undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewCategory;
