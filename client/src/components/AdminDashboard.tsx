import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#0a0d14] p-6 text-white">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-slate-400">
        Manage bookings and platform activity from the administrator area.
      </p>
    </section>
  );
};

export default AdminDashboard;
