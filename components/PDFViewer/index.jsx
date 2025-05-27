import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// 仅在客户端设置worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

function PDFViewer (props) {
  const [numPages, setNumPages] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  function onDocumentLoadSuccess ({ numPages }) {
    setNumPages(numPages)
  }

  // 仅在客户端渲染PDF组件
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-gray-500">Loading PDF...</div>
      </div>
    )
  }

  return (
    <div>
      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.warn('PDF load error:', error)
        }}
      >
        {Array.from(new Array(numPages || 0), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  )
}

export default PDFViewer

