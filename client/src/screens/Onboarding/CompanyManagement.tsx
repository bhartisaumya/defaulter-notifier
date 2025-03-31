import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Menu } from 'lucide-react';
import axios from 'axios';

import { ICompany } from "../../interface";
import { SheetHeader, SheetRow } from '../../components/SheetColumn';
import SearchBar from '../../components/SearchBar';

const base_url = import.meta.env.VITE_BASE_URL;

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const role = sessionStorage.getItem("role")

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    legalName: string;
    address: string;
    credit: number;
    letterHead: string | null; // Allow File object or null
  }>({
    name: "",
    legalName: "",
    address: "",
    credit: 0,
    letterHead: null, // Ensure it's initially null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const companies = await axios.get(`${base_url}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(companies.data);
      setCompanies(companies.data);
    } catch (err: any) {
      alert(err.response.data.error.message);
      setError("Failed to fetch Companies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hello",formData);
    e.preventDefault();
    setLoading(true);


    try {
      let url = `${base_url}/companies`;
      url += editingCompany ? `/?id=${editingCompany._id}` : "";

      const token = sessionStorage.getItem('token');
      const method = editingCompany ? "PATCH" : "POST";

      await (axios as any)[method.toLowerCase()](url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchData();
      handleCloseModal();
    } catch (err: any) {
      alert(err.response.data.error.message);
      setError("Failed to save companies");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: ICompany) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      address: company.address,
      credit: company.credit,
      legalName: company.legalName,
      letterHead: company.letterHead,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log(formData);
    setIsModalOpen(false);
    setEditingCompany(null);
    setFormData({
      name: "",
      address: "",
      credit: 0,
      legalName: "",
      letterHead: null,
    });
  };

  const handleLetterheadUpload = (e : any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, letterHead: reader.result as string})
      };
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen && <h2 className="text-xl font-semibold text-gray-800">Admin</h2>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
          <nav className="flex-1 pt-4">
            <button
              onClick={() => navigate(`/${role}`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>
            
            <button
              onClick={() => navigate('/manage-users')}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Users size={24} />
              {isSidebarOpen && <span className="ml-3">Manage Users</span>}
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
      <div className="flex-1 overflow-auto">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Company
              </button>
            </div>

            {/* Search and filters */}
            <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

            {/* Error message */}
            {error && (
              <div className="mb-4 bg-red-50 p-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Companies table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <SheetHeader columnNames={["NAME", "ADDRESS", "CREDIT"]} />
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <svg
                              className="animate-spin h-5 w-5 text-blue-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ) : filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No Company found
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((company) => (
                        <SheetRow
                          key={company._id}
                          data={company}
                          dataFields={["name", "address", "credit"]}
                          handleEdit={handleEdit}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding/editing companies */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingCompany ? "Edit Company" : "Add New Company"}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  CREDIT
                </label>
                <input
                  type="number"
                  id="address"
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: Number(e.target.value)})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="legalName" className="block text-sm font-medium text-gray-700">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    id="legalName"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="letterHead" className="block text-sm font-medium text-gray-700">
                    Letterhead (JPG/PNG)
                  </label>
                  <input
                    type="file"
                    id="letterHead"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleLetterheadUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  {formData.letterHead && (
        <img src={formData.letterHead} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
      )}
                </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                >
                  {loading ? "Saving..." : editingCompany ? "Save Changes" : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}