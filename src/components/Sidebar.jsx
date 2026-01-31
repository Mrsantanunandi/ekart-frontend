import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  User,
} from "lucide-react";
import { FaRegEdit } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="hidden fixed md:block border-r bg-pink-50 border-pink-200 z-10 w-[300px] p-10 space-y-2 h-screen">
      <div className="text-center pt-10 px-3 space-y-2">

        {/* Dashboard */}
        <NavLink
          to="/dashboard/sales"
          className={({ isActive }) =>
            `text-xl ${
              isActive
                ? "bg-pink-600 text-gray-200"
                : "bg-transparent text-gray-800"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full hover:bg-pink-100 transition`
          }
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </NavLink>

        {/* Add Product */}
        <NavLink
          to="/dashboard/add-product"
          className={({ isActive }) =>
            `text-xl ${
              isActive
                ? "bg-pink-600 text-gray-200"
                : "bg-transparent text-gray-800"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full hover:bg-pink-100 transition`
          }
        >
          <PackagePlus />
          <span>Add Product</span>
        </NavLink>

        {/* Products */}
        <NavLink
          to="/dashboard/products"
          className={({ isActive }) =>
            `text-xl ${
              isActive
                ? "bg-pink-600 text-gray-200"
                : "bg-transparent text-gray-800"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full hover:bg-pink-100 transition`
          }
        >
          <PackageSearch />
          <span>Products</span>
        </NavLink>

        {/* Users */}
        <NavLink
          to="/dashboard/users"
          className={({ isActive }) =>
            `text-xl ${
              isActive
                ? "bg-pink-600 text-gray-200"
                : "bg-transparent text-gray-800"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full hover:bg-pink-100 transition`
          }
        >
          <User />
          <span>Users</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `text-xl ${
              isActive
                ? "bg-pink-600 text-gray-200"
                : "bg-transparent text-gray-800"
            } flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full hover:bg-pink-100 transition`
          }
        >
          <FaRegEdit />
          <span>Orders</span>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;
