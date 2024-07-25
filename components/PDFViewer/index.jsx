import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/TextLayer.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
function PDFViewer (props) {
    const [numPages, setNumPages] = useState(null)

    function onDocumentLoadSuccess ({ numPages }) {
        setNumPages(numPages)
    }

    return (
        <div>
            <Document
                file={props.file}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages || 0), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    )
}

export default PDFViewer
