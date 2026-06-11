import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Analyze    from './pages/Analyze';
import Dashboard  from './pages/Dashboard';
import Models     from './pages/Models';
import Completion from './pages/Completion';
import ApiDocs    from './pages/ApiDocs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Analyze />}    />
        <Route path="/dashboard"  element={<Dashboard />}  />
        <Route path="/models"     element={<Models />}     />
        <Route path="/completion" element={<Completion />} />
        <Route path="/api"        element={<ApiDocs />}    />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
