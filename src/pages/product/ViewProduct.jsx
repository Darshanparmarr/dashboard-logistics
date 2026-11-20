import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const PRODUCT_API =
  "https://6ac377f7ae53bf25b80e97fa.mockapi.io/logistics/product";

const CATEGORY_API =
  "https://6ac377f7ae53bf25b80e97fa.mockapi.io/logistics/category";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(PRODUCT_API);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Get Category Name
  const getCategoryName = (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);

    return category ? category.name : "Unknown Category";
  };

  // Search and Category Filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch =
        categoryFilter === "all" || product.categoryId === categoryFilter;

      return searchMatch && categoryMatch;
    });
  }, [products, search, categoryFilter]);

  // Edit Product Formik
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: selectedProduct?.name || "",
      image: selectedProduct?.image || "",
      categoryId: selectedProduct?.categoryId || "",
      description: selectedProduct?.description || "",
      price: selectedProduct?.price ?? "",
      quantity: selectedProduct?.quantity ?? "",
    },

    validationSchema: Yup.object({
      name: Yup.string().trim().required("Product name is required"),

      image: Yup.string()
        .url("Enter a valid Image URL")
        .required("Image URL is required"),

      categoryId: Yup.string().required("Please select a category"),

      description: Yup.string().trim().required("Description is required"),

      price: Yup.number()
        .typeError("Price must be a number")
        .min(0, "Price cannot be negative")
        .required("Price is required"),

      quantity: Yup.number()
        .typeError("Quantity must be a number")
        .integer("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative")
        .required("Quantity is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedData = {
          ...values,
          name: values.name.trim(),
          description: values.description.trim(),
          price: Number(values.price),
          quantity: Number(values.quantity),
        };

        const response = await fetch(`${PRODUCT_API}/${selectedProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const updatedProduct = await response.json();

        setProducts((prev) =>
          prev.map((product) =>
            product.id === selectedProduct.id ? updatedProduct : product,
          ),
        );

        setSelectedProduct(null);

        alert("Product Updated Successfully!");
      } catch (error) {
        alert(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Delete Product
  const handleDelete = async () => {
    try {
      const response = await fetch(`${PRODUCT_API}/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((product) => product.id !== deleteId));

      setDeleteId(null);

      alert("Product Deleted Successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-orange-500";

  return (
    <>
      <div className=" space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-300">Products</h1>

            <p className="text-gray-300 text-sm mt-1">
              Manage your logistics products
            </p>
          </div>

          <Link
            to="/dashboard/add-product"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-center">
            Add Product
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">Total Products</p>

            <h2 className="text-3xl font-bold mt-2">{products.length}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">Total Stock</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {products.reduce(
                (total, item) => total + (Number(item.quantity) || 0),
                0,
              )}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">Total Inventory Value</p>

            <h2 className="text-3xl font-bold text-orange-600 mt-2">
              ₹
              {products
                .reduce(
                  (total, item) =>
                    total +
                    (Number(item.price) || 0) * (Number(item.quantity) || 0),
                  0,
                )
                .toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} flex-1`}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`${inputClass} sm:w-56`}>
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                fetchProducts();
                fetchCategories();
              }}
              className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100">
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <h2 className="font-semibold text-lg px-4 pt-4">Product List</h2>

          <p className="text-sm text-gray-500 mt-1 px-4 pb-3">
            Showing {filteredProducts.length} Products
          </p>

          {loading ?
            <div className="p-10 text-center text-gray-500">
              Loading products...
            </div>
          : error ?
            <div className="p-10 text-center">
              <p className="text-red-500">{error}</p>

              <button
                onClick={fetchProducts}
                className="mt-3 text-orange-600 underline">
                Try Again
              </button>
            </div>
          : filteredProducts.length === 0 ?
            <div className="p-10 text-center text-gray-500">
              No Products Found.
            </div>
          : <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Created At</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="bg-gray-50 hover:bg-gray-200">
                      <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-48">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />

                          <span className="font-medium text-gray-800">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {getCategoryName(product.categoryId)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 max-w-xs">
                        <p className="line-clamp-2">{product.description}</p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            Number(product.quantity) > 0 ?
                              "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}>
                          {product.quantity}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {product.createdAt ?
                          new Date(product.createdAt).toLocaleDateString()
                        : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-200">
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteId(product.id)}
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
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-xl font-semibold">Edit Product</h2>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 text-2xl">
                  &times;
                </button>
              </div>

              <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    className={inputClass}
                    {...formik.getFieldProps("name")}
                  />

                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL
                  </label>

                  <input
                    type="text"
                    className={inputClass}
                    {...formik.getFieldProps("image")}
                  />

                  {formik.touched.image && formik.errors.image && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.image}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>

                  <select
                    className={inputClass}
                    {...formik.getFieldProps("categoryId")}>
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.categoryId}
                    </p>
                  )}
                </div>

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
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    {...formik.getFieldProps("price")}
                  />

                  {formik.touched.price && formik.errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    {...formik.getFieldProps("quantity")}
                  />

                  {formik.touched.quantity && formik.errors.quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.quantity}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-2 rounded-lg border hover:bg-gray-100">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50">
                    {formik.isSubmitting ? "Updating..." : "Update Product"}
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
                Delete Product?
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to delete this product? This action cannot
                be undone.
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

export default ViewProduct;
