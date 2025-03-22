// import React, { useState, useRef, useEffect } from "react";
// import Papa from "papaparse";
// import { jsPDF } from "jspdf";
// import axios from "axios";
// import { LayoutDashboard, FileText, Menu } from 'lucide-react';
// import { ITemplate } from "../interface";

// interface CSVRow {
//   [key: string]: string;
// }

// export default function CSVTemplatePage() {
//   const [templates, setTemplates] = useState<ITemplate[]>([]);
//   const [csvData, setCSVData] = useState<CSVRow[]>([]);
//   const [headers, setHeaders] = useState<string[]>([]);
//   const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null);
//   const [selectedRow, setSelectedRow] = useState<CSVRow | null>(null);
//   const [previewText, setPreviewText] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [creditPoints, setCreditPoints] = useState(0); // New state for credit points
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const base_url = "http://localhost:8000";
//   const role = sessionStorage.getItem('role');

//   useEffect(() => {
//     fetchData();
//     fetchCreditPoints();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       const company = sessionStorage.getItem('company');
//       const response = await axios.get(`${base_url}/templates/?company=${company}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setTemplates(response.data);
//     } catch (err: any) {
//       alert(err.response?.data.error.message);
//     }
//   };

//   const fetchCreditPoints = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       const company = sessionStorage.getItem('company')
      
//       const response = await axios.get(`${base_url}/companies/?company=${company}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCreditPoints(response.data.credit);
//     } catch (err: any) {
//       alert(err.response?.data.error.message);
//     }
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       Papa.parse(file, {
//         header: true,
//         complete: (results) => {
//           const data = results.data as CSVRow[];
//           setCSVData(data);
//           if (data.length > 0) {
//             setHeaders(Object.keys(data[0]));
//           }
//         },
//         error: (error) => {
//           console.error("Error parsing CSV:", error);
//           setError("Error parsing CSV file");
//         },
//       });
//     }
//   };

//   const handleRowClick = (row: CSVRow) => {
//     if (!selectedTemplate) {
//       setError("Please select a template first");
//       return;
//     }
//     setError(null);
//     setSelectedRow(row);
//     const text = replaceTemplateVariables(selectedTemplate.body, row);
//     setPreviewText(text);
//     setShowPreview(true);
//   };

//   const replaceTemplateVariables = (template: string, data: CSVRow) => {
//     // return template.replace(/\{(\w+)\}/g, (match, key) => (data[key] || match));
//     return template.replace(/\{(\w+)\}/g, (match, key) => {
//       if(!data[key])
//         setError("Field not present")

//       return data[key]
//     });

//   };

//   const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const templateId = e.target.value;
//     if (!templateId) {
//       setSelectedTemplate(null);
//       setPreviewText("");
//       return;
//     }
//     const template = templates.find((t) => t._id === templateId);
//     if (template) {
//       setSelectedTemplate(template);
//       if (selectedRow) {
//         const text = replaceTemplateVariables(template.body, selectedRow);
//         setPreviewText(text);
//       }
//     }
//   };

//   const downloadTemplate = () => {
//     if (!selectedTemplate || !selectedRow) {
//       setError("Please select both a template and a row");
//       return;
//     }
//     const doc = new jsPDF();
//     const text = replaceTemplateVariables(selectedTemplate.body, selectedRow);
//     doc.setFontSize(12);
//     const lineHeight = 7;
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 20;
//     const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
//     textLines.forEach((line: string, index: number) => {
//       doc.text(line, margin, margin + index * lineHeight);
//     });
//     doc.save(`template-${selectedRow.title || "download"}.pdf`);
//   };

//   const handleSend = async () => {
//     if (!selectedTemplate || !selectedRow) {
//       setError("Please select both a template and a row");
//       return;
//     }
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       alert("Message sent successfully!");
//       setShowPreview(false);
//     } catch (err) {
//       setError("Failed to send message");
//     }
//   };

//   const downloadEmptyTemplate = () => {
//     if (!selectedTemplate) {
//       setError("Please select a template first");
//       return;
//     }
//     const doc = new jsPDF();
//     doc.setFontSize(12);
//     const lineHeight = 7;
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 20;
//     const textLines = doc.splitTextToSize(selectedTemplate.body, pageWidth - 2 * margin);
//     textLines.forEach((line: string, index: number) => {
//       doc.text(line, margin, margin + index * lineHeight);
//     });
//     doc.save(`empty-template-${selectedTemplate._id}.pdf`);
//   };

//   const navigateTo = (path: string) => {
//     window.location.href = path;
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
//         <div className="h-full flex flex-col">
//           <div className="p-4 flex items-center justify-between">
//             {isSidebarOpen && <h2 className="text-xl font-semibold text-gray-800">Menu</h2>}
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="p-2 rounded-lg hover:bg-gray-100"
//             >
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
//               onClick={() => navigateTo('/manage-templates')}
//               className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             >
//               <FileText size={24} />
//               {isSidebarOpen && <span className="ml-3">Manage Templates</span>}
//             </button>
//           </nav>
//           <div className="p-4">
//             <button
//               onClick={() => {
//                 sessionStorage.clear();
//                 window.location.href = "/login";
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
//                   <div className="bg-blue-500 text-white px-2 py-1 rounded">
//                     Credit Points Left: {creditPoints}
//                   </div>
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
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       accept=".csv"
//                       onChange={handleFileUpload}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                     />
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
//                       onClick={downloadEmptyTemplate}
//                       disabled={!selectedTemplate}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Download Empty Template
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
//                           key={index}
//                           onClick={() => handleRowClick(row)}
//                           className={`cursor-pointer hover:bg-gray-50 ${selectedRow === row ? "bg-blue-50" : ""}`}
//                         >
//                           {headers.map((header) => (
//                             <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
//             {/* Preview Modal */}
//             {showPreview && (
//               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-lg max-w-2xl w-full p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
//                     <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-500">
//                       <span className="sr-only">Close</span>
//                       <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="bg-gray-50 p-6 rounded-md mb-6">
//                     <p className="text-gray-800 whitespace-pre-wrap">{previewText}</p>
//                   </div>
//                   <div className="flex justify-end space-x-4">
//                     <button
//                       onClick={downloadTemplate}
//                       className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                       Download PDF
//                     </button>
//                     <button
//                       onClick={handleSend}
//                       className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                       Send
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Papa from "papaparse"
import { jsPDF } from "jspdf"
import axios from "axios"
import { LayoutDashboard, FileText, Menu } from "lucide-react"
import type { ITemplate } from "../interface"

interface CSVRow {
  [key: string]: string
}

export default function CSVTemplatePage() {
  const [templates, setTemplates] = useState<ITemplate[]>([])
  const [csvData, setCSVData] = useState<CSVRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null)
  const [selectedRow, setSelectedRow] = useState<CSVRow | null>(null)
  const [previewText, setPreviewText] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [creditPoints, setCreditPoints] = useState(0) // New state for credit points
  const fileInputRef = useRef<HTMLInputElement>(null)
  const base_url = "http://localhost:8000"
  const role = sessionStorage.getItem("role")

  useEffect(() => {
    fetchData()
    fetchCreditPoints()
  }, [])

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token")
      const company = sessionStorage.getItem("company")
      const response = await axios.get(`${base_url}/templates/?company=${company}`, {
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

      const response = await axios.get(`${base_url}/companies/?company=${company}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCreditPoints(response.data.credit)
    } catch (err: any) {
      alert(err.response?.data.error.message)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as CSVRow[]
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

  const handleRowClick = (row: CSVRow) => {
    if (!selectedTemplate) {
      setError("Please select a template first")
      return
    }
    setError(null)
    setSelectedRow(row)
    try {
      const text = replaceTemplateVariables(selectedTemplate.body, row)
      setPreviewText(text)
      if (!error) {
        setShowPreview(true)
      }
    } catch (err) {
      // setError("Error generating preview")
    }
  }

  const replaceTemplateVariables = (template: string, data: CSVRow) => {
    let hasError = false
    const result = template.replace(/\{(\w+)\}/g, (match, key) => {
      if (!data[key]) {
        hasError = true
        setError(`Field "${key}" not present in CSV data`)
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
    if (!templateId) {
      setSelectedTemplate(null)
      setPreviewText("")
      return
    }
    const template = templates.find((t) => t._id === templateId)
    if (template) {
      setSelectedTemplate(template)
      if (selectedRow) {
        const text = replaceTemplateVariables(template.body, selectedRow)
        setPreviewText(text)
      }
    }
  }

  const downloadTemplate = () => {
    if (!selectedTemplate || !selectedRow) {
      setError("Please select both a template and a row")
      return
    }
    const doc = new jsPDF()
    const text = replaceTemplateVariables(selectedTemplate.body, selectedRow)
    doc.setFontSize(12)
    const lineHeight = 7
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin)
    textLines.forEach((line: string, index: number) => {
      doc.text(line, margin, margin + index * lineHeight)
    })
    doc.save(`template-${selectedRow.title || "download"}.pdf`)
  }

  const handleSend = async () => {
    if (!selectedTemplate || !selectedRow) {
      setError("Please select both a template and a row")
      return
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Message sent successfully!")
      setShowPreview(false)
    } catch (err) {
      setError("Failed to send message")
    }
  }

  const downloadEmptyTemplate = () => {
    if (!selectedTemplate) {
      setError("Please select a template first")
      return
    }
    const doc = new jsPDF()
    doc.setFontSize(12)
    const lineHeight = 7
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const textLines = doc.splitTextToSize(selectedTemplate.body, pageWidth - 2 * margin)
    textLines.forEach((line: string, index: number) => {
      doc.text(line, margin, margin + index * lineHeight)
    })
    doc.save(`empty-template-${selectedTemplate._id}.pdf`)
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
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
                      onClick={downloadEmptyTemplate}
                      disabled={!selectedTemplate}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Download Empty Template
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
                          onClick={() => handleRowClick(row)}
                          className={`cursor-pointer hover:bg-gray-50 ${selectedRow === row ? "bg-blue-50" : ""}`}
                        >
                          {headers.map((header) => (
                            <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            {/* Preview Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                    <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-md mb-6 max-h-[50vh] overflow-y-auto">
                    <p className="text-gray-800 whitespace-pre-wrap">{previewText}</p>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={downloadTemplate}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={handleSend}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

