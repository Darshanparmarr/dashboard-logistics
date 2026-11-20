import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      name: "Category",
      children: [
        { name: "Add Category", path: "add-category" },
        { name: "View Category", path: "view-category" },
      ],
    },
    {
      name: "Product",
      children: [
        { name: "Add Product", path: "add-product" },
        { name: "View Product", path: "view-product" },
      ],
    },
  ];

  const activeParent =
    location.pathname.includes("category") ? "Category"
    : location.pathname.includes("product") ? "Product"
    : "";

  const [openMenu, setOpenMenu] = useState(activeParent);

  const handleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <div className="flex min-h-screen bg-zinc-900">
      <aside
        className={`${
          isOpen ? "w-64" : "w-0"
        } bg-zinc-100 text-zinc-900 transition-all duration-300 overflow-hidden`}>
        <div className="p-5 min-w-64">
          <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>

          {menuItems.map((menu) => (
            <div key={menu.name} className="mb-4">
              {/* Parent Menu */}
              <button
                onClick={() => handleMenu(menu.name)}
                className="w-full text-left px-4 py-3 rounded hover:bg-zinc-300 font-bold">
                {menu.name}

                <span className="float-right">
                  {openMenu === menu.name ? "-" : "+"}
                </span>
              </button>

              {/* Sub Menu */}
              {openMenu === menu.name && (
                <div className="ml-5 mt-2 space-y-2">
                  {menu.children.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end
                      className={({ isActive }) =>
                        `block w-full text-left px-4 py-2 rounded ${
                          isActive ?
                            "bg-orange-500 text-white"
                          : "hover:bg-zinc-300 text-zinc-700"
                        }`
                      }>
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-zinc-100 shadow px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-zinc-700 hover:text-orange-500">
            ☰
          </button>

          <h2 className="text-lg font-semibold text-zinc-700">
            Admin Dashboard
          </h2>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarMenu;
