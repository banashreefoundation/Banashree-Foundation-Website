import AdminPage from "@/pages/admin/AdminPage";
import DashboardPage from "@/pages/admin/Dashboard/DashboardPage";
import ImageManager from "@/pages/admin/ImageManager/ImageManager";
import SeedDataView from "@/pages/admin/DataManagement/SeedDataView";
import HomePage from "@/pages/Home/HomePage";
import ProjectDetails from "@/pages/Home/ProjectDetails";
import ProgramDetails from "@/pages/Home/ProgramDetails";
import EventDetails from "@/pages/Home/EventDetails";
import CampaignDetails from "@/pages/Home/CampaignDetails";
import LoginPage from "@/pages/Login/LoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/authguard/ProtectedRoute";
import PrivateRoute from "@/authguard/PrivateRoute";
const adminPaths = [
  '/admin',
  '/initiatives',
  '/programs',
  '/projects',
  '/campaigns',
  '/volunteer',
  '/events',
  '/image-manager',
  '/data-management',
  '/inquiries'
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/project/:id",
    element: <ProjectDetails />,
  },
  {
    path: "/program/:id",
    element: <ProgramDetails />,
  },
  {
    path: "/event/:id",
    element: <EventDetails />,
  },
  {
    path: "/campaign/:id",
    element: <CampaignDetails />,
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
    ],
  },
  {
    path: "/image-manager",
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <ImageManager />
      },
    ],
  },
  {
    path: "/data-management",
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <SeedDataView />
      },
    ],
  },
  ...adminPaths.filter(path => path !== '/admin' && path !== '/image-manager' && path !== '/data-management').map(path => ({
    path,
    element: (
      <PrivateRoute>
        <AdminPage />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
    ],
  })),
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
