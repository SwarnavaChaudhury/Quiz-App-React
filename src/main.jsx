import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import QuizAdd from './pages/QuizAdd.jsx'
import QuizView from './pages/QuizView.jsx'
import QuizSingle from './pages/QuizSingle.jsx'
import MainContext from './MainContext.jsx'

createRoot(document.getElementById('root')).render(

  <MainContext>
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<QuizAdd />} />
        <Route path='/view' element={<QuizView />} />
        <Route path='/single' element={<QuizSingle />} />
      </Routes>
    </BrowserRouter>

  </MainContext>

)
