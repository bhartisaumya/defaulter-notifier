import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { CSVRow } from "../screens/CSVUploadPage"

// Function to convert HTML to PDF with proper Indic language support
export const downloadPDF = async (htmlFormatedText: string, row:   CSVRow, templateName: string, pdfNameColumn: string, erroFunc: any) => {
  try {
    // Create a temporary container for the HTML content
   // 1. Inject Quill stylesheet early so it loads before rendering
const quillStyle = document.createElement("link");
quillStyle.rel = "stylesheet";
quillStyle.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
document.head.appendChild(quillStyle);


// 2. Wait a short time to allow CSS to load (optional but safer)
await new Promise(resolve => setTimeout(resolve, 100));

// 3. Create and style container
const container = document.createElement("div");
container.innerHTML = htmlFormatedText;
container.style.width = "595px"; // A4 width in pixels at 72 DPI
container.style.fontFamily = "'Noto Sans Devanagari', Arial, sans-serif";
container.style.padding = "20px";
container.style.fontSize = "12px";
document.body.appendChild(container);
const quillStyles = `
  .ql-align-center {
    text-align: center !important;
  }

  .ql-align-left {
    text-align: left !important;
  }

  .ql-align-right {
    text-align: right !important;
  }

  .ql-align-justify {
    text-align: justify !important;
  }
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = quillStyles;
document.head.appendChild(styleTag);

// 4. Get letterhead (if needed later)
const letterheadImage = sessionStorage.getItem("letterHead");

// 5. Create PDF doc
const doc = new jsPDF({
  orientation: "portrait",
  unit: "px",
  format: "a4",
});

// 6. Render to canvas
const canvas = await html2canvas(container, {
  scale: 2,
  useCORS: true,
  logging: false,
  allowTaint: true,
});

// 7. Clean up DOM
document.body.removeChild(container);

// (Optional) Use canvas to add content to PDF...


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
    if (!username){
      console.error("Username not found in the row data")
      erroFunc("Username not found in the row data")
    }
    // Save the PDF
    console.log("Saving PDF with name:", `${username}-${templateName}.pdf`)
    doc.save(`${username}-${templateName}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
  }
}

