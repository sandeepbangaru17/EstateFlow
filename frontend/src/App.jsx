import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<div className="container" style={{marginTop:'2rem'}}><h2>Listings soon...</h2></div>} />
          <Route path="dashboard" element={<div className="container" style={{marginTop:'2rem'}}><h2>Dashboard soon...</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
