"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"

import type { IColumn, ITemplate } from "../../interface"
import { LayoutDashboard, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BASE_PATH } from "../../constants/constants"

const allowedFields: Record<string, string> = {
  borrower: "Borrower ",
  co_borrower: "Co Borrower",
  guarantor_1: "Guarantor 1",
  guarantor_2: "Guarantor 2",
  guarantor_3: "Guarantor 3",
  pdfNameColumn: "PDF Name Column",
}

export default function FormEditor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [metaTemplates, setMetaTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null)
  const navigate = useNavigate()
  const role = sessionStorage.getItem("role")

  const [formData, setFormData] = useState<IColumn>({
    _id: "",
    borrower: "",
    co_borrower: "",
    guarantor_1: "",
    guarantor_2: "",
    guarantor_3: "",
  })
  
  const [mformData, setmFormData] = useState<any>({
    _id:"",
    title:"",
    json:"",
  })
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    fetchFormData()
    fetchData()
  }, [])
  useEffect(() => {
    manageTemplatechange()
  }, [selectedTemplate])


  const manageTemplatechange = () => {
    if (!selectedTemplate) {
      return
    }

    const pattern = /\{([^}]+)\}/g
    const matches = [...new Set([...selectedTemplate.body.matchAll(pattern)].map((m) => m[1]))]
    const headers = [...matches].filter((item: any) => item !== 0 && item !== "pdfNameColumn");

    const json = headers.map((header: string, index: number) => ({ [header]: index + 1 }));
    console.log(json)
    
    setmFormData({...mformData,json})
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
      setMetaTemplates(template.data);
    } catch (err: any) {
      alert(err.response?.data.error.message);
      setError("Failed to fetch Templates");
    } finally {
      setLoading(false);
    }
  };
  const fetchFormData = async () => {
    try {
      setLoading(true)
      setError(null)

      // const company = sessionStorage.getItem("company")
      const token = sessionStorage.getItem("token")
      const companyId = sessionStorage.getItem("companyId")

      const response = await axios.get(`${BASE_PATH}/template-columns?company=${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(response.data)

      setFormData(response.data)
    } catch (err) {
      // setError("Failed to load form data")
      console.error("Error fetching form data:", err)
    } finally {
      setLoading(false)
    }
  }
  const handlemSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)
      const values = mformData.json.map((entry: any) => Object.values(entry)[0]);
      const hasDuplicates = new Set(values).size !== values.length;
    
      if (hasDuplicates) {
        setError("Duplicate values found! Each header must have a unique number.");
        return;
      }
      updateTemplate()

    } catch (err) {
      setError("Failed to save changes")
      console.error("Error saving form data:", err)
    }finally{
      setSaving(false)
    }
  }
  const updateTemplate = async () => {
    setLoading(true);

    try {
      let url = `${BASE_PATH}/templates`;
      url += true ? `/?_id=${selectedTemplate!!._id}` : "";

      const token = sessionStorage.getItem('token');
      const company = sessionStorage.getItem('company');
      const method = true ? "PATCH" : "POST";
      console.log(formData)
      await (axios as any)[method.toLowerCase()](url,
        {
          ...selectedTemplate,
          company,
          json: mformData.json
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchData();
    } catch (err: any) {
      alert(err.response?.data.error.message);
      setError("Failed to save Templates");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const token = sessionStorage.getItem("token")
      const companyId = sessionStorage.getItem("companyId")

      console.log(formData)

      await axios.patch(`${BASE_PATH}/template-columns`, formData, {
        params: { company: companyId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSuccessMessage("Changes saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (err) {
      setError("Failed to save changes")
      console.error("Error saving form data:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen && <h2 className="text-xl font-semibold text-gray-800">Menu</h2>}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
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
              onClick={() => navigate("/manage-templates")}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">Manage Template</span>}
            </button>
            <button
              onClick={() => navigate("/csv-upload")}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">CSV Upload</span>}
            </button>

            
          </nav>
          <div className="p-4">
            <button
              onClick={() => {
                sessionStorage.clear()
                navigate("/login")
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {isSidebarOpen ? "Logout" : ""}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Form Editor</h1>
            <p className="mt-2 text-sm text-gray-600">Edit the form values and click save to update the changes</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              <form onSubmit={handlemSubmit} className="space-y-6 p-6">
              <div key={"xysys"} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label htmlFor={"MetaTemplate"} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      Select  Template
                    </label>
                    <select
                    id="company"
                    value={mformData._id || ""}
                    onChange={(e) => {
                      setmFormData({ ...mformData, _id: e.target.value})
                      const template = metaTemplates.find((t) => t._id === e.target.value)
                      if (template) {
                        setSelectedTemplate(template)
                      }
                      console.log(formData)
                    }}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a template
                    </option>
                    {metaTemplates.map(template => (
                      <option key={template._id} value={template._id}>
                          {template.title}
                      </option>
                  ))}
                  </select>
                  </div>
                  {(mformData.json || []).map((entry: any, index: number) => {
  const key = Object.keys(entry)[0];
  const value = entry[key];

  return (
    <div key={key} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
      <label htmlFor={key} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {key}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <input
        min={0}
        step={1}
          type="number"
          id={key}
          name={key}
          value={value}
          onChange={(e) => {
            
            const updatedJson = [...mformData.json];
            updatedJson[index] = { [key]: Number(e.target.value) };

            setmFormData((prev: any) => ({
              ...prev,
              json: updatedJson,
            }));
          }}
          className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 border"
        />
      </div>
    </div>
  );
})}


                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`
                      inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                      ${
                        saving
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }
                    `}
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Form */}

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {Object.keys(allowedFields).map((fieldKey: string) => (
                  <div key={fieldKey} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                    <label htmlFor={fieldKey} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                      {allowedFields[fieldKey]}
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        id={fieldKey}
                        name={fieldKey}
                        value={formData[fieldKey as keyof IColumn]}
                        onChange={(e) => handleChange(fieldKey as keyof IColumn, e.target.value)}
                        className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`
                      inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white
                      ${
                        saving
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }
                    `}
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

