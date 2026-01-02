import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Body from './Body';
import Scoragami from './Scoragami';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/scoragami" element={<Scoragami />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
