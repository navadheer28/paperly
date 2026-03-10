const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')

dotenv.config()

const app = express()
const server = createServer(app)
server.timeout = 300000
server.keepAliveTimeout = 300000
const wss = new WebSocketServer({ server })

// Middleware
app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use('/uploads', express.static('uploads'))
app.use('/outputs', (req, res, next) => {
  res.setHeader('Content-Disposition', 'attachment')
  next()
}, express.static('outputs'))

// WebSocket
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket')
  ws.on('close', () => console.log('Client disconnected'))
})
app.set('wss', wss)

// Routes
const pdfRoutes = require('./routes/pdf')
const aiRoutes = require('./routes/ai')
app.use('/api/pdf', pdfRoutes)
app.use('/api/ai', aiRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Paperly Backend Running! 🚀' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})