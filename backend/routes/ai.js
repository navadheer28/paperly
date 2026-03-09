const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Chat with PDF
router.post('/chat', async (req, res) => {
  try {
    const { question, pdfText } = req.body

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Answer questions based on the PDF content provided. Be clear and concise.'
        },
        {
          role: 'user',
          content: `PDF Content:\n${pdfText.substring(0, 5000)}\n\nQuestion: ${question}`
        }
      ],
      max_tokens: 512,
    })

    const answer = completion.choices[0].message.content
    res.json({ success: true, answer })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Summarize PDF
router.post('/summarize', async (req, res) => {
  try {
    const { pdfText } = req.body

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes documents clearly and concisely.'
        },
        {
          role: 'user',
          content: `Summarize this PDF with key points and conclusion:\n\n${pdfText.substring(0, 5000)}`
        }
      ],
      max_tokens: 512,
    })

    const summary = completion.choices[0].message.content
    res.json({ success: true, summary })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// AI Create PDF
router.post('/create', async (req, res) => {
  try {
    const { messages } = req.body
    const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n')

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a document content generator. ONLY output the actual document content in markdown format. NEVER mention PDF, downloading, or software instructions. Just write the document content directly as if it is the final document.'
        },
        {
          role: 'user',
          content: `Based on this conversation, generate ONLY the document content in markdown format. Do NOT include any intro sentence like "Here is..." or "I have created...". Do NOT include any outro or instructions. Start directly with the document title and content:\n\n${conversation}`
        }
      ],
      max_tokens: 1024,
    })

    const content = completion.choices[0].message.content
    res.json({ success: true, content })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router