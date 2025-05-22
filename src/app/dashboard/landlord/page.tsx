"use client";
import ProtectedRouteWithRole from "@/components/ProtectedRouteWithRole";
import React from "react";

const LandlordDashboard = () => {
  return (
    <ProtectedRouteWithRole>
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
      <p>Welcome! Here you can manage your listings.</p>
    </div>
    </ProtectedRouteWithRole>
  );
};

export default LandlordDashboard;