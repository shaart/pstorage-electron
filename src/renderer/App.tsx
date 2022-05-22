import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Passwords from './Passwords';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Passwords />} />
      </Routes>
    </Router>
  );
}
