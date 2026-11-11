import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PhysicsLab from './pages/PhysicsLab';
import ChemistryLab from './pages/ChemistryLab';
import MyExperiments from './pages/MyExperiments';
import MyProgress from './pages/MyProgress';
import Settings from './pages/Settings';
import ExperimentPage from './pages/ExperimentPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        {({ searchQuery }) => (
          <Routes>
            <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/physics" element={<PhysicsLab />} />
            <Route path="/chemistry" element={<ChemistryLab />} />
            <Route path="/experiments" element={<MyExperiments />} />
            <Route path="/progress" element={<MyProgress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/experiment/:id" element={<ExperimentPage />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
  );
}
