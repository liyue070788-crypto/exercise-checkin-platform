import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CheckinPage from './pages/CheckinPage';
import RecordsPage from './pages/RecordsPage';
import StatsPage from './pages/StatsPage';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CheckinPage />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;