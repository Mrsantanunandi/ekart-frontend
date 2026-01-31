import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const DashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-75 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoard;
