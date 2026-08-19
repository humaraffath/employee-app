import { useRef, useState } from 'react'
import { chatApi } from '../services/chatApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

export function RagUploadPage() {
  const [pdfFile, setPdfFile] = useState(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const pdfInputRef = useRef(null)

  const handlePdfUpload = async (event) => {
    event.preventDefault()
    if (!pdfFile) {
      return
    }

    const isPdfType = pdfFile.type === 'application/pdf'
    const isPdfName = pdfFile.name.toLowerCase().endsWith('.pdf')
    if (!isPdfType && !isPdfName) {
      setSuccessMessage('')
      setErrorMessage('Please choose a PDF file.')
      return
    }

    setIsUploadingPdf(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const responseMessage = await chatApi.uploadPdf(pdfFile)
      setSuccessMessage(
        typeof responseMessage === 'string' && responseMessage
          ? responseMessage
          : 'PDF uploaded successfully.',
      )
      setPdfFile(null)
      if (pdfInputRef.current) {
        pdfInputRef.current.value = ''
      }
    } catch (error) {
      setSuccessMessage('')
      setErrorMessage(getErrorMessage(error, 'Failed to upload PDF.'))
    } finally {
      setIsUploadingPdf(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="mb-3">
          <h1 className="h3 page-title mb-1">RAG Upload</h1>
          <p className="text-muted mb-0">Upload PDF files for knowledge ingestion.</p>
        </div>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handlePdfUpload}>
              <div className="mb-3">
                <label htmlFor="pdf-upload" className="form-label">
                  PDF file
                </label>
                <input
                  id="pdf-upload"
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="form-control"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] ?? null
                    setPdfFile(selectedFile)
                    setSuccessMessage('')
                  }}
                  disabled={isUploadingPdf}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={isUploadingPdf || !pdfFile}>
                  {isUploadingPdf ? 'Uploading...' : 'Upload PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
