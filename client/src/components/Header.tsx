import { useNavigate } from 'react-router-dom'
import { Roles } from '../interface'
import { useEffect, useState } from 'react'
import { BASE_PATH } from '../constants/constants'
import axios from 'axios'

export default function Header() {
    const navigate = useNavigate()

    const name = sessionStorage.getItem('name')
    const role = sessionStorage.getItem('role')
    const [creditPoints, setCreditPoints] = useState(0)

    const headerLine = role === Roles.ADMIN ? "Admin" : Roles.USER === role ? "User": "Super Admin" 

    const fetchCreditPoints = async () => {
      try {
        const token = sessionStorage.getItem("token")
        // const company = sessionStorage.getItem("company")
        const companyID = sessionStorage.getItem("companyId")
  
        const response = await axios.get(`${BASE_PATH}/companies/?company=${companyID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCreditPoints(response.data.credit)
      } catch (err: any) {
        alert(err.response.data.message)
      }
    }
    useEffect
    (() => {
        if (role != Roles.SUPERADMIN){
            fetchCreditPoints()
        }
    }, [])
    const onLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }
    return (
      <div className="flex justify-between items-center mb-8 pl-6 pr-6 pt-4">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">{headerLine} Dashboard</h1>
            <p className="text-gray-600">Welcome back, {name}</p>
            </div>
            {role != Roles.SUPERADMIN && (
             <button
             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
           >
            <svg
            onClick={fetchCreditPoints}
             className="h-5 w-5 mr-2"
             fill="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
           >
             <rect x="0" fill="none" width="24" height="24" />
             <path d="M17.91 14c-.478 2.833-2.943 5-5.91 5-3.308 0-6-2.692-6-6s2.692-6 6-6h2.172l-2.086 2.086L13.5 10.5 18 6l-4.5-4.5-1.414 1.414L14.172 5H12c-4.418 0-8 3.582-8 8s3.582 8 8 8c4.08 0 7.438-3.055 7.93-7h-2.02z" />
           </svg>

             {creditPoints} Credit Points 
         </button> 
            )}
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
