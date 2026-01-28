import { Link } from 'react-router-dom';

const Header = () => {
  return (
      <header className="shadow fixed w-full z-10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
              <Link to="/admin">
                  <img src="/path/to/logo.png" alt="Logo" className="h-8 mr-3" />
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                  <img src="/path/to/profile-pic.png" alt="Profile" className="h-8 w-8 rounded-full" />
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                  <button className="text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                  </button>
              </div>
          </div>
      </header>
  );
};

export default Header;
