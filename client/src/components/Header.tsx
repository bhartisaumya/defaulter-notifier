import { useNavigate } from 'react-router-dom'
import { Roles } from '../interface'

export default function Header() {
    const navigate = useNavigate()

    const name = sessionStorage.getItem('name')
    const role = sessionStorage.getItem('role')

    const headerLine = role === Roles.ADMIN ? "Admin" : Roles.USER === role ? "User": "Super Admin" 

    const onLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">{headerLine} Dashboard</h1>
            <p className="text-gray-600">Welcome back, {name}</p>
            </div>
            <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
            </button>
        </div>
    )
}
