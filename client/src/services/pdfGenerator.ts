// const downloadPDF = (htmlFormatedText: string) => {
//     const doc = new jsPDF({
//       orientation: "p",
//       format: "a4",
//       unit: "px",
//       hotfixes: ["px_scaling"],
//     });

//     doc.addFileToVFS('NotoSansDevanagari-Regular.ttf', '../assets/TiroDevanagariHindi-Regular.ttf');
//     doc.addFont('../assets/TiroDevanagariHindi-Regular.ttf', 'NotoSansDevanagari', 'normal');
//     // Set the font for Hindi text
//     doc.setFont('NotoSansDevanagari');
   

  
//   //   // Load the letterhead image q
//     const letterheadImage = sessionStorage.getItem("letterHead");
    
//   // // Replace with the actual path or base64
  
//     const imgWidth = doc.internal.pageSize.getWidth();
//     // @ts-ignore
//     const imgHeight = 50; // Adjust height as needed Ensure text doesn't overlap with image
    
//   //   // Add Letterhead Image


//   //   // Text properties
//     try {
//     // @ts-ignore
//       doc.html(htmlFormatedText, {
//         // @ts-ignore
//         callback(doc) {
//           doc.addFileToVFS('NotoSansDevanagari-Regular.ttf', '../assets/TiroDevanagariHindi-Regular.ttf');
//           doc.addFont('../assets/TiroDevanagariHindi-Regular.ttf', 'NotoSansDevanagari', 'normal');
//            // Set the font for Hindi text
//            doc.setFont('NotoSansDevanagari');
//           doc.output("dataurlnewwindow");
//         },
        
//         x: 0,
//         y:160,
//         autoPaging: "text",
//         margin: 10,
        
//         width: 500,
//         windowWidth: 595,
//       });

//       if (letterheadImage) {
//         doc.addImage(letterheadImage, "PNG", 0, 0, imgWidth, 150);
//       }
   

//       // Save the PDF
//       doc.save(`template-"download".pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };


//   export{
//     downloadPDF
//   }











import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { CSVRow } from "../screens/CSVUploadPage"

// Function to convert HTML to PDF with proper Indic language support
export const downloadPDF = async (htmlFormatedText: string, row:   CSVRow, templateName: string, pdfNameColumn: string) => {
  try {
    // Create a temporary container for the HTML content
    const container = document.createElement("div")
    container.innerHTML = htmlFormatedText
    container.style.width = "595px" // A4 width in pixels at 72 DPI
    container.style.fontFamily = "'Noto Sans Devanagari', Arial, sans-serif"
    container.style.padding = "20px"
    document.body.appendChild(container)
    container.style.fontSize = "12px";

    // Get letterhead from session storage if available
    const letterheadImage = sessionStorage.getItem("letterHead")

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    })

    // First, render the HTML content to a canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
    })

    // Remove the temporary container
    document.body.removeChild(container)

    // Get dimensions
    const imgWidth = doc.internal.pageSize.getWidth()
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    

    // Add letterhead if available
    let yOffset = 0
    if (letterheadImage) {
      const headerHeight = 70
      doc.addImage(letterheadImage, "PNG", 0, 0, imgWidth, headerHeight)
      yOffset = headerHeight
    }

    // Add the rendered HTML content
    const contentDataUrl = canvas.toDataURL("image/png")
    doc.addImage(contentDataUrl, "PNG", 0, yOffset, imgWidth, imgHeight)

    console.log(row)
    var username = row[pdfNameColumn]
    // Save the PDF
    console.log("Saving PDF with name:", `${username}-${templateName}.pdf`)
    doc.save(`${username}-${templateName}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
  }
}
