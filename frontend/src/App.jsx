import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Compress from './pages/Compress'
import Merge from './pages/Merge'
import Split from './pages/Split'
import OCR from './pages/OCR'
import PdfToWord from './pages/PdfToWord'
import PdfToExcel from './pages/PdfToExcel'
import Rotate from './pages/Rotate'
import Watermark from './pages/Watermark'
import Protect from './pages/Protect'
import UnlockPDF from './pages/Unlock'
import ChatPDF from './pages/ChatPDF'
import Summarize from './pages/Summarize'
import CreatePDF from './pages/CreatePDF'
import PdfToJpg from './pages/PdfToJpg'
import JpgToPdf from './pages/JpgToPdf'
import WordToPdf from './pages/WordToPdf'
import PageNumbers from './pages/PageNumbers'
import PdfToPpt from './pages/PdfToPpt'
import Navbar from './components/Navbar'
import './index.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compress" element={<Compress />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/split" element={<Split />} />
        <Route path="/ocr" element={<OCR />} />
        <Route path="/pdf-to-word" element={<PdfToWord />} />
        <Route path="/pdf-to-excel" element={<PdfToExcel />} />
        <Route path="/rotate" element={<Rotate />} />
        <Route path="/watermark" element={<Watermark />} />
        <Route path="/protect" element={<Protect />} />
        <Route path="/unlock" element={<UnlockPDF />} />
        <Route path="/chat-pdf" element={<ChatPDF />} />
        <Route path="/summarize" element={<Summarize />} />
        <Route path="/create-pdf" element={<CreatePDF />} />
        <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/word-to-pdf" element={<WordToPdf />} />
        <Route path="/page-numbers" element={<PageNumbers />} />
        <Route path="/pdf-to-ppt" element={<PdfToPpt />} />

      </Routes>
    </Router>
  )
}

export default App