
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import AuthPage from "./screens/AuthPage";
import SuperAdminDashboard from "./screens/Dashboards/SuperAdminDashboard";
import AdminDashboard from "./screens/Dashboards/AdminDashboard";
import CompanyUserDashboard from "./screens/Dashboards/CompanyUserDashboard";
import UserManagementPage from "./components/UserManagement";
import CompanyManagement from "./components/CompanyManagement";
import TemplateManagement from "./screens/Templates/TemplateManagement";
import CSVUploadPage from "./screens/CSVUploadPage"
import ColumnManagement from "./screens/Templates/ColumnMapping";

const router = createBrowserRouter([
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
    path: "manage-templates",
    element: <TemplateManagement />
  },
  {
    path: "csv-upload",
    element: <CSVUploadPage />
  },
  {
    path: "manage-columns",
    element: <ColumnManagement />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;

