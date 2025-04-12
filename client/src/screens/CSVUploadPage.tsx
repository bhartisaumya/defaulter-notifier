// "use client"
// // @ts-nocheck
// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import Papa from "papaparse"
// import axios from "axios"

// import { LayoutDashboard, FileText, Menu } from "lucide-react"
// import type { ITemplate } from "../interface"
// import { downloadPDF } from "../services/pdfGenerator"
// import { BASE_PATH} from "../constants/constants"

// interface CSVRow {
//   [key: string]: string
// }

// export default function CSVTemplatePage() {
//   const [selectedRowIndex] = useState<number | null>(null);
//   const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([]);

//   const [templates, setTemplates] = useState<ITemplate[]>([])
//   const [csvData, setCSVData] = useState<CSVRow[]>([])
//   const [headers, setHeaders] = useState<string[]>([])
//   const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)
//   const [creditPoints, setCreditPoints] = useState(0) // New state for credit points
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const role = sessionStorage.getItem("role")

//   useEffect(() => {
//     fetchData()
//     fetchCreditPoints()
//   }, [])

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError(""); // Clear error after 3 seconds
//       }, 3000);

//       return () => clearTimeout(timer); // Cleanup on unmount
//     }
//   }, [error]);
//   const fetchData = async () => {
//     try {
//       const token = sessionStorage.getItem("token")
//       const company = sessionStorage.getItem("company")
//       const response = await axios.get(`${BASE_PATH}/templates/?company=${company}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       setTemplates(response.data)
//     } catch (err: any) {
//       alert(err.response?.data.error.message)
//     }
//   }

//   const fetchCreditPoints = async () => {
//     try {
//       const token = sessionStorage.getItem("token")
//       const company = sessionStorage.getItem("company")

//       const response = await axios.get(`${BASE_PATH}/companies/?company=${company}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       setCreditPoints(response.data.credit)
//     } catch (err: any) {
//       alert(err.response.data.message)
//     }
//   }

//   const checkForNull = (row: any, headers: string[]): boolean => {
//     let isNull = true

//     for (const header of headers) {
//       if (row[header]) isNull = false
//     }
//     return isNull
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     console.log(file)

//     if (!selectedTemplate){
//       console.error("No template selected")
//       setError("Please select a template first")
//       return
//     }
//     else if (file) {
//       Papa.parse(file, {
//         header: true,
//         complete: (results) => {
//           const data = results.data as CSVRow[]
//           console.log(data)
//           // removing the bear \n if the row is empty
//           if (checkForNull(data.slice(-1), headers)) data.pop()
//           console.log(data)
//           // Check if the CSV has headers
//           if (data.length > 0) {
//             const firstRow = data[0]
//             const keys = Object.keys(firstRow)
//             if (keys.length === 0) {
//               setError("CSV file has no headers")
//               return
//             }
//           }
//           setCSVData(data)
//           if (data.length > 0) {
//             setHeaders(Object.keys(data[0]))
//           }

//         },
//         error: (error) => {
//           console.error("Error parsing CSV:", error)
//           setError("Error parsing CSV file")
//         },
//       })
//     }
//   }

//   const handleRowSelection = (index: number) => {
//     setSelectedRowIndices((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//     console.log(selectedRowIndices)
//   };
  

//   const replaceTemplateVariables = (template: string, data: CSVRow) => {
//     let hasError = false
//     const result = template.replace(/\{(\w+)\}/g, (match, key) => {
//       if (!data[key]) {
//         // hasError = true
//         // console.log(`Field "${key}" not present in CSV data`)
//         // setError(`Field "${key}" not present in CSV data`)
//         return match
//       }
//       return data[key]
//     })

//     if (hasError) {
//       throw new Error("Missing fields in CSV data")
//     }

//     return result
//   }

//   const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const templateId = e.target.value

//     const template = templates.find((t) => t._id === templateId)
//     if (template) {
//       setSelectedTemplate(template)
//     }
//   }

//   const downloadTemplate = (selectedRow: CSVRow) => {
//     if (!selectedTemplate || !selectedRow) {
//       setError("Please select both a template and a row");
//       return;
//     }

//     const htmlFormatedText = replaceTemplateVariables(selectedTemplate.body, selectedRow)

//     downloadPDF(htmlFormatedText)
//   };
  

//   // const handleSend = async () => {
//   //   if (!selectedTemplate || !selectedRowIndex) {
//   //     setError("Please select both a template and a row")
//   //     return
//   //   }
//   //   try {
//   //     await new Promise((resolve) => setTimeout(resolve, 1000))
//   //     alert("Message sent successfully!")
//   //   } catch (err) {
//   //     setError("Failed to send message")
//   //   }
//   // }

//   const handleSendMultiple = async () => {
//     if (!selectedTemplate || selectedRowIndices.length === 0) {
//       setError("Please select a template and at least one row")
//       return
//     }

//     try {
//       // Here you would implement the actual API call to send multiple messages
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       alert(`${selectedRowIndices.length} messages sent successfully!`)
//       setSelectedRowIndices([])
//     } catch (err) {
//       setError("Failed to send messages")
//     }
//   }

//   const downloadMultiplePDFs = async () => {
//     if (!selectedTemplate || selectedRowIndices.length === 0) {
//       setError("Please select a template and at least one row");
//       return;
//     }
  
//     try {
//       // Create and download PDFs for each selected row
//       selectedRowIndices.forEach((index) => {
//         downloadTemplate(csvData[index])
//         console.log(index)
//       });
  
//       alert(`Downloading ${selectedRowIndices.length} PDFs...`);
//     } catch (err) {
//       setError("Failed to download PDFs");
//     }
//   };
  

//   const downloadEmptyCSV = () => {
//     if (!selectedTemplate) {
//       setError("Please select a template first")
//       return
//     }

//     const pattern = /\{([^}]+)\}/g
//     const matches = [...new Set([...selectedTemplate.body.matchAll(pattern)].map((m) => m[1]))]

//     const csvHeaders = matches.join(",") + "\n"

//     const blob = new Blob([csvHeaders], { type: "text/csv" })

//     // Create a download link
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = selectedTemplate.title + "_empty.csv" // File name
//     document.body.appendChild(a)

//     // Trigger download
//     a.click()

//     // Cleanup
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   const navigateTo = (path: string) => {
//     window.location.href = path
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
//         <div className="h-full flex flex-col">
//           <div className="p-4 flex items-center justify-between">
//             {isSidebarOpen && <h2 className="text-xl font-semibold text-gray-800">Menu</h2>}
//             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
//               <Menu size={24} />
//             </button>
//           </div>
//           <nav className="flex-1 pt-4">
//             <button
//               onClick={() => navigateTo(`/${role}`)}
//               className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             >
//               <LayoutDashboard size={24} />
//               {isSidebarOpen && <span className="ml-3">Dashboard</span>}
//             </button>
//             <button
//               onClick={() => navigateTo("/manage-columns")}
//               className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             >
//               <Menu size={24} />
//               {isSidebarOpen && <span className="ml-3">Column Mapping</span>}
//             </button>
//             <button
//               onClick={() => navigateTo("/manage-templates")}
//               className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             >
//               <FileText size={24} />
//               {isSidebarOpen && <span className="ml-3">Manage Templates</span>}
//             </button>
//           </nav>
//           <div className="p-4">
//             <button
//               onClick={() => {
//                 sessionStorage.clear()
//                 window.location.href = "/login"
//               }}
//               className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               {isSidebarOpen ? "Logout" : ""}
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <div className="py-8 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto space-y-8">
//             {/* Header */}
//             <div className="relative">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">CSV Template System</h1>
//                   <p className="mt-1 text-sm text-gray-500">Upload a CSV file, select a template, and generate PDFs</p>
//                 </div>
//                 {/* Credit Points Display */}
//                 <div className="absolute top-4 right-4">
//                   <div className="bg-blue-500 text-white px-2 py-1 rounded">Credit Points Left: {creditPoints}</div>
//                 </div>
//               </div>
//             </div>
//             {/* Error Display */}
//             {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
//             {/* File Upload Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
//                   <div className="mt-1 flex items-center space-x-4">
//                   <div className="relative inline-block">
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       style={{ color: 'transparent' }} // Hide filename
//                     />
//                   </div>
//                   </div>
//                 </div>
//                 {/* Template Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Select Template</label>
//                   <div className="mt-1 flex items-center space-x-4">
//                     <select
//                       value={selectedTemplate?._id || "0"}
//                       onChange={handleTemplateChange}
//                       className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//                     >
//                       <option value="0">Select template...</option>
//                       {templates.map((template) => (
//                         <option key={template._id} value={template._id}>
//                           {template.title}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={downloadEmptyCSV}
//                       disabled={!selectedTemplate}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Download Sample CSV File
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* CSV Data Table */}
//             {csvData.length > 0 && (
//               <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Select
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Index
//                         </th>
//                         {headers.map((header) => (
//                           <th
//                             key={header}
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                           >
//                             {header}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {csvData.map((row, index) => (
//                         <tr
//                         key={index}
//                         className={`hover:bg-gray-50 ${
//                           selectedRowIndex === index
//                             ? "bg-blue-50"
//                             : selectedRowIndices.includes(index)
//                               ? "bg-blue-100"
//                               : ""
//                         }`}
//                         >
//                           <td className="px-4 py-4 whitespace-nowrap">
//                           <input
//                             type="checkbox"
//                             checked={selectedRowIndices.includes(index)}
//                             onChange={() => handleRowSelection(index)}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />

//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index}</td>
//                           {headers.map((header) => (
//                             <td key={header} className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {row[header]}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//             {csvData.length > 0 && selectedRowIndices.length > 0 && (
//               <div className="bg-white p-4 rounded-lg shadow-sm mt-4 flex justify-end space-x-4">
//                 <span className="mr-auto text-sm text-gray-600 self-center">{selectedRowIndices.length} rows selected</span>
//                 <button
//                   onClick={downloadMultiplePDFs}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Download Selected PDFs
//                 </button>
//                 <button
//                   onClick={handleSendMultiple}
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Send Selected Messages
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"
// @ts-nocheck
import type React from "react"
import { useState, useRef, useEffect } from "react"
import Papa from "papaparse"
import axios from "axios"

import { LayoutDashboard, FileText, Menu } from "lucide-react"
import type { ITemplate } from "../interface"
import { downloadPDF } from "../services/pdfGenerator"
import { BASE_PATH } from "../constants/constants"

interface CSVRow {
  [key: string]: string
}

export default function CSVTemplatePage() {
  const [selectedRowIndex] = useState<number | null>(null)
  const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([])

  const [templates, setTemplates] = useState<ITemplate[]>([])
  const [csvData, setCSVData] = useState<CSVRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [creditPoints, setCreditPoints] = useState(0) // New state for credit points
  const fileInputRef = useRef<HTMLInputElement>(null)
  const role = sessionStorage.getItem("role")

  useEffect(() => {
    fetchData()
    fetchCreditPoints()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("") // Clear error after 3 seconds
      }, 3000)

      return () => clearTimeout(timer) // Cleanup on unmount
    }
  }, [error])
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const company = sessionStorage.getItem("company")
      const response = await axios.get(`${BASE_PATH}/templates/?company=${company}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTemplates(response.data)
    } catch (err: any) {
      alert(err.response?.data.error.message)
    }
  }

  const fetchCreditPoints = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const company = sessionStorage.getItem("company")

      const response = await axios.get(`${BASE_PATH}/companies/?company=${company}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCreditPoints(response.data.credit)
    } catch (err: any) {
      alert(err.response.data.message)
    }
  }

  const checkForNull = (row: any, headers: string[]): boolean => {
    let isNull = true

    for (const header of headers) {
      if (row[header]) isNull = false
    }
    return isNull
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log(file)

    if (!selectedTemplate) {
      console.error("No template selected")
      setError("Please select a template first")
      return
    } else if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as CSVRow[]
          console.log(data)
          // removing the bear \n if the row is empty
          if (checkForNull(data.slice(-1), headers)) data.pop()
          console.log(data)
          // Check if the CSV has headers
          if (data.length > 0) {
            const firstRow = data[0]
            const keys = Object.keys(firstRow)
            if (keys.length === 0) {
              setError("CSV file has no headers")
              return
            }
          }
          setCSVData(data)
          if (data.length > 0) {
            setHeaders(Object.keys(data[0]))
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error)
          setError("Error parsing CSV file")
        },
      })
    }
  }

  const handleRowSelection = (index: number) => {
    setSelectedRowIndices((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    console.log(selectedRowIndices)
  }

  const handleSelectAll = () => {
    if (selectedRowIndices.length === csvData.length) {
      // If all rows are already selected, deselect all
      setSelectedRowIndices([])
    } else {
      // Otherwise, select all rows
      setSelectedRowIndices(csvData.map((_, index) => index))
    }
  }

  const replaceTemplateVariables = (template: string, data: CSVRow) => {
    const hasError = false
    const result = template.replace(/\{(\w+)\}/g, (match, key) => {
      if (!data[key]) {
        // hasError = true
        // console.log(`Field "${key}" not present in CSV data`)
        // setError(`Field "${key}" not present in CSV data`)
        return match
      }
      return data[key]
    })

    if (hasError) {
      throw new Error("Missing fields in CSV data")
    }

    return result
  }

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value

    const template = templates.find((t) => t._id === templateId)
    if (template) {
      setSelectedTemplate(template)
    }
  }

  const downloadTemplate = (selectedRow: CSVRow) => {
    if (!selectedTemplate || !selectedRow) {
      setError("Please select both a template and a row")
      return
    }

    const htmlFormatedText = replaceTemplateVariables(selectedTemplate.body, selectedRow)

    downloadPDF(htmlFormatedText)
  }

  // const handleSend = async () => {
  //   if (!selectedTemplate || !selectedRowIndex) {
  //     setError("Please select both a template and a row")
  //     return
  //   }
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     alert("Message sent successfully!")
  //   } catch (err) {
  //     setError("Failed to send message")
  //   }
  // }

  const handleSendMultiple = async () => {
    if (!selectedTemplate || selectedRowIndices.length === 0) {
      setError("Please select a template and at least one row")
      return
    }

    try {
      // Here you would implement the actual API call to send multiple messages
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(`${selectedRowIndices.length} messages sent successfully!`)
      setSelectedRowIndices([])
    } catch (err) {
      setError("Failed to send messages")
    }
  }

  const downloadMultiplePDFs = async () => {
    if (!selectedTemplate || selectedRowIndices.length === 0) {
      setError("Please select a template and at least one row")
      return
    }

    try {
      // Create and download PDFs for each selected row
      selectedRowIndices.forEach((index) => {
        downloadTemplate(csvData[index])
        console.log(index)
      })

      alert(`Downloading ${selectedRowIndices.length} PDFs...`)
    } catch (err) {
      setError("Failed to download PDFs")
    }
  }

  const downloadEmptyCSV = () => {
    if (!selectedTemplate) {
      setError("Please select a template first")
      return
    }

    const pattern = /\{([^}]+)\}/g
    const matches = [...new Set([...selectedTemplate.body.matchAll(pattern)].map((m) => m[1]))]

    const csvHeaders = matches.join(",") + "\n"

    const blob = new Blob([csvHeaders], { type: "text/csv" })

    // Create a download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = selectedTemplate.title + "_empty.csv" // File name
    document.body.appendChild(a)

    // Trigger download
    a.click()

    // Cleanup
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const navigateTo = (path: string) => {
    window.location.href = path
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
              onClick={() => navigateTo(`/${role}`)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <LayoutDashboard size={24} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>
            <button
              onClick={() => navigateTo("/manage-columns")}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Menu size={24} />
              {isSidebarOpen && <span className="ml-3">Column Mapping</span>}
            </button>
            <button
              onClick={() => navigateTo("/manage-templates")}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <FileText size={24} />
              {isSidebarOpen && <span className="ml-3">Manage Templates</span>}
            </button>
          </nav>
          <div className="p-4">
            <button
              onClick={() => {
                sessionStorage.clear()
                window.location.href = "/login"
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CSV Template System</h1>
                  <p className="mt-1 text-sm text-gray-500">Upload a CSV file, select a template, and generate PDFs</p>
                </div>
                {/* Credit Points Display */}
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded">Credit Points Left: {creditPoints}</div>
                </div>
              </div>
            </div>
            {/* Error Display */}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}
            {/* File Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload CSV File</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="relative inline-block">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        style={{ color: "transparent" }} // Hide filename
                      />
                    </div>
                  </div>
                </div>
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Template</label>
                  <div className="mt-1 flex items-center space-x-4">
                    <select
                      value={selectedTemplate?._id || "0"}
                      onChange={handleTemplateChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="0">Select template...</option>
                      {templates.map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={downloadEmptyCSV}
                      disabled={!selectedTemplate}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Download Sample CSV File
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* CSV Data Table */}
            {csvData.length > 0 && (
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedRowIndices.length === csvData.length && csvData.length > 0}
                              onChange={handleSelectAll}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                            />
                            Select
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Index
                        </th>
                        {headers.map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvData.map((row, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50 ${
                            selectedRowIndex === index
                              ? "bg-blue-50"
                              : selectedRowIndices.includes(index)
                                ? "bg-blue-100"
                                : ""
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedRowIndices.includes(index)}
                              onChange={() => handleRowSelection(index)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index}</td>
                          {headers.map((header) => (
                            <td key={header} className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {csvData.length > 0 && selectedRowIndices.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm mt-4 flex justify-end space-x-4">
                <span className="mr-auto text-sm text-gray-600 self-center">
                  {selectedRowIndices.length} rows selected
                </span>
                <button
                  onClick={downloadMultiplePDFs}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download Selected PDFs
                </button>
                <button
                  onClick={handleSendMultiple}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Selected Messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
