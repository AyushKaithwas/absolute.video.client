import React from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { paths } from "./paths";
import AuthGuard from "@/auth/guard/auth-guard";

const Home = React.lazy(() => import("@/pages/home"));
const LogOut = React.lazy(() => import("@/pages/logout"));
const Login = React.lazy(() => import("@/pages/login"));
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
    path: paths.login,
    element: <Login />,
  },
  {
    path: paths.logout,
    element: <LogOut />,
  },
  { path: "*", element: <Navigate to="/404" replace /> },
];

export * from "./paths";
