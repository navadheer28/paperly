import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 300000 // 5 minutes
})

export const compressPDF = (file, quality, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('quality', quality)

  return API.post('/pdf/compress', formData, {
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / e.total)
      onProgress(percent)
    }
  })
}

export const mergePDFs = (files) => {
  const formData = new FormData()
  files.forEach(f => formData.append('files', f))
  return API.post('/pdf/merge', formData)
}

export const splitPDF = (file, pages) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('pages', pages)
  return API.post('/pdf/split', formData)
}

export const ocrPDF = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/pdf/ocr', formData)
}

export const pdfToWord = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/pdf/to-word', formData)
}

export const aiCreatePDF = (messages) => {
  return API.post('/ai/create', { messages })
}

export const chatWithPDF = (question, pdfText) => {
  return API.post('/ai/chat', { question, pdfText })
}

export const summarizePDF = (pdfText) => {
  return API.post('/ai/summarize', { pdfText })
}

export const pdfToExcel = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/pdf/to-excel', formData)
}

export const rotatePDF = (file, degrees) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('degrees', degrees)
  return API.post('/pdf/rotate', formData)
}

export const watermarkPDF = (file, text, opacity, position, color) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('text', text)
  formData.append('opacity', opacity)
  formData.append('position', position)
  formData.append('color', color)
  return API.post('/pdf/watermark', formData)
}

export const protectPDF = (file, password) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('password', password)
  return API.post('/pdf/protect', formData)
}

export const unlockPDF = (file, password) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('password', password)
  return API.post('/pdf/unlock', formData)
}

export const pdfToJpg = (file, quality) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('quality', quality)
  return API.post('/pdf/to-jpg', formData)
}

export const jpgToPdf = (files) => {
  const formData = new FormData()
  files.forEach(f => formData.append('files', f))
  return API.post('/pdf/jpg-to-pdf', formData)
}

export const wordToPdf = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/pdf/word-to-pdf', formData)
}

export const addPageNumbers = (file, position, startNumber, fontSize) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('position', position)
  formData.append('startNumber', startNumber)
  formData.append('fontSize', fontSize)
  return API.post('/pdf/page-numbers', formData)
}

export const pdfToPpt = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/pdf/to-ppt', formData)
}