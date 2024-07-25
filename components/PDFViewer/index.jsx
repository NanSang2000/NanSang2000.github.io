import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function PDFViewer (props: { file: string }) {
  const [numPages, setNumPages] = useState<number | null>(null)

  function onDocumentLoadSuccess ({ numPages }: { numPages: number }) {
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