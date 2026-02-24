import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function AuthLayout() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 100, minHeight: "100vh", background: "#f0f2f5" }}>
      <div style={{ width: 400, background: "white", padding: 30, borderRadius: 8 }}>
        <Outlet /> 
      </div>
    </div>
  );
}