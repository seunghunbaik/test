import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddReceiptPage from './pages/AddReceiptPage';
import ReceiptListPage from './pages/ReceiptListPage';
import SummaryPage from './pages/SummaryPage';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-logo">🍱 점심 영수증</span>
          <nav className="header-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>홈</NavLink>
            <NavLink to="/list" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>목록</NavLink>
            <NavLink to="/summary" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>통계</NavLink>
            <NavLink to="/add" className="nav-link nav-add">+ 추가</NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddReceiptPage />} />
          <Route path="/edit/:id" element={<AddReceiptPage />} />
          <Route path="/list" element={<ReceiptListPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
