import Header from '../../components/Header';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Building2, LayoutDashboard, Menu, User } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const role = sessionStorage.getItem('role');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen && <h2 className="text-xl font-semibold text-gray-800">Menu</h2>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
          <nav className="flex-1 pt-4">
            {/* <NavBarButton 
              onClickHandler={() => navigate(`/${role}`)}
              isSidebarOpen={{isSidebarOpen}}
              Icon={LayoutDashboard}
              name={"Dashboard"}
            />
            <NavBarButton 
              onClickHandler={() => navigate(`/${role}`)}
              isSidebarOpen={{isSidebarOpen}}
              Icon={LayoutDashboard}
              name={"Dashboard"}
            /> */}
            <button
              onClick={() => navigate(`/${role}`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>
            <button
              onClick={() => navigate(`/manage-users`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <User size={24} />
              {isSidebarOpen && <span className="ml-3">Users Management</span>}
            </button>
            <button
              onClick={() => navigate(`/manage-companies`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Building2 size={24} />
              {isSidebarOpen && <span className="ml-3">Company Management</span>}
            </button>
          </nav>
          <div className="p-4">
            <button
              onClick={() => {
                sessionStorage.clear();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {isSidebarOpen ? "Logout" : ""}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto overflow-hidden">
        <Header />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          title={"Users"}
          onClick={() => navigate("/manage-users")}
        />

        <Card 
          title={"Company"}
          onClick={() => navigate("/manage-companies")}
        />
        </div>
      </div>
    </div>
  );
}
