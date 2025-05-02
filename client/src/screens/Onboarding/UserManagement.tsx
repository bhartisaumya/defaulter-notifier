// import React from 'react'
// import { useState, useEffect } from "react"

// import {ICompanyUsers} from "../interface"

// import {SheetHeader, SheetRow } from './SheetColumn'
// import SearchBar from './SearchBar'
// import axios from 'axios'

// import {Roles} from "../interface"


// const base_url = "http://localhost:8000"


// export default function UserManagementPage() {
//   const [users, setUsers] = useState<any[]>([])
//   const [companies, setCompanies] = useState<any[]>([])

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [editingUser, setEditingUser] = useState<any | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     isAdmin: false,
//     company: ""
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const token = sessionStorage.getItem('token')

//       const users = await axios.get(`${BASE_PATH}/company-users`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
//         },
//       });
//       setUsers(users.data)

//       const companies = await axios.get(`${BASE_PATH}/companies`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCompanies(companies.data)

//     } catch (err: any) {
//       alert(err.response.data.error.message)
//       setError("Failed to fetch users")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if(!formData.company){
//       alert("Please select a company")
//     }
//     setLoading(true)

//     try {
//       let url = `${BASE_PATH}/company-users`
//       url += editingUser ? `/?id=${editingUser._id}` : ""

//       const token = sessionStorage.getItem('token')
//       const method = editingUser ? "PATCH" : "POST"

//       const response = await (axios as any)[method.toLowerCase()](url,
//         formData
//         ,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )

//       console.log(response)

//       await fetchData()
//       handleCloseModal()
//     } catch (err: any) {
//       alert(err.response.data.error.message)
//       setError("Failed to save user")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (user: ICompanyUsers) => {
//     setEditingUser(user)
//     setFormData({
//       name: user.name,
//       email: user.email,
//       password: user.password,
//       isAdmin: user.role === Roles.ADMIN,
//       company: user.company,
//     })
//     setIsModalOpen(true)
//   }

//   const handleCloseModal = () => {
//     setIsModalOpen(false)
//     setEditingUser(null)
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       isAdmin: false,
//       company: ""
//     })
//   }

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Add New User
//           </button>
//         </div>

//         {/* Search and filters */}
//         <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 bg-red-50 p-4 rounded-md">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Users table */}
//         <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <SheetHeader columnNames={["NAME", "EMAIL", "ROLE", "COMPANY"]} />
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-4 text-center">
//                       <div className="flex justify-center">
//                         <svg
//                           className="animate-spin h-5 w-5 text-blue-600"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           />
//                         </svg>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
//                       No users found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <SheetRow
//                       data={user}
//                       dataFields={["name", "email", 'role', 'company']}
//                       handleEdit={handleEdit}/>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal for adding/editing users */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-900">{editingUser ? "Edit User" : "Add New User"}</h2>
//               <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
//                 <span className="sr-only">Close</span>
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value})}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value})}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value})}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                   Role
//                 </label>
//                 <select
//                   id="role"
//                   value={formData.isAdmin ? "admin" : "user"}
//                   onChange={(e) => setFormData({ ...formData, isAdmin: e.target.value === "admin"})}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="admin">Admin</option>
//                   <option value="user">User</option>
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="company" className="block text-sm font-medium text-gray-700">
//                   Company
//                 </label>
//                 <select
//                   id="company"
//                   value={formData.company}
//                   onChange={(e) => {
//                     setFormData({ ...formData, company: e.target.value})
//                     console.log(formData)
//                   }}
//                   required
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="" disabled>
//                     Select a company
//                   </option>
//                   {companies.map(company => (
//                     <option key={company.id} value={company.name}>
//                         {company.name}
//                     </option>
//                 ))}
//                 </select>
//               </div>
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
//                     ${
//                       loading
//                         ? "bg-blue-400 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     }`}
//                 >
//                   {loading ? "Saving..." : editingUser ? "Save Changes" : "Add User"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }





import React from 'react'
import { useState, useEffect } from "react"


import { LayoutDashboard, Building2, Menu, BadgeDollarSign } from 'lucide-react';
import {SheetHeader, SheetRow } from '../../components/SheetColumn'
import SearchBar from '../../components/SearchBar'
import axios from 'axios'

import {Roles, ICompanyUsers} from "../../interface"
import { useNavigate } from 'react-router-dom';
import { BASE_PATH } from '../../constants/constants';





export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate()
  const role = sessionStorage.getItem("role")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    company: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = sessionStorage.getItem('token')

      const users = await axios.get(`${BASE_PATH}/company-users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
        },
      });
      setUsers(users.data)

      const companies = await axios.get(`${BASE_PATH}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(companies.data)

    } catch (err: any) {
      alert(err.response.data.error.message)
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!formData.company){
      alert("Please select a company")
    }
    setLoading(true)

    try {
      let url = `${BASE_PATH}/company-users`
      url += editingUser ? `/?id=${editingUser._id}` : ""

      const token = sessionStorage.getItem('token')
      const method = editingUser ? "PATCH" : "POST"

      const response = await (axios as any)[method.toLowerCase()](url,
        formData
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log(response)

      await fetchData()
      handleCloseModal()
    } catch (err: any) {
      alert(err.response.data.error.message)
      setError("Failed to save user")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: ICompanyUsers) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.role === Roles.ADMIN,
      company: user.company,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      isAdmin: false,
      company: ""
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              onClick={() => navigate(`/manage-credits`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <BadgeDollarSign size={24} />
              {isSidebarOpen && <span className="ml-3">Credits Management</span>}
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
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New User
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

        {/* Users table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <SheetHeader columnNames={["NAME", "EMAIL", "ROLE", "COMPANY"]} />
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
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <SheetRow
                      data={user}
                      dataFields={["name", "email", 'role', 'company']}
                      handleEdit={handleEdit}/>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* Modal for adding/editing users */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{editingUser ? "Edit User" : "Add New User"}</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.isAdmin ? "admin" : "user"}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.value === "admin"})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select
                    id="company"
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value})
                      console.log(formData)
                    }}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a company
                    </option>
                    {companies.map(company => (
                      <option key={company.id} value={company.name}>
                          {company.name}
                      </option>
                  ))}
                  </select>
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
                      ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                  >
                    {loading ? "Saving..." : editingUser ? "Save Changes" : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}


