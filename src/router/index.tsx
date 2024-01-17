import React from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { paths } from "./paths";
import AuthGuard from "@/auth/guard/auth-guard";

const Home = React.lazy(() => import("src/pages/home"));
// const LogOut = React.lazy(() => import("src/sections/logout"));

export default function Router() {
  return useRoutes([...root]);
}

const childPaths = [
  {
    path: "/a/p",
    element: <>Protected</>,
  },
];

const root = [
  {
    path: paths.root,
    element: <Home />,
  },
  {
    path: "/a",
    element: (
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    ),
    children: childPaths,
  },
  { path: "*", element: <Navigate to="/404" replace /> },
];

export * from "./paths";
