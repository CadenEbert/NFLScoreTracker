import './App.css';
import Header from './Header';
import ScoreList from './ScoreList';

function App() {
  return (
    
    <div className="App">
      <Header />
      <main className="main-content">
        <ScoreList />
      </main>
      {/* Footer can be added here if needed */}
    </div>
  );
}

export default App;
