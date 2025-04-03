
// import {createBrowserRouter, RouterProvider} from "react-router-dom"

// import AuthPage from "./screens/AuthPage";

// import SuperAdminDashboard from "./screens/Dashboards/SuperAdminDashboard";
// import AdminDashboard from "./screens/Dashboards/AdminDashboard";
// import CompanyUserDashboard from "./screens/Dashboards/CompanyUserDashboard";

// import UserManagementPage from "./screens/Onboarding/UserManagement";
// import CompanyManagement from "./screens/Onboarding/CompanyManagement";

// import TemplateManagement from "./screens/Templates/TemplateManagement";
// import ColumnManagement from "./screens/Templates/ColumnMapping";

// import CSVUploadPage from "./screens/CSVUploadPage"

// const role = sessionStorage.getItem("role")

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <AuthPage />
//   },
//   {
//     path: "/super-admin",
//     element: <SuperAdminDashboard />
//   },
//   {
//     path: "/admin",
//     element: <AdminDashboard />
//   },
//   {
//     path: "/user",
//     element: <CompanyUserDashboard />
//   },
//   {
//     path: "/manage-users",
//     element: <UserManagementPage />
//   },
//   {
//     path: "/manage-companies",
//     element: <CompanyManagement />
//   },
//   {
//     path: "manage-templates",
//     element: <TemplateManagement />
//   },
//   {
//     path: "csv-upload",
//     element: <CSVUploadPage />
//   },
//   {
//     path: "manage-columns",
//     element: <ColumnManagement />
//   }
// ])

// const App = () => {
//   return (
//     <RouterProvider router={router} />
//   )
// }

// export default App;


import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"

import AuthPage from "./screens/AuthPage";

import SuperAdminDashboard from "./screens/Dashboards/SuperAdminDashboard";
import AdminDashboard from "./screens/Dashboards/AdminDashboard";
import CompanyUserDashboard from "./screens/Dashboards/CompanyUserDashboard";

import UserManagementPage from "./screens/Onboarding/UserManagement";
import CompanyManagement from "./screens/Onboarding/CompanyManagement";

import TemplateManagement from "./screens/Templates/TemplateManagement";
import ColumnManagement from "./screens/Templates/ColumnMapping";

import CSVUploadPage from "./screens/CSVUploadPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />
  },
  {
    path: "/login",
    element: <AuthPage />
  },
  {
    path: "/super-admin",
    element: <SuperAdminDashboard />
  },
  {
    path: "/admin",
    element: <AdminDashboard />
  },
  {
    path: "/user",
    element: <CompanyUserDashboard />
  },
  {
    path: "/manage-users",
    element: <UserManagementPage />
  },
  {
    path: "/manage-companies",
    element: <CompanyManagement />
  },
  {
    path: "/manage-templates",
    element: <TemplateManagement />
  },
  {
    path: "/csv-upload",
    element: <CSVUploadPage />
  },
  {
    path: "/manage-columns",
    element: <ColumnManagement />
  }
])

// Component that handles the root redirect logic
function RootRedirect() {
  const role = sessionStorage.getItem("role");
  
  if (role) {
    // If role exists, redirect to the corresponding dashboard
    return <Navigate to={`/${role}`} replace />;
  } else {
    // If no role exists, redirect to login
    return <Navigate to="/login" replace />;
  }
}

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;