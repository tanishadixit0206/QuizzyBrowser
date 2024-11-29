import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import PreviousQuestions from './pages/PreviousBookmarks';
import StartInterview from './pages/StartInterview';

const App:React.FC = () =>{
  return(
    <div className='App'>
      <header className='App-header'>
        <BrowserRouter>
        <Routes>
            <Route element={<LandingPage />} path='/' /> 
            <Route element={<PreviousQuestions />} path='/prevQ'/>
            <Route element={<StartInterview />} path='/start'/>
        </Routes>
        </BrowserRouter>
      </header>
    </div>
  )
}

export default App;