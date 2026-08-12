# 📄 Paperly

### AI-Powered PDF Toolkit

Paperly is a full-stack web application that provides a collection of PDF utilities along with AI-powered document features. It allows users to manipulate, convert, process, and interact with PDF documents through a modern web interface.

🔗 **Live Demo:** [paperly-iota.vercel.app](https://paperly-iota.vercel.app/)

---

## ✨ Features

### 📑 PDF Tools

- Compress PDF
- Merge PDFs
- Split PDFs
- Rotate PDFs
- Add watermarks
- Protect PDFs with passwords
- Unlock PDFs
- Add page numbers
- Create PDFs from text

### 🔄 File Conversion

- PDF → Word
- PDF → Excel
- PDF → JPG
- PDF → PowerPoint
- JPG → PDF
- Word → PDF

### 🤖 AI Features

- 💬 Chat with PDF documents
- 📝 Generate PDF summaries
- ✨ Generate document content using AI
- 🤖 AI-powered document processing

### 🔍 Document Processing

- OCR for extracting text from PDFs
- File upload and processing
- Download generated documents
- Real-time communication using WebSockets

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- PDF.js
- React Dropzone

### Backend

- Node.js
- Express.js
- WebSockets
- Multer
- REST APIs

### PDF Processing

- Python
- Custom Python processing scripts

### AI

- Claude AI
- AI-powered document processing

---

## 🏗️ Project Architecture

```text
Paperly
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── ai.js
│   │   └── pdf.js
│   ├── python/
│   ├── uploads/
│   ├── outputs/
│   ├── index.js
│   └── package.json
│
└── .gitignore
