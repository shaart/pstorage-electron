import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const Passwords = () => {
  return <div>Place for a table with passwords</div>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Passwords />} />
      </Routes>
    </Router>
  );
}
