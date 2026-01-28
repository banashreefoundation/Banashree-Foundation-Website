import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  // alert("sidebar")
  return (
    <div className="h-screen bg-card shadow-lg px-5">
      <Link to="/admin" className="flex justify-center border-b">
        <img
          width="190"
          height="150"
          src="../../../src/assets/images/Banashree-Logo.png"
        ></img>
      </Link>
      <ul className="pt-2 border-b pb-16">
        {/* <li>
          <Link to="/initiatives" className="flex items-center p-4 hover:bg-gray-700 transition duration-200">
            <span>ℹ️</span>
            <span className="ml-2">Initiatives</span>
          </Link>
        </li> */}
        {/* dashboard nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/admin"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-dashboard-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Dashboard</span>
            </Link>
          </div>
        </li>
        {/* programs nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/programs"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-program-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Programs</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* projects nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/projects"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-projects-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Projects</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* campaigns nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/campaigns"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-campaigns-icon"
            >
              <span className="icon"></span>
              <span className="ml-2">Campaigns</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* event nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/events"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-events-icon"
            >
              <span className="icon"></span>
              <span className="ml-2">Events</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* volunteer nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/volunteer"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-volunteer-icon"
            >
              <span className="icon"></span>
              <span className="ml-2">Volunteers</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* images nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/image-manager"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-images-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Images</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* Data Management nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/data-management"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-dashboard-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Data Management</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
        {/* Inquiries nav item */}
        <li className="py-1">
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/inquiries"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-volunteer-icon"
            >
              <span className="icon"></span>
              <span className="ml-2">Inquiries</span>
            </Link>
            <span className="nav-add-icon"></span>
          </div>
        </li>
      </ul>

      <ul className="pt-2">
        {/* Help and Support nav item */}
        <li>
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/admin"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-help-support-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Help & Support</span>
            </Link>
          </div>
        </li>
        {/* Logout nav item */}
        <li>
          <div className="flex items-center justify-between p-2 text-menu text-lg font-poppins-medium">
            <Link
              to="/admin"
              className="flex items-center hover:text-menu-hover hover:font-poppins-semi-bold nav-logout-icon"
            >
              <span className="icon"></span>
              <span className="ml-3">Logout</span>
            </Link>
          </div>
        </li>
        <li>
          <div className="nav-bg-image mt-6"></div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
