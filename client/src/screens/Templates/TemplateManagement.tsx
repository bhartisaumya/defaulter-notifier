import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Menu } from 'lucide-react';
import axios from 'axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ITemplate } from "../../interface";
import { SheetHeader, SheetRow } from '../../components/SheetColumn';
import SearchBar from '../../components/SearchBar';
import { BASE_PATH } from '../../constants/constants';


export default function TemplateManagement() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplates, setEditingTemplates] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [metaTemplates, setMetaTemplates] = useState<any[]>([])
  const role = sessionStorage.getItem('role')

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    metaTemplate:""
  });

  useEffect(() => {
    fetchData();
    fetchMetaTemplates();
  }, []);

  const fetchMetaTemplates = async()=>{
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const company = sessionStorage.getItem('companyId');
      const metaTemplates = await axios.get(`${BASE_PATH}/companies/get-templates?id=${company}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(metaTemplates.data.data)
      setMetaTemplates(metaTemplates.data.data as any)
    } catch (err: any) {
      alert(err.response?.data.error.message);
      setError("Failed to fetch Templates");
    }finally{
      setLoading(false)
    }
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const company = sessionStorage.getItem('company');

      const url = `${BASE_PATH}/templates/?company=${company}`;
      const template = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTemplates(template.data);
    } catch (err: any) {
      alert(err.response?.data.error.message);
      setError("Failed to fetch Templates");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = `${BASE_PATH}/templates`;
      url += editingTemplates ? `/?_id=${editingTemplates._id}` : "";

      const token = sessionStorage.getItem('token');
      const company = sessionStorage.getItem('company');
      const method = editingTemplates ? "PATCH" : "POST";
      console.log(formData)
      await (axios as any)[method.toLowerCase()](url,
        {
          ...formData,
          company
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchData();
      handleCloseModal();
    } catch (err: any) {
      alert(err.response?.data.error.message);
      setError("Failed to save Templates");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: ITemplate) => {
    setEditingTemplates(template);
    setFormData({
      title: template.title,
      body: template.body,
      metaTemplate: template.metaTemplateId
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplates(null);
    setFormData({
      title: "",
      body: "",
      metaTemplate:"",
    });
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-gray-50">
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
            <button
              onClick={() => navigate(`/${role}`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>
            <button
              onClick={() => navigate("/csv-upload")}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">CSV Upload</span>}
            </button>

            <button
              onClick={() => navigate("/manage-columns")}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">Column Mapping</span>}
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
              <h1 className="text-2xl font-bold text-gray-900">Template Management</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Template
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

            {/* Templates table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <SheetHeader columnNames={["Title", "BODY"]} />
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
                    ) : filteredTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No Template found
                        </td>
                      </tr>
                    ) : (
                      filteredTemplates.map((template) => (
                        <SheetRow
                          key={template._id}
                          data={template}
                          dataFields={["title", "body"]}
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

      {/* Modal for adding/editing templates */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingTemplates ? "Edit Template" : "Add New Template"}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Select Meta Template
                  </label>
                  <select
                    id="company"
                    value={formData.metaTemplate || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, metaTemplate: e.target.value})
                      console.log(formData)
                    }}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a template
                    </option>
                    {metaTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                          {template.name}
                      </option>
                  ))}
                  </select>
                </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                  Body
                </label>
                <div className="h-[300px] overflow-y-auto">
                <ReactQuill
                  id="body"

                  modules={{
                    toolbar: [
                      [{ 'header': [] }, { 'font': [] }],
                      [{ size: [] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [
                        { 'list': 'ordered' },
                        { 'list': 'bullet' },
                        { 'indent': '-1' },
                        { 'indent': '+1' },
                      ],
                      ['link', 'image', 'video'],
                      ['clean'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                      // [],
                    ],
                    clipboard: {
                      matchVisual: false
                    }
                  }}
                  formats={[
                    'header', 'font', 'size', 'color',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image', 'video',
                    'align',
                  ]}
                  value={formData.body}
                  theme="snow"
                  style={{ height: "300px", width: "100%" }}
                  onChange={(value) => setFormData({ ...formData, body: value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  
                />
              </div>
                
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
                  {loading ? "Saving..." : editingTemplates ? "Save Changes" : "Add Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}