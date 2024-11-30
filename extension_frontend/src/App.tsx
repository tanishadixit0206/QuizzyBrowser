
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Questions from './pages/Questions';


function App() {
  return (
    <Router>
      <div className='min-w-[400px]'>
        
        <nav className='flex space-between'>
          <Link to="/">Home</Link>
          <Link to="/questions">Questions</Link>
        </nav>

        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
