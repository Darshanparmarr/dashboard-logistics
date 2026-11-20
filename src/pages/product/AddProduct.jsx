import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const PRODUCT_API =
  "https://6ac377f7ae53bf25b80e97fa.mockapi.io/logistics/product";
const CATEGORY_API =
  "https://6ac377f7ae53bf25b80e97fa.mockapi.io/logistics/category";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError("");
      const response = await fetch(CATEGORY_API);
      if (!response.ok) {
        throw new Error("Failed to fetch Categories");
      }
      const data = await response.json();

      setCategories(data.filter((category) => category.status !== false));
    } catch (error) {
      setCategoryError(error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      categoryId: "",
      description: "",
      price: "",
      quantity: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Product name is required"),
      image: Yup.string()
        .url("Enter a valid URL")
        .required("Image URL is required"),
      categoryId: Yup.string().required("Please select a category"),
      description: Yup.string().trim().required("Description is required"),
      price: Yup.number()
        .typeError("Price must be a Number")
        .min(0, "Price cannot be negative")
        .required("Price is required"),
      quantity: Yup.number()
        .typeError("Quantity must be a Number")
        .integer("Quantity must be a Whole Number")
        .min(0, "Quantity cannot be negative")
        .required("Quantity is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const productData = {
          ...values,
          name: values.name.trim(),
          description: values.description.trim(),
          price: Number(values.price),
          quantity: Number(values.quantity),
        };

        const response = await fetch(PRODUCT_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
        if (!response.ok) {
          throw new Error("Failed to add product");
        }
        const data = await response.json();
        console.log("Created Product", data);
        alert("Product Added Successfully!");
        resetForm();
      } catch (error) {
        console.error(error);
        alert(error.message || "Something went wrong!");
      }
    },
  });

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-orange-500";

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Add Product</h2>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <div>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Product name"
            className={inputClass}
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Product Image URL</label>
          <input
            type="text"
            name="image"
            placeholder="https://example.com/product.png"
            className={inputClass}
            {...formik.getFieldProps("image")}
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Select Category</label>
          <select
            name="categoryId"
            className={inputClass}
            {...formik.getFieldProps("categoryId")}
            disabled={categoryLoading}>
            <option value="">
              {categoryLoading ? "Loading Categories..." : "Select Category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.categoryId}
            </p>
          )}
          {categoryError && (
            <div className="mt-2">
              <p className="text-red-500 text-sm">{categoryError}</p>

              <button
                type="button"
                onClick={fetchCategories}
                className="text-orange-600 text-sm underline mt-1">
                Retry
              </button>
            </div>
          )}
          {!categoryLoading && !categoryError && categories.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              No active categories available.
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Enter product description"
            className={inputClass}
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Price (RS)</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            placeholder="Enter product price"
            className={inputClass}
            {...formik.getFieldProps("price")}
          />

          {formik.touched.price && formik.errors.price && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0"
            step="1"
            placeholder="Enter product Quantity"
            className={inputClass}
            {...formik.getFieldProps("quantity")}
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.quantity}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            formik.isSubmitting ||
            categoryLoading ||
            !!categoryError ||
            categories.length === 0
          }
          className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 disabled:opacity-50 m-2">
          {formik.isSubmitting ? "Saving..." : "Add Product"}
        </button>
        <button
          type="button"
          onClick={() => formik.resetForm()}
          className="border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-100">
          Reset
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
