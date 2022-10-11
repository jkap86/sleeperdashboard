import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage';
import './App.css';
import View from './components/view';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path='/:username' element={<View />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;