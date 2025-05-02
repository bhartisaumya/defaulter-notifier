import { useEffect, useState } from "react";
import axios from "axios";
import { ICompany, ICreditTransaction } from "../../interface";
import { BASE_PATH } from "../../constants/constants";
import { Menu, LayoutDashboard, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function CreditManagementPage() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditForm, setCreditForm] = useState({ amount: 0, justification: "" });
  const [creditHistory, setCreditHistory] = useState<ICreditTransaction[]>([]);
  const [currentCredits, setCurrentCredits] = useState(0);
  const navigate = useNavigate();


    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    const role = sessionStorage.getItem("role")


  const fetchCompanies = async () => {
    const token = sessionStorage.getItem('token')

    const companies = await axios.get(`${BASE_PATH}/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCompanies(companies.data)
    }

  const addCredits = async () => {
    const token = sessionStorage.getItem('token')
    await axios.post(`${BASE_PATH}/credit-transactions`,{
      companyId: selectedCompany,
      amount: creditForm.amount,
      justification: creditForm.justification,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCreditHistory()
  }
  const fetchCreditHistory = async () => {
    if (!selectedCompany) {
      return;
    }
    const token = sessionStorage.getItem('token')
    const credits = await axios.get(`${BASE_PATH}/credit-transactions?company=${selectedCompany}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const company = await axios.get(`${BASE_PATH}/companies?company=${selectedCompany}`,
      {        headers: {
        Authorization: `Bearer ${token}`,
      },}
      
    )
    setCurrentCredits(company.data.credit)
    console.log(credits.data)
    setCreditHistory(credits.data.transactions);
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchCreditHistory();
  }, [selectedCompany]);

  const handleCreditSubmit = async () => {
    addCredits()
    setCreditForm({ amount: 0, justification: "" });
    setIsModalOpen(false);
    fetchCreditHistory();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCreditForm({ amount: 0, justification: "" });
  };

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
          onClick={() => navigate('/manage-companies')}
          className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <Building2 size={24} />
          {isSidebarOpen && <span className="ml-3">Manage Companies</span>}
        </button>
        <button
              onClick={() => navigate(`/manage-users`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <User size={24} />
              {isSidebarOpen && <span className="ml-3">Users Management</span>}
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
  <div className="flex-1 overflow-auto p-6">
    {/* Header */}
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Credit Management</h1>

    {/* Select + Buttons */}
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <select
        className="border border-gray-300 rounded-md px-3 py-2"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        <option value="">Select Company</option>
        {companies.map((company) => (
          <option key={company.name} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>

      {selectedCompany && (
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg
            onClick={fetchCreditHistory}
            className="h-5 w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.91 14c-.478 2.833-2.943 5-5.91 5-3.308 0-6-2.692-6-6s2.692-6 6-6h2.172l-2.086 2.086L13.5 10.5 18 6l-4.5-4.5-1.414 1.414L14.172 5H12c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.08 0 7.438-3.055 7.93-7h-2.02z" />
          </svg>
          {currentCredits} Credit Points
        </button>
      )}

      <button
        onClick={() => selectedCompany && setIsModalOpen(true)}
        disabled={!selectedCompany}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
      >
        Add Credit
      </button>
    </div>

    {/* Table */}
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Justification
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creditHistory.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No credit records found
                </td>
              </tr>
            ) : (
              creditHistory.map((record) => (
                <tr key={record._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm:ss A")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.justification}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Add Credit</h2>
            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleCreditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Points</label>
              <input
                type="number"
                value={creditForm.amount}
                onChange={(e) => setCreditForm({ ...creditForm, amount: Number(e.target.value) })}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Justification</label>
              <textarea
                value={creditForm.justification}
                onChange={(e) => setCreditForm({ ...creditForm, justification: e.target.value })}
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Credit
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
</div>

 );
}
