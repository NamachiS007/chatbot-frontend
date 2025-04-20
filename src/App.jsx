// src/App.jsx:
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ChatPage />} />
          {/* Add any additional routes here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;