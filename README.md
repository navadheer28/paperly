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

🚀 Getting Started
1. Clone the repository
git clone https://github.com/navadheer28/paperly.git
cd paperly
2. Install frontend dependencies
cd frontend
npm install
3. Start the frontend
npm run dev
4. Install backend dependencies

Open another terminal:

cd backend
npm install
5. Configure environment variables

Create a .env file inside the backend directory and add the required API credentials.

Example:

GROQ_API_KEY=your_api_key_here
PORT=5000

Important: Never commit your real API keys or .env file to GitHub.

6. Start the backend
node index.js
🔐 Security
API keys are managed through environment variables.
Sensitive credentials are kept outside the source code.
Uploaded files are processed through the backend.
Generated files are returned through backend endpoints.
.env files are excluded from version control.
🎯 Project Goals

Paperly was developed to bring commonly used PDF operations and AI-powered document features into a single web application.

The project demonstrates:

Full-stack web development
REST API development
File upload and processing
Python integration with Node.js
AI API integration
PDF manipulation
OCR-based document processing
Frontend routing and component development
WebSocket-based communication
Modern responsive UI development
🔮 Future Improvements
User authentication
Cloud file storage
Improved document privacy
More AI models
Batch document processing
Better mobile responsiveness
Automated testing
CI/CD pipeline
Advanced document management
👨‍💻 Author

Sai Navadheer Reddy

Computer Science Engineering Student

💼 LinkedIn
🐙 GitHub
📧 Email
