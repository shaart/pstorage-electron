import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './Footer';
import Main from './Main';

export default function App() {
  return (
    <Router>
      {/* todo adaptive */}
      <div style={{ height: 600, width: 800}}>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}
