const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { spawn } = require('child_process')
const fs = require('fs')

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

// Helper to run Python scripts
function runPython(script, args) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', script)
    const proc = spawn('python', [scriptPath, ...args])
    let output = ''
    let error = ''
    proc.stdout.on('data', (data) => output += data.toString())
    proc.stderr.on('data', (data) => error += data.toString())
    proc.on('close', (code) => {
      if (code === 0) resolve(output.trim())
      else reject(new Error(error))
    })
  })
}

// Compress PDF
router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`
    const quality = req.body.quality || 'medium'
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/compress.py', [inputPath, outputPath, quality])
    const originalSize = fs.statSync(inputPath).size
    const compressedSize = fs.statSync(outputPath).size
    res.json({
      success: true,
      downloadUrl: `http://localhost:5000/${outputPath}`,
      originalSize,
      compressedSize,
      savedPercent: Math.round((1 - compressedSize / originalSize) * 100)
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Merge PDFs
router.post('/merge', upload.array('files', 20), async (req, res) => {
  try {
    const inputPaths = req.files.map(f => f.path).join(',')
    const outputPath = `outputs/${uuidv4()}.pdf`
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/merge.py', [inputPaths, outputPath])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Split PDF
router.post('/split', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputDir = `outputs/${uuidv4()}/`
    const pages = req.body.pages || 'all'
    fs.mkdirSync(outputDir, { recursive: true })
    await runPython('./python/split.py', [inputPath, outputDir, pages])
    const files = fs.readdirSync(outputDir).map(f => ({
      name: f,
      downloadUrl: `http://localhost:5000/${outputDir}${f}`
    }))
    res.json({ success: true, files })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// OCR PDF
router.post('/ocr', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.txt`
    console.log('OCR started:', inputPath)
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    const text = await runPython('./python/ocr.py', [inputPath, outputPath])
    console.log('OCR done, text length:', text.length)
    res.json({ success: true, text, outputPath })
  } catch (err) {
    console.log('OCR ERROR:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

// PDF to Word
router.post('/to-word', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.docx`
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/to_word.py', [inputPath, outputPath])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PDF to Excel
router.post('/to-excel', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.xlsx`
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/to_excel.py', [inputPath, outputPath])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Rotate PDF
router.post('/rotate', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`
    const degrees = req.body.degrees || 90
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/rotate.py', [inputPath, outputPath, degrees])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Watermark PDF
router.post('/watermark', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`
    const { text, opacity, position, color } = req.body
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/watermark.py', [inputPath, outputPath, text, opacity, position, color || 'gray'])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Protect PDF
router.post('/protect', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`
    const { password } = req.body
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/protect.py', [inputPath, outputPath, password])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Unlock PDF
router.post('/unlock', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`
    const { password } = req.body
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    await runPython('./python/unlock.py', [inputPath, outputPath, password])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Create PDF from text
router.post('/create-from-text', async (req, res) => {
  try {
    const { content } = req.body
    const outputPath = `outputs/${uuidv4()}.pdf`
    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')
    const tempFile = `uploads/${uuidv4()}.txt`
    fs.writeFileSync(tempFile, content, 'utf-8')
    await runPython('./python/create_pdf.py', [tempFile, outputPath])
    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// PDF to JPG
router.post('/to-jpg', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputDir = `outputs/${uuidv4()}/`
    const quality = req.body.quality || 'high'

    fs.mkdirSync(outputDir, { recursive: true })

    await runPython('./python/to_jpg.py', [inputPath, outputDir, quality])

    const files = fs.readdirSync(outputDir).map(f => ({
      name: f,
      downloadUrl: `http://localhost:5000/${outputDir}${f}`
    }))

    res.json({ success: true, files })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// JPG to PDF
router.post('/jpg-to-pdf', upload.array('files', 20), async (req, res) => {
  try {
    const inputPaths = req.files.map(f => f.path).join(',')
    const outputPath = `outputs/${uuidv4()}.pdf`

    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')

    await runPython('./python/jpg_to_pdf.py', [inputPaths, outputPath])

    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// Word to PDF
router.post('/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`

    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')

    await runPython('./python/word_to_pdf.py', [inputPath, outputPath])

    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// Page Numbers
router.post('/page-numbers', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pdf`
    const { position, startNumber, fontSize } = req.body

    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')

    await runPython('./python/page_numbers.py', [inputPath, outputPath, position, startNumber, fontSize])

    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// PDF to PPT
router.post('/to-ppt', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path
    const outputPath = `outputs/${uuidv4()}.pptx`

    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')

    await runPython('./python/to_ppt.py', [inputPath, outputPath])

    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
// Merge multiple output files into one PDF
router.post('/merge-outputs', async (req, res) => {
  try {
    const { filePaths } = req.body
    const outputPath = `outputs/${uuidv4()}.pdf`

    if (!fs.existsSync('outputs/')) fs.mkdirSync('outputs/')

    const inputPaths = filePaths.join(',')
    await runPython('./python/merge.py', [inputPaths, outputPath])

    res.json({ success: true, downloadUrl: `http://localhost:5000/${outputPath}` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})
module.exports = router