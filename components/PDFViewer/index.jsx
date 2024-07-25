import React from 'react'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
function PDFViewer ({ file }) {
  return (
    <Worker workerUrl={'https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js'}>
      <div style={{ height: '750px' }}>
        <Viewer fileUrl={file} />
      </div>
    </Worker>
  )
}

export default PDFViewer
