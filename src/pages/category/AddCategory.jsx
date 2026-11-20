import { useFormik } from "formik";
import * as Yup from "yup";

const API_URL =
  "https://6ac377f7ae53bf25b80e97fa.mockapi.io/logistics/category";

const AddCategory = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      code: "",
      status: true,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      image: Yup.string()
        .url("Enter a Valid image URL")
        .required("Image url is required"),
      description: Yup.string().required("Description is required"),
      code: Yup.string().required("Category code is required  "),
      status: Yup.boolean(),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to add Category");
        }

        const data = await response.json();

        alert("Category Added Successfully ! ");

        console.log("Created Category : ", data);

        resetForm();
      } catch (error) {
        console.log(error);
        alert("Something went wrong!");
      }
    },
  });

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-orange-500";

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Add Category</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium"> Category Name </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name"
              className={inputClass}
              {...formik.getFieldProps("name")}
            />

            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium"> Image URL </label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.png"
              className={inputClass}
              {...formik.getFieldProps("image")}
            />

            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium"> Description </label>
            <textarea
              type="description"
              rows="3"
              placeholder="Enter category description"
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
            <label className="block mb-2 font-medium"> Category Code </label>
            <input
              type="text"
              name="code"
              placeholder="e.g ELEC001"
              className={inputClass}
              {...formik.getFieldProps("code")}
            />

            {formik.touched.code && formik.errors.code && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.code}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium"> Status </label>
            <select
              name="status"
              value={formik.values.status.toString()}
              onChange={(e) =>
                formik.setFieldValue("status", e.target.value === "true")
              }
              className={inputClass}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 disabled:opacity-50">
              {formik.isSubmitting ? "Saving..." : "Add Category"}
            </button>

            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-100">
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
