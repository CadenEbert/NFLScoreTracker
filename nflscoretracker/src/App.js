import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Body from './Body';
import Scorigami from './Scorigami';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/scorigami" element={<Scorigami />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
