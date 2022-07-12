import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './Footer';
import Main from './Main';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
        <hr/>
        <Footer/>
      </div>
    </Router>
  );
}
